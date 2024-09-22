const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadCommands } = require('../../Handlers/commandHandler');
const { loadPrefixCommands } = require('../../Handlers/prefixCommands');
const { loadEvents } = require('../../Handlers/eventHandler');
const { loadButtons } = require('../../Handlers/buttonHandler')
const { loadModals } = require('../../Handlers/modalHandler');
const { loadMenus } = require('../../Handlers/menuHandler');

module.exports = {
	category: 'dev',
	developer: true,
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Recarga un comando o evento.')
		.addSubcommand(command => command.setName('slash')
			.setDescription('Recarga los comandos de barra diagonal')
		)
		.addSubcommand(command => command.setName('prefix')
			.setDescription('Recarga los comandos de prefix')
		)
		.addSubcommand(command => command.setName('events')
			.setDescription('Recarga los eventos')
		)
		.addSubcommand(command => command.setName('buttons')
			.setDescription('Recarga los botones')
		)
		.addSubcommand(command => command.setName('modals')
			.setDescription('Recarga los modals')
		).addSubcommand(command => command.setName('menus')
			.setDescription('Recarga los menus')
		),

		/**
		 * @param {import("discord.js").ChatInputCommandInteraction} interaction 
		 * @param {import("discord.js").Client} client 
		 * @returns 
		 */

	async execute(interaction, client) {
		const sub = interaction.options.getSubcommand();

		await interaction.deferReply().catch((e) => {});
		
		if (sub === 'slash') {
			try {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Recargando los botones...').setColor(client.config.colors.info) ] })
				await loadCommands(client);
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Comandos de Slash recargados correctamente').setColor(client.config.colors.success) ] })
			} catch (error) {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`Error recargando los comandos de Slash: \`${error.message}\``).setColor(client.config.colors.error) ] })
			}
		} else if (sub === 'prefix') {
			try {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Recargando los comandos de prefijo...').setColor(client.config.colors.info) ] })
				await loadPrefixCommands(client);
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Comandos de prefijo recargados correctamente').setColor(client.config.colors.success) ] })
			} catch (error) {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`Error recargando los comandos de prefix: \`${error.message}\``).setColor(client.config.colors.error) ] })
			}
		} else if (sub === 'events') {
			try {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Recargando los eventos...').setColor(client.config.colors.info) ] })
				client.removeAllListeners();
				await loadEvents(client);
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Eventos recargados correctamente').setColor(client.config.colors.success) ] })
			} catch (error) {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`Error recargando los eventos: \`${error.message}\``).setColor(client.config.colors.error) ] })
			}
		} else if (sub === 'buttons') {
			try {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Recargando los botones...').setColor(client.config.colors.info) ] })
				await loadButtons(client);
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Botones recargados correctamente').setColor(client.config.colors.success) ] })

			} catch (error) {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`Error recargando los botones: \`${error.message}\``).setColor(client.config.colors.error) ] })
			}
		} else if (sub === 'modals') {
			try {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Recargando los modals...').setColor(client.config.colors.info) ] })
				await loadModals(client);
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Modals recargados correctamente').setColor(client.config.colors.success) ] })

			} catch (error) {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`Error recargando los modals: \`${error.message}\``).setColor(client.config.colors.error) ] })
			}
		} else if (sub === 'menus') {
			try {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Recargando los menus...').setColor(client.config.colors.info) ] })
				await loadMenus(client);
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription('Menus recargados correctamente').setColor(client.config.colors.success) ] })

			} catch (error) {
				await interaction.editReply({ embeds: [ new EmbedBuilder().setDescription(`Error recargando los menus: \`${error.message}\``).setColor(client.config.colors.error) ] })
			}
		}
	},
};
