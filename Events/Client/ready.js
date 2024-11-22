const { ActivityType, Client } = require("discord.js");
const mongoose = require("mongoose");
const { loadCommands } = require('../../Handlers/commandHandler.js');
const { loadPrefixCommands } = require('../../Handlers/prefixCommands.js');

module.exports = {
  name: "ready",
  once: true,

  /**
   * @param {Client} client 
   */

  async execute(client) {

    if (process.env.mongoURL) {
      mongoose.set("strictQuery", false);
      mongoose.set("allowDiskUse", true)
  
      mongoose.connect(process.env.mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      if (mongoose.connect) {
        console.log("Conectado a la base de datos".green);
      }
    }

    client.user.setActivity({
      name: `Sexcall???`,
      type: ActivityType.Streaming,
      url: `https://www.twitch.tv/discord`,
    });
    
    loadCommands(client);
    loadPrefixCommands(client)

    console.log(`Bot ${client.user.tag}!`.green);
 },
};