const logger = require("../infrastructure/logging/logger");
const { ErrorFlag } = require("../domain/errors/errorFlag");
const { LoanStatus } = require("../domain/enums/loanStatus");
const {
  subjApproved,
  subjRejected,
  subjManual,
  htmlApproved,
  htmlRejected,
  htmlManual,
  textApproved,
  textRejected,
  textManual,
} = require("../util/templates");

class NotifyDecisionUseCase {
  /**
   * @param {{emailPort: import("../ports/EmailPort")}} deps
   */
  constructor({ emailPort }) {
    this.emailPort = emailPort;
  }

  async execute(event) {
    if (!event || !event.loanId || !event.email || !event.decision) {
      throw new Error(ErrorFlag.INVALID_EVENT);
    }
    const { loanId, email, decision, reason, createdAt, payload } = event;
    const fields = { loanId, decision, email, reason, createdAt, payload };
    logger.trace("NotifyDecisionUseCase execute", fields);

    let subject, html, text;
    switch (decision) {
      case LoanStatus.APPROVED: {
        subject = subjApproved(loanId);
        html = htmlManual(loanId, reason ?? null, payload ?? null);
        text = textApproved(loanId);
        break;
      }

      case LoanStatus.REJECTED: {
        subject = subjRejected(loanId);
        html = htmlRejected(loanId, reason ?? null);
        text = textRejected(loanId, reason ?? null);
        break;
      }

      case LoanStatus.REVIEW_MANUAL: {
        subject = subjManual(loanId);
        html = htmlManual(loanId, reason ?? null, payload ?? null);
        text = textManual(loanId);
        break;
      }

      default: {
        throw new Error(ErrorFlag.UNSUPPORTED_DECISION);
      }
    }
    logger.trace("Send email SES", fields, subject, text,html);

    await this.emailPort.send({
      to: email,
      subject,
      bodyHtml: html,
      bodyText: text,
      tags: [
        { name: "event", value: "loanDecision" },
        { name: "decision", value: decision },
      ],
    });
    logger.trace("uc notify success", fields);
  }
}

module.exports = NotifyDecisionUseCase;
