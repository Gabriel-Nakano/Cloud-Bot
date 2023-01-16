const { Collection, Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const constants = require('./utils/constants.json');
const fs = require('fs');
const { GiveawaysManager } = require('discord-giveaways');

client.commands = new Collection();
client.giveawaysManager = new GiveawaysManager(client, {
    storage: './utils/giveaways.json',
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: 'GREEN',
        embedColorEnd: 'RED',
        reaction: '🎉',
        lastChance: { 
            enabled: true,
            content: '🎉 **SORTEIO QUASE FINALIZANDO**',
            threshold: 5 * 60000,
            embedColor: 'ORANGE'
        }
    }
});

console.log('\nIniciando...');

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandsFolders = fs.readdirSync('./commands');

for (const file of events) {
    const event = require(`./events/${file}`);

    client.on(file.split('.')[0], event.bind(null, client));
}

for (const folder of commandsFolders) {
    const folderFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of folderFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.login(constants.token);