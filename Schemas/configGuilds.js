const { model, Schema } = require('mongoose');

let configGuilds = new Schema({
    GuildId: { type: String, required: true },
    GuildLanguage: { type: String, required: true, default: 'es_LA' },
    GuildPrefix: { type: String, required: true, default: '.' },
    CommandsDisabled: { type: Array },
    CategoriesDisabled: { type: Array }
});

// configGuilds.pre(['save'], async function (next) {
//     const guild = this;
//     if (guild.isModified('GuildLanguage') && !guild._alreadySaved) {
//         guild._alreadySaved = true;
//         await guild.save();
//     }
//     next();
// });

module.exports = model('configGuilds', configGuilds);