const { Client, GatewayIntentBits, Collection, Partials, Options } = require('discord.js');
require("./Functions/anticrash.js")();
require("dotenv").config();
require('colors');
const { join } = require('path');
const process = require("node:process");

const { loadMenus } = require("./Handlers/menuHandler.js");
const { loadModals } = require("./Handlers/modalHandler.js");
const { loadEvents } = require("./Handlers/eventHandler.js");
const { loadButtons } = require("./Handlers/buttonHandler.js");

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		// GatewayIntentBits.GuildPresences,
	],
	partials: [
        Partials.User,
        Partials.Message,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.Channel
    ],
	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3_600,
			lifetime: 1_800,
		},
		users: {
			interval: 3_600,
			filter: () => user => user.bot && user.id !== user.client.user.id
		}
	},
	allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false
    },
	// cooldowns: 5
});

client.events = new Collection();
client.commands = new Collection();
client.cooldowns = new Collection();
client.prefixCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.menus = new Collection();

client.config = require('./configs.js');

client.languages = require('i18n');
client.languages.configure({
	locales: ['es_LA', 'en_US', 'pt_BR'],
	directory: join(__dirname, "locales"),
	defaultLocale: 'es_LA',
	retryInDefaultLocale: true,
	objectNotation: true,
	register: global,

	logWarnDn: function (msg) {
		console.log('[WARN] ' + msg);
	},

	logErrorFn: function (msg) {
		console.log('[ERROR] ' + msg);
	},

	missingKeyFn: function (value) {
		return value;
	},

	mustacheConfig: {
		tags: ['{{', '}}'],
		disable: false
	}
});

loadEvents(client);
loadButtons(client);
loadModals(client);
loadMenus(client);

client.login(process.env.token);