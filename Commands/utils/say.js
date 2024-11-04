const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
    cooldown: 30,
    category: 'utils',
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Envia un mensaje escrito por el bot")
        .addStringOption(option => option.setName('mensaje')
            .setDescription('Pon el mensaje que tu quieras')
            .setRequired(true)
        ),

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        const msg = interaction.options.getString("mensaje");

        const regexInvites = /\b(?:https?:\/\/)?(?:www\.)?(?:discord\s?\.\s?gg|discordapp\.com\/invite|dis\s?\.?\s?gg|discord\s?gg)\s?\/\s?\S+\b/i;
        const regexLinks = /\b(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

        if (regexInvites.test(msg)) {
            return await interaction.reply({ content: "No se permiten invitaciones.", ephemeral: true }).catch((e) => void 0);
        } else if (regexLinks.test(msg)) {
            return await interaction.reply({ content: "No se permiten links.", ephemeral: true }).catch((e) => void 0);
        }

        await interaction.channel.send({ content: msg, allowedMentions: { parse: [] } }).catch((e) => {
            return interaction.reply({ embeds: [new EmbedBuilder().setDescription(':x: | No se pudo enviar el mensaje').setColor('Red')], ephemeral: true });
        });

    	await interaction.reply({ embeds: [new EmbedBuilder().setDescription(':white_check_mark: | Mensaje enviado').setColor('Green')], ephemeral: true }).catch((e) => void 0);
    },
  };