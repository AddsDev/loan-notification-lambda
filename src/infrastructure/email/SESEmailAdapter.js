const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const logger = require("../logging/logger");
const EmailPort = require("../../ports/EmailPort");

/**
 * Implementacion de EmailPort usando AWS SES
 */

class SESEmailAdapter extends EmailPort {
  /**
   * @param {object} opts
   * @param {string} opts.region
   * @param {string} opts.sender Email verificado por SES
   */
  constructor({ region, sender }) {
    super();
    this.sesClient = new SESv2Client({ region });
    this.sender = sender;
  }

  /**
   * @param {{to:string, subject:string, bodyHtml:string, bodyText?:string, tags?:Array<{name:string,value:string}>}} input
   */
  async send(input) {
    logger.trace("ses send start", { to: input.to, from: this.sender,subject: input.subject });
    const tags = (input.tags || []).map((t) => ({
      Name: t.name,
      Value: t.value,
    }));
    
    
    const cmd = new SendEmailCommand({
      FromEmailAddress: this.sender,
      Destination: { ToAddresses: [input.to] },
      Content: {
        Simple: {
          Subject: { Data: input.subject },
          Body: {
            Html: { Data: input.bodyHtml },
            Text: input.bodyText ? { Data: input.bodyText } : undefined,
          },
        },
      },
      EmailTags: tags,
    });
    logger.trace("ses send command", cmd);
    const res = await this.sesClient.send(cmd);
    logger.trace("ses send ok", { messageId: res?.MessageId, to: input.to });
  }
}

module.exports = SESEmailAdapter;
