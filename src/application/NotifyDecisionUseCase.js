const logger = require('../infrastructure/logging/logger')
const {subjApproved, subjRejected,subjManual, htmlApproved, htmlRejected, htmlManual, textApproved, textRejected, textManual} = require('../util/templates')

class NotifyDecisionUseCase {
    
    /**
     * @param {{emailPort: import("../ports/EmailPort")}} deps 
     */
    constructor({emailPort}) {
        this.emailPort = emailPort
    }

    async execute(event) {
        if(!event || !event.loanId || !event.email || !event.decision) {
            throw new Error("INVALID_EVENT")
        }
        const { loanId, email, decision, reason, createdAt, payload } = event
        const fields = {loanId , decision, email, reason, createdAt, payload}
        logger.trace("NotifyDecisionUseCase execute", fields)

        let subject, html, text;
        if(decision === "APPROVED") {
            subject = subjApproved(loanId)
            html = htmlApproved(loanId)
            text = textApproved(loanId)
        } else if(decision === "REJECTED") {
            subject = subjRejected(loanId)
            html = htmlRejected(loanId, reason || null)
            text = textRejected(loanId, reason || null)
        } else if(decision === "REVIEW_MANUAL") {
            subject = subjManual(loanId)
            html = htmlManual(loanId, reason || null, payload || null)
            text = textManual(loanId)
        } else {
            throw new Error("UNSUPPORTED_DECISION")
        }
        logger.trace("Send email SES", fields)

        await this.emailPort.send({
            to: email,
            subject,
            bodyHtml: html,
            bodyText: text,
            tags: [
                {name: "event", value: "loanDecision"},
                {name: "decision", value: decision},
            ]
        })
        logger.trace("uc notify success", fields)
    }
}

module.exports = NotifyDecisionUseCase