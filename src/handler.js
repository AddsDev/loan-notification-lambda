const logger = require("./infrastructure/logging/logger");
const { validateDecisionEvent } = require("./domain/decisionSchema");
const SESEmailAdapter = require("./infrastructure/email/SESEmailAdapter");
const NotifiDecisionUseCase = require("./application/NotifyDecisionUseCase");

const REGION = process.env.AWS_REGION || "us-east-1";
const SES_SENDER = process.env.SES_SENDER;

const emailPort = new SESEmailAdapter({ region: REGION, sender: SES_SENDER });
const usecase = new NotifiDecisionUseCase({ emailPort });

exports.handler = async (event) => {
  const failures = [];
  logger.info("Lambda start:", { records: event?.Records?.length || 0 });

  await Promise.all(
    (event.Records || []).map(async (rec) => {
      try {
        const body = JSON.parse(rec.body);
        const isValid = validateDecisionEvent(body);
        if (!isValid) {
          logger.warn("invalid payload", {
            messageId: rec.messageId,
            errors: validateDecisionEvent.errors,
          });
          throw new Error("INVALID_PAYLOAD");
        }

        // Tener presente para posterioridad
        //const traceId = rec.messageAttributes?.traceId?.stringValue
        
        await usecase.execute({
          loanId: body.loanId,
          email: body.email,
          decision: body.decision,
          reason: body.reason || null,
          createdAt: body.createdAt,
          payload: body.payload || null,
        })

      } catch (err) {
        logger.error("handler failed", { messageId: rec.messageId, error: err.message, record: rec });
        failures.push({ itemIdentifier: rec.messageId });// SQS specific
      }
    })
  );

  logger.info("lambda end", { failures: failures.length });
  return { batchItemFailures: failures };
};
