const { default: mongoose } = require('mongoose');
const configGuildsSchema = require('../Schemas/configGuilds');

class ConfigGuils {
    constructor() {
        this.config = new Map();
    }

    async loadAll() {
        let data = await configGuildsSchema.find().exec().catch((e) => void 0);
        if (!data) return;
        data.forEach(guild => this.config.set(guild.GuildId, guild));
    }

    async load(guildId) {
        if (!this.config.has(guildId)) {
            const mongooseConnectionStatus = mongoose.connection.readyState;
            let guild;
            if (mongooseConnectionStatus === 1) {
                guild = await configGuildsSchema.findOne({ GuildId: guildId }).exec();
            }
            if (!guild) return null;
            this.config.set(guildId, guild);
        }
        return this.config.get(guildId);
    }

    async updatePrefix(guildId, prefix) {
        let guild = await this.load(guildId);
        if (guild) {
            guild.GuildPrefix = prefix;
            await this.cache.set(guildId, guild);
            await configGuildsSchema.findOneAndUpdate({ GuildId: guildId }, { GuildPrefix: prefix });
        } else {
            guild = new configGuildsSchema({ GuildId: guildId, GuildPrefix: prefix });
            await guild.save();
            this.config.set(guildId, guild);
        }
    }

    async updateLanguage(guildId, language) {
        let guild = await this.load(guildId);
        if (guild) {
            guild.GuildLanguage = language;
            await this.cache.set(guildId, guild);
            await configGuildsSchema.findOneAndUpdate({ GuildId: guildId }, { GuildLanguage: language });
        } else {
            guild = new configGuildsSchema({ GuildId: guildId, GuildLanguage: language });
            await guild.save();
            this.config.set(guildId, guild);
        }
    }

    async addDisabledCommand(guildId, command) {
        let guild = await this.load(guildId);
        guild.CommandsDisabled.push(command);
        await this.cache.set(guildId, guild);
        await configGuildsSchema.findOneAndUpdate({ GuildId: guildId }, { CommandsDisabled: guild.CommandsDisabled });
    }

    async removeDisabledCommand(guildId, command) {
        let guild = await this.load(guildId);
        guild.CommandsDisabled = guild.CommandsDisabled.filter(cmd => cmd !== command);
        await this.cache.set(guildId, guild);
        await configGuildsSchema.findOneAndUpdate({ GuildId: guildId }, { CommandsDisabled: guild.CommandsDisabled });
    }

    async addDisabledCategory(guildId, category) {
        let guild = await this.load(guildId);
        guild.CategoriesDisabled.push(category);
        await this.cache.set(guildId, guild);
        await configGuildsSchema.findOneAndUpdate({ GuildId: guildId }, { CategoriesDisabled: guild.CategoriesDisabled });
    }

    async removeDisabledCategory(guildId, category) {
        let guild = await this.load(guildId);
        guild.CategoriesDisabled = guild.CategoriesDisabled.filter(cat => cat !== category);
        await this.cache.set(guildId, guild);
        await configGuildsSchema.findOneAndUpdate({ GuildId: guildId }, { CategoriesDisabled: guild.CategoriesDisabled });
    }
}

module.exports = new ConfigGuils();