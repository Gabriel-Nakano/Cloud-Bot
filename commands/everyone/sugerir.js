const { MessageEmbed } = require('discord.js');
const constants = require('../../utils/constants.json');

module.exports = {
    name: 'sugerir',
    aliases: [],
    utilisation: '<sugestão> <imagem (opcional)>.',
    description: 'Enviar uma sugestão.',

    run(client, message, args) {
        if (message.channel.id !== constants.channels.make_suggestion) return message.reply(`Esse comando só pode ser executado no canal <#${constants.channels.make_suggestion}>.`).then(m => {
            incomplete(m, message);
        });

        const userMessage = args.join(' ');
        if ((userMessage).trim() === '') return message.reply(` \`${constants.prefix}${this.name} ${this.utilisation}\``).then(m => {
            incomplete(m, message);
        });

        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle('💡 » Nova sugestão')
            .setDescription(`Sugestão enviada por: ${message.member}\n\n> **Sugestão:** \`\`\`${userMessage}\`\`\``)
            .setThumbnail(message.attachments.first() ? '' : client.user.avatarURL())
            .setImage(message.attachments.first() ? message.attachments.first().url : '')
            .setFooter({ text: `${client.user.username} | Sugestões • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        message.guild.channels.cache.get(constants.channels.suggestions).send({ embeds: [embed] }).then(m => {
            m.react(constants.emojis.suggestion_yes);
            m.react(constants.emojis.suggestion_no);

            message.reply(`Sua sugestão foi enviada. Confira-a no canal <#${constants.channels.suggestions}>.`).then(m => {
                incomplete(m, message);
            });
        });
    }
}

function incomplete(m, message) {
    setTimeout(() => {
        m.delete().catch(() => null);
        message.delete().catch(() => null);

    }, 5000);;
}