const { Message } = require('discord.js');

module.exports = {
    cooldown: 5,
    name: "ping",
    description: "Muestra mi latencia en ms.",
    usage: `ping`,
    category: `developer`,

    /**
     * @param {Message} message 
     */

    async execute(message, args, client, prefix, lang) {
        
        const mentionedMember = message.mentions.members.first();

        if (mentionedMember) {
            message.channel.send({ content: client.languages.__mf({ phrase: 'ping.pingAndMention', locale: lang }, {mentioned: `${mentionedMember}`, ping: client.ws.ping}) });
        } else {
            message.channel.send({ content: client.languages.__mf({ phrase: 'ping.onlyPing', locale: lang }, {ping: client.ws.ping })});
        }
    }
}