const { Client, EmbedBuilder, Collection, Message } = require("discord.js");
const guildDataClass = require('../../utils/configGuils');
const { default: mongoose } = require("mongoose");

module.exports = {
	name: "messageCreate",

    /**
     * @param {Message} message 
     * @param {Client} client 
     */

	async execute(message, client) {
		if (message.author.bot || message.channel.isDMBased()) return;
		let guildData;

		const mongooseConnectionStatus = mongoose.connection.readyState;

		if (mongooseConnectionStatus === 1) {
			guildData = await guildDataClass.load(message.guildId);
		};
		
		const prefix = guildData?.GuildPrefix || '.';

		if (!message.content?.toLowerCase().startsWith(prefix.toLowerCase())) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const command = args.shift().toLowerCase();

		let cmdprefix = client.prefixCommands.get(command) || client.prefixCommands.find((c) => c.alias && c.alias.includes(command));
		if (!cmdprefix) return;

		const { cooldowns } = client;
		if (!cooldowns.has(command)) {
			cooldowns.set(command, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
	
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		
			if (now < expirationTime) {
				return message.reply({ content: `Por favor espera, el comando \`${prefix}${command}\`. Tiene cooldown de ${(new Date(cooldownAmount).getTime()).toPrecision(1) / 1000}s.`, ephemeral: true });
			}
		}

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
			await cmdprefix.execute(message, args, client, prefix.toLowerCase(), lang);
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

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
		if (!ch) return;
        
		const embed = new EmbedBuilder()
			.setAuthor({ name: message.author.globalName, iconURL: message.author.displayAvatarURL() })
			.setDescription(`${prefix}${command} ${args?.join(" ")}`)
			.setTimestamp()
			.setFooter({
				text: message.guild.name,
				iconURL: message.guild.iconURL(),
			});
		ch.send({ embeds: [embed] });
	},
};
