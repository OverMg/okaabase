const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const guildSchema = require('../../Schemas/configGuilds');

module.exports = {
	name: "messageCreate",

	/**
	 * 
	 * @param {Message} message 
	 * @param {Client} client 
	 * @returns 
	 */
	async execute(message, client) {
		if (message.author.bot) return;
		if (!message.inGuild()) return;
		const guildData = await guildSchema.findOne({ GuildId: message.guild.id });

		let prefix = '.';
		if (typeof guildData?.GuildPrefix == 'string') {
			prefix = guildData.GuildPrefix;
		};

		const url = "https://discord.com/api/oauth2/authorize?client_id=1089931393733251132&permissions=1099511627775&scope=bot%20applications.commands";
		const web = `https://okaa.lat/`;
		const server = `https://discord.gg/2ZKdT6SRsZ`;
		const emojiId = `<:xb:1112140703670214786>`;

		if (message.content === `<@${client.user.id}>`) {
			const buttonAyuda = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`cancelHelp_${message.author.id}`)
					.setStyle(ButtonStyle.Danger)
					.setEmoji(emojiId),

				new ButtonBuilder()
					.setLabel(`Soporte`)
					.setStyle(ButtonStyle.Link)
					.setURL(server),

				new ButtonBuilder()
					.setLabel(`Invitarme`)
					.setStyle(ButtonStyle.Link)
					.setURL(url),

				new ButtonBuilder()
					.setLabel("Mas informacion")
					.setStyle(ButtonStyle.Link)
					.setURL(web),
			);

			const embed = new EmbedBuilder()
				.setAuthor({
					name: client.user.username,
					iconURL: client.user.displayAvatarURL(),
					url: url,
				})
				.setColor("Orange")
				.setTitle(`¡Holii! ${message.author.displayName || message.author.globalName || message.author.username}, Soy ${client.user.displayName || client.user.globalName || client.user.username}`)
				.addFields({
					name: `Mi prefix aqui es \`${prefix}\``,
					value: `Usa **</help:1109583268216582242>** o \`${prefix}help\` _Para ver todos mis comandos_`,
				})
				.setFooter({
					text: `${client.user.tag} || ${client.ws.ping}Ms`,
					iconURL: client.user.displayAvatarURL(),
				})
				.setTimestamp()
				.setThumbnail(client.user.displayAvatarURL());

			try {
				if (message.reference) {
					return message.reply({ embeds: [embed], components: [buttonAyuda], allowedMentions: { repliedUser: false } });
				} else {
					return message.channel.send({ embeds: [embed], components: [buttonAyuda] })
				}
			} catch{ }
		}
	},
};
