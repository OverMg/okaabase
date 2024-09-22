const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const guildDataClass = require('../../utils/configGuils');

module.exports = {
	name: "messageCreate",

    /**
     * @param {ChatInputCommandInteraction} message 
     * @param {Client} client 
     */

	async execute(message, client) {
		if (message.author.bot || message.channel.isDMBased()) return;
		const guildData = await guildDataClass.load(message.guildId);
		
		const prefix = guildData?.GuildPrefix || '.';

		if (!message.content?.toLowerCase().startsWith(prefix.toLowerCase())) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const command = args.shift().toLowerCase();

		let cmdprefix = client.prefixCommands.get(command) || client.prefixCommands.find((c) => c.alias && c.alias.includes(command));

		if (cmdprefix) {

			const server = message.guild;
			if (guildData) {
				server.lang = guildData.GuildLanguage;
			} else {
				server.lang = 'es_LA';
			};

			if (cmdprefix.developer && !client.config.devs.includes(message.author.id)) {
				return message.reply({ content: `Este comando es exlusivo para mis desarrolladores.` });
			};

			const lang = message.guild.lang;
			try {
				cmdprefix.execute(message, args, client, prefix.toLowerCase(), lang);
			} catch (error) {
				const errorsChannel = await client.channels.fetch(client.config.logs.errorsChannelID).catch((e) => void 0);
				if (!errorsChannel) {
					return console.error(error);
				};
				const embed = new EmbedBuilder()
					.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
					.setFooter({ text: `${message.guild.name} || ${message.guild.id}`, iconURL: message.guild.iconURL() })
					.setColor('Default')
					.setDescription(`[ ERROR ] ${prefix}${command} ${args?.join(" ")}\n\`\`\`js\n${error.stack}\`\`\``)
				
				errorsChannel.send({ embeds: [embed] });
			}

			const ch = await client.channels.fetch(client.config.logs.prefixChannelID).catch((e) => void 0);
            
			if (ch) {
				const embed = new EmbedBuilder()
					.setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL() })
					.setDescription(`${prefix}${command} ${args?.join(" ")}`)
					.setTimestamp()
					.setFooter({
						text: message.guild.name,
						iconURL: message.guild.iconURL(),
					});
				ch.send({ embeds: [embed] });
			}
		}
	},
};
