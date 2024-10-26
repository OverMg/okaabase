const axios = require('axios');
const { Client, Events } = require("discord.js");

module.exports = {
  name: Events.ShardDisconnect,

  /**
   * @param {EventS} event 
   * @param {number} shardId 
   * @param {Client} client 
   */

  async execute(shardId, client) {
    const webhookUrl = client.config.logs.shardLogsURL;
    try {
      await axios.post(webhookUrl, {
        content: `[Shard ${shardId}] Disconnected`,
      });
    } catch (error) {
      console.error(`[Webhook] Error sending to webhook: ${error}`);
    }
  },
};
