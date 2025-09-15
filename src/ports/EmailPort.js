class EmailPort {

    /**
     * @param {Object} input 
     * @param {string} input.to
     * @param {string} input.subject
     * @param {string} input.bodyHtml
     * @param {string} input.bodyText
     * @param {Array<name:string,value:string>} [input.tags]
     * @returns {Promise<void>}
     */
    async send(input) {
        throw new Error("Not implemeted")
    }
}

module.exports = EmailPort;