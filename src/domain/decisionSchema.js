const { LoanStatusValues } = require("../domain/enums/loanStatus");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true })
const addFormats = require("ajv-formats");

addFormats(ajv)

const decisionEventSchema = {
  type: "object",
  additionalProperties: true,
  required: ["eventName", "eventVersion", "loanId", "email", "decision", "createdAt"],
  properties: {
    eventName: { type: "string" },
    eventVersion: { type: "integer", minimum: 1 },
    email: {type: "string", format: "email"},
    loanId: { type: "string", format: "uuid" },
    decision: { type: "string", enum: LoanStatusValues },
    reason: { type: ["string", "null"] },
    createdAt: { type: "string", format: "date-time" },
    payload: { type: ["object", "null"] },
  },
};

const validateDecisionEvent = ajv.compile(decisionEventSchema)
module.exports = { validateDecisionEvent }
