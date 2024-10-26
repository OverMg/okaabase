const { Events } = require("discord.js");
const axios = require('axios');

function formatTimestamp(date) {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }) + `, ${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
}

module.exports = {
  name: Events.ShardError,

  /**
   * @param {Error} error 
   * @param {number} shardId
   */

  async execute(error, shardId, client) {
    const webhookUrl = client.config.logs.shardLogsURL;
    const timestamp = formatTimestamp(new Date());

    try {
      await axios.post(webhookUrl, {
        content: `[${timestamp}] Shard ${shardId} encountered an error: ${error.message || error}`,
      });
    } catch (error) {
      console.error(`[Webhook] Error sending to webhook: ${error}`);
    }
  },
};