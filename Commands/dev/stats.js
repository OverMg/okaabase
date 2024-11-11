const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, ChannelType, } = require("discord.js");
const osu = require('node-os-utils');
const os = require('os');
const diagramMaker = require('../../Functions/diagramMaker');

module.exports = {
    category: 'utilidades',
    data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Responde con el estado del sistema")
    .setIntegrationTypes(0),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, Client) {
        const { client } = interaction;
        await interaction.deferReply();
        
        await client.application.fetch();

        const rolesCount = interaction.guild.roles.cache.size;
        const numEmojis = interaction.guild.emojis.cache.size;
        
        const shardGuilds = await client.cluster.fetchClientValues('guilds.cache.size');
        const totalGuilds = shardGuilds.reduce((acc, count) => acc + count, 0);

        const shardMembers = await client.cluster.broadcastEval(
            client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        );
        const totalMembers = shardMembers.reduce((acc, count) => acc + count, 0);

        const getChannelTypeSize = type => interaction.guild.channels.cache.filter(channel => type.includes(channel.type)).size;
        const players = client.okaaMusic.players.size;
        var mem = osu.mem;
        let freeRAM, usedRAM, cpuUsage;

        mem.info().then(info => {
            freeRAM = info[`freeMemMb`];
            usedRAM = info[`totalMemMb`] - freeRAM;
        });

        const cpu = osu.cpu;
        const p1 = cpu.usage().then(cpuPercentage => cpuUsage = cpuPercentage);

        await Promise.all([p1]).catch(() => {
            return;
        });

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({
                name: `${client.user.tag}`,
                iconURL: `${client.user.displayAvatarURL()}`,
                url: 'https://discord.com/api/oauth2/authorize?client_id=1089931393733251132&permissions=1099511627775&scope=applications.commands%20bot'})
            .setThumbnail(client.user.displayAvatarURL({dynamic: true, size: 4096}))
            .setFields(
                {
                    name: "❱ **INFO DE OKAA.**",
                    value: [
                        `> **Total Clusters:** \`${client.cluster.info.CLUSTER_COUNT}\``,
                        `> **Developer:** <@245339452464037888> (overmage)`,
                        `> **Creacion:** <t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
                        `> **Tiempo Activo:** <t:${parseInt(client.readyTimestamp / 1000)}:R>`,
                    ].join("\n")
                },
                { 
                    name: '❱ CARGA DEL SISTEMA.',
                    value: "```" + `RAM: ${diagramMaker(usedRAM, freeRAM)} [${Math.round((100*usedRAM)/(usedRAM+freeRAM))}%]\nCPU: ${diagramMaker(cpuUsage, 100- cpuUsage)} [${Math.round(cpuUsage)}%]` + "```", inline: false },
                { 
                    name: `❱ CONFIGURACION DEL SISTEMA.`,
                    value: "```" +
                    `CPU: ${os.cpus()[0].model}\n` +
                    `RAM: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
                    `OS: ${os.type} ${os.release} ${os.arch}\n` +
                    `NODE: ${process.version}\n` +
                    "```"
                },
                {
                    name: `❱ **ESTE SERVIDOR**`,
                    value: ["```" + 
                            `👻 Shard: ${interaction.guild.shardId}`,
                            `👥 Miembros: ${interaction.guild.memberCount}`,
                            `📇 Roles: ${rolesCount}`,
                            `😄 Emojis: ${numEmojis}`,
                            `📝 Canales texto: ${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum])}`,
                            `🔊 Canales Voz: ${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}` + "```"
                        ].join("\n")
                },
                {
                    name: `❱ **INFO GENERAL.**`,
                    value: ["```" + 
                        `🗃️ Shards: ${client.cluster.info.TOTAL_SHARDS}`,
                        `🎧 Players: ${players}`,
                        `🌸 Comandos ${client.commands.size + client.prefixCommands.size}`,
                        `😄 Emojis: ${client.emojis.cache.size}`,
                        `👥 Usuarios: ${totalMembers}`,
                        `✨ Servidores: ${totalGuilds}`
                    + "```"
                ].join("\n")
                },
            )
            .setFooter({ text: `${client.user.tag} || ${client.ws.ping}ms`, iconURL: client.user.displayAvatarURL()})
            .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
    }
};