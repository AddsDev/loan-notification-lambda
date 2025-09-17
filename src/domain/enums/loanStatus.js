const LoanStatus = Object.freeze({
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REVIEW_MANUAL: "REVIEW_MANUAL"
});
const LoanStatusValues = Object.freeze(Object.values(LoanStatus));
const isLoanStatus = (v) => LoanStatusValues.includes(v);

module.exports = { LoanStatus, LoanStatusValues, isLoanStatus };
