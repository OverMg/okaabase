const { ActivityType, Client, Events, EmbedBuilder } = require("discord.js");
const axios = require('axios');

function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatTimestamp(date) {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }) + `, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}


module.exports = {
  name: Events.ShardReconnecting,

  /**
   * @param {Client} client 
   */

  async execute(shardId, client) {
    const webhookUrl = client.config.logs.shardLogsURL;
    const timestamp = formatTimestamp(new Date());
    const totalShards = client.ws.totalShards;
    const guildCount = client.guilds.cache.filter(guild => guild.shardId === shardId).size;
    const ping = client.ws.ping;
    const uptime = formatDuration(client.uptime);

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Shard Reconnecting')
      .setDescription(`Shard ${shardId}/${totalShards} Reconnecting.`)
      .addFields(
        {
          name: 'Servers',
          value: `${guildCount}.`,
          inline: true,
        },
        {
          name: 'Ping',
          value: `${ping.toPrecision(2)}ms.`,
          inline: true,
        },
        {
          name: 'Uptime',
          value: `${uptime}.`,
          inline: true,
        },
      )
      .setTimestamp(timestamp);

    await axios.post(webhookUrl, { embeds: [embed] });
  },
};