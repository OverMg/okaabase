const { Events, EmbedBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
  name: Events.ShardError,

  /**
   * @param {Error} error 
   * @param {number} shardId
   */

  async execute(error, shardId, client) {
    const webhookUrl = client.config.logs.shardLogsURL;

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Shard Error: ' + shardId)
      .setDescription(`${error.stack || error.message || error}`)
      .setTimestamp();

    await axios.post(webhookUrl, { embeds: [embed] });
  },
};