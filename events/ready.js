const constants = require('../utils/constants.json');

module.exports = (client) => {
    let activities = [
        'Cloud Store no topo!',
        client.guilds.cache.get(constants.guild_id).name,
        `${constants.prefix}ajuda`
    ];

    let i = 0;

    setInterval(() => client.user.setActivity(activities[i++ % activities.length], {
        type: 'PLAYING',

    }), 10000);

    console.log(`\nIniciado - Logado como ${client.user.tag}\n`);
}