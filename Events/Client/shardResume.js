const { Client, Events } = require("discord.js");
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
  name: Events.ShardResume,

  /**
   * @param {Client} client 
   */

  async execute(shardId, replayedEvents, client) {
    const webhookUrl = client.config.logs.shardLogsURL;
    const timestamp = formatTimestamp(new Date());
    const totalShards = client.ws.totalShards;
    const guildCount = client.guilds.cache.filter(guild => guild.shardId === shardId).size;
    const ping = client.ws.ping;
    const uptime = formatDuration(client.uptime);

    try {
      await axios.post(webhookUrl, {
        content: `[${timestamp}] Shard ${shardId}/${totalShards} Resumed.\nServers: ${guildCount}.\nPing: ${ping.toFixed(2)}ms.\nUptime: ${uptime}.\n\nReplayed Events: ${replayedEvents}`,
      });
    } catch (error) {
      console.error(`[Webhook] Error sending to webhook: ${error}`);
    }
  },
};