const { Message, PermissionsBitField } = require('discord.js');
const guildDataClass = require('../../utils/configGuils');
const { default: mongoose } = require('mongoose');

module.exports = {
    cooldown: 5,
    name: "setlanguage",
    description: "Muestra mi latencia en ms.",
    alias: ['lang', 'setlang', 'slang'],
    usage: `setlang  <código de idioma>\nEjemplo: setlang es`,
    category: `admin`,

    /**
     * @param {Message} message 
     */

    async execute(message, args, client, prefix, lang) {

        const mongooseConnectionStatus = mongoose.connection.readyState;

        if (mongooseConnectionStatus !== 1) {
            return message.reply({ content: client.languages.__mf({ phrase: 'noDb', locale: lang }) });
        }

        const lagsMap = {
            'es': 'es_LA',
            'en': 'en_US',
            'pt': 'pt_BR',
            'es_la': 'es_LA',
            'en_us': 'en_US',                
            'pt_br': 'pt_BR'
        }
    
        if (!args[0] || args[0]?.length != 2) {
            return message.reply({ content: client.languages.__mf('languages.noArgs', { prefix: prefix }) });
        }
    
        const newLang = lagsMap[args[0].toLowerCase()];
        if (!newLang) {
            return message.reply({ content: client.languages.__({ phrase: 'languages.noValid', locale: lang }) })
        }
        
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply({ content: client.languages.__({ phrase: 'languages.noAdmin', locale: typeof newLang === 'string'? newLang : lang }) });
        }
    
        if (args[0].toLowerCase() in lagsMap) {
            
            await guildDataClass.updateLanguage(message.guildId, newLang);
    
            return message.reply({ content: client.languages.__({ phrase: 'languages.newLang', locale: newLang }) });
        } else {
            return message.reply({ content: client.languages.__({ phrase: 'languages.error', locale: newLang }) });
        }
    },
};
