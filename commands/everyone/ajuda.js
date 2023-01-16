const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const constants = require('../../utils/constants.json');
const fs = require('fs');

module.exports = {
    name: 'ajuda',
    aliases: [],
    utilisation: '',
    description: 'Informações de todos os comandos.',

    run(client, message, args) {
        if (message.channel.id !== constants.channels.commands) return message.reply(`Esse comando só pode ser executado no canal <#${constants.channels.commands}>.`).then(m => {
            incomplete(m, message);
        });

        const commandsFolders = fs.readdirSync('./commands');
        let commands = [], commandsOfCategory;

        for (const folder of commandsFolders) {
            const folderFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

            commandsOfCategory = [];

            for (const file of folderFiles) {
                commandsOfCategory.push(file.replace('.js', ''));
            }

            commands.push(commandsOfCategory);
        }

        let options = [
            { value: 'option_everyone', label: `Geral (${commands[0].length})`, description: 'Exibir comandos gerais.', emoji: constants.emojis.help_option_everyone },
        ]

        if (message.member.roles.cache.get(constants.roles.staff)) {
            options.push([
                { value: 'option_team', label: `Equipe (${commands[3].length})`, description: 'Exibir comandos da equipe.', emoji: constants.emojis.help_option_team },
            ]);

            options.push([
                { value: 'option_moderation', label: `Moderação (${commands[2].length})`, description: 'Exibir comandos de moderação.', emoji: constants.emojis.help_option_moderation },
            ]);

            options.push([
                { value: 'option_giveaways', label: `Sorteio (${commands[1].length})`, description: 'Exibir comandos de sorteios.', emoji: constants.emojis.help_option_giveaways },
            ]);
        }

        const row = new MessageActionRow().addComponents(new MessageSelectMenu()
            .setCustomId(`select_help_${message.author.id}`)
            .setPlaceholder('Selecione uma categoria abaixo')
            .addOptions(options)
        );

        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle('Central de Comandos')
            .setDescription('Olá jogador!\n\nEstá em dúvida á respeito dos comandos do nosso servidor? Bom, está no lugar certo!.\n\nPara começarmos, selecione abaixo a categoria desejada.')
            .setFooter({ text: `${client.user.username} | SUPORTE IMPACT **•** Todos os direitos reservados`, iconURL: client.user.avatarURL() });

        message.reply({ embeds: [embed], components: [row] });
    }
}

function incomplete(m, message) {
    setTimeout(() => {
        m.delete().catch(() => null);
        message.delete().catch(() => null);

    }, 5000);;
}