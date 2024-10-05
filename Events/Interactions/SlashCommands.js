const { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, Collection } = require("discord.js");
const guildDataClass = require('../../utils/configGuils');

module.exports = {
	name: "interactionCreate",
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction, client) {
		if (interaction.user.bot) return;
		const context = interaction.context;

        if (context === 0 || typeof context != 'number' || interaction.guild !== null) {
			
			const guildData = await guildDataClass.load(interaction.guildId);
			const lang = guildData?.GuildLanguage || interaction.guild?.lang || 'es_LA';
	
			if (interaction.isChatInputCommand()) {
				const command = client.commands.get(interaction.commandName);
				const { cooldowns } = client;
	
				if (!cooldowns.has(command.data.name)) {
					cooldowns.set(command.data.name, new Collection());
				}
	
				const now = Date.now();
				const timestamps = cooldowns.get(command.data.name);
				const defaultCooldownDuration = 3;
				const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
	
				if (timestamps.has(interaction.user.id)) {
					const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			
					if (now < expirationTime) {
						const expiredTimestamp = Math.round(expirationTime / 1000);
						return interaction.reply({ content: `Por favor espera, el comando \`${command.data.name}\`. Tiene cooldown, puedes usarlo de nuevo <t:${expiredTimestamp}:R>.`, ephemeral: true });
					}
				}
	
				if (!command) {
					return interaction.reply({
						content: "Comando fuera de linea, reinicia discord o cambia de canal para ejecutar este comando.",
						ephermal: true,
					});
				}
	
				if (command.developer && !client.config.devs.includes(interaction.user.id))
					return interaction.reply({
						content: "Este comando solo puede ser utilizado por el propietario del bot, escribe **!help** o </help:1109583268216582242> para ver mi lista completa de comandos.",
						ephermal: true,
					});
	
				try {
					await command.execute(interaction, client, lang);
	
					if (interaction.replied || interaction.deferred) {
						timestamps.set(interaction.user.id, now);
						setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
					}
				} catch (error) {
					await interaction.reply({
						content: `Se produjo un error, ya envie un informe de errores a mi desarrollador\nSi el error presiste por favor ingresa a mi servidor de soporte.`,
					})
					const errorsChannel = await client.channels.fetch(client.config.logs.errorsChannelID).catch((e) => void 0);
					if (!errorsChannel) {
						return console.error(error);
					};
					const embed = new EmbedBuilder()
						.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
						.setFooter({ text: `${interaction.guild.name} || ${interaction.guild.id}`, iconURL: interaction.guild.iconURL() })
						.setColor('Default')
						.setDescription(`**[ERROR]** Comando: **/${command.data.name}**\n\`\`\`js\n${error.stack}\`\`\``)
					
					await errorsChannel.send({ embeds: [embed] }).catch((e) => void 0);
				}
			} else if (interaction.isButton()) {
				const buttonId = interaction.customId.split("_");
				const button = client.buttons.get(buttonId[0]);
	
				if (!button) return new Error(`Este boton no tiene un codigo`);
	
				try {
					button.execute(interaction, client, buttonId.slice(1), lang);
				} catch (error) {
					console.log(`falla en los botones\n` + error);
				}
			} else if (interaction.isStringSelectMenu()) {
				const menuId = interaction.customId.split("_");
				const menu = client.menus.get(menuId[0]);
				if (!menu) return new Error(`Este menu no tiene un codigo`);
		  
				try {
				  await menu.execute(interaction, client, menuId.slice(1), lang);
				} catch (err) {
				  console.error(err);
				}
			} else if (interaction.isModalSubmit()) {
				const { modals } = client;
				const { customId } = interaction;
				const modal = modals.get(customId);
				if (!modal) return new Error(`Este Modal no tiene un codigo`);
	
				try {
					await modal.execute(interaction, client, lang);
				} catch (err) {
					console.error(err);
				}
			} else return;
		} else if (context === 1 || context === 2) {
            const command = client.commands.get(interaction.commandName);
            const errChannel = await client.channels.fetch(client.config.channeldErrors.context).catch((e) => null);

            if (!command) {
                return interaction.reply({ content: "Comando fuera de línea.", ephemeral: true });
            }
            
            try {
                await command.execute(interaction, client);
            } catch (error) {
                interaction.reply({
                    content: "Se ha producido un error al ejecutar este comando.\n\nSi el error persiste por favor reportalo en mi servidor de soporte.",
                    ephemeral: true,
                }).catch(async () => {
                    await interaction.editReply({ content: `Se ha producido un error al ejecutar este comando.\n\nSi el error persiste por favor reportalo en mi servidor de soporte.` }).catch(() => void 0);
                });

                if (errChannel) {
                    errChannel?.send({ content: `:x: | Error en el comando ${command.data.name}\n\`\`\`js\n${error.stack}\n\`\`\`` }).catch(() => void 0);
                }
            }
		}
	},
};
