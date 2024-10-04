const { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	category: 'dev',
	data: new SlashCommandBuilder()
		.setName("pinguser")
        .setContexts(0, 1, 2)
        .setIntegrationTypes(0, 1)
		.setDescription("User install command"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client, lang) {
		await interaction.reply({ content: `Pong! ${client.ws.ping}ms` });
	},
};