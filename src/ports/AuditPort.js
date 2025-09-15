class AuditPort {
    /**
     * @param {Object} eventSummary 
     * @returns {Promise<void>}
     */
    async publish(eventSummary) {
        throw new Error("Not implemeted")
    }
}

module.export = AuditPort;