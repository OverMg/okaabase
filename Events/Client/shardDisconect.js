const axios = require('axios');
const { Client, Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.ShardDisconnect,

  /**
   * @param {EventS} event 
   * @param {number} shardId 
   * @param {Client} client 
   */

  async execute(shardId, client) {
    const webhookUrl = client.config.logs.shardLogsURL;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Shard Disconnected')
      .setDescription(`Shard ${shardId} Disconnected.`)
      .setTimestamp();

    await axios.post(webhookUrl, { embeds: [embed] });
  },
};
