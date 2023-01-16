const constants = require('../utils/constants.json')
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const fs = require('fs');

module.exports = async (client, interaction) => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;

    if (interaction.customId === 'verification') {
        if (!interaction.member.roles.cache.get(constants.roles.member)) interaction.member.roles.add(constants.roles.member);

    } else if (interaction.customId === 'select_ticket') {
        const user = interaction.user;
        let created = false;

        interaction.guild.channels.cache.forEach(c => {
            if (c.parentId === constants.categories.tickets && c.name.includes(user.username.toLowerCase())) created = true;
        });

        if (created) {
            const embedRepeated = new MessageEmbed()
                .setColor('RED')
                .setTitle(':warning: AVISO')
                .setDescription('Você já possui um ticket aberto.\n\nSolicite o encerramento do mesmo para conseguir abrir outro.')
                .setFooter({ text: `${client.user.username} | Tickets • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

            return interaction.reply({ content: `<@${user.id}>`, embeds: [embedRepeated], ephemeral: true })
        }

        const ticketMenu = new MessageSelectMenu()
            .setCustomId('select_ticket')
            .setPlaceholder('Selecione uma categoria')
            .addOptions([
                { value: 'option_financial', label: 'Financeiro', emoji: constants.emojis.ticket_financial },
                { value: 'option_reports', label: 'Denúncias ou punições', emoji: constants.emojis.ticket_reports },
                { value: 'option_request_tag', label: 'Beneficios', emoji: constants.emojis.ticket_request_tag },
                { value: 'option_general_doubts', label: 'Outros', emoji: constants.emojis.ticket_general_doubts }
            ]);

        const embed = new MessageEmbed()
            .setColor(constants.embed.color)
            .setTitle('Central de Suporte')
            .setDescription('Olá jogador!\n\nSeja bem-vindo ao central de suporte.\n\nNesta seção, você pode entrar em contato com nossa equipe e sanar suas dúvidas.\n\nPara começarmos, selecione uma categoria desejada.\n\n*OBS:* Uso sem consîencia deste canal, resultará em punições! Como descrito em nossas regras.')
            .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });
        
        interaction.message.delete().catch(() => null);
        interaction.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(ticketMenu)] });
        
        const emojiOptions = {
            'option_financial': constants.emojis.ticket_financial,
            'option_reports': constants.emojis.ticket_reports,
            'option_request_tag': constants.emojis.ticket_request_tag,
            'option_general_doubts': constants.emojis.ticket_general_doubts
        };

        const name = `${emojiOptions[interaction.values[0]]}-${user.username}`;
      
        const ticketCategories = {
            'option_financial': interaction.guild.channels.cache.get(constants.categories.financial),
            'option_reports': interaction.guild.channels.cache.get(constants.categories.reports),
            'option_request_tag': interaction.guild.channels.cache.get(constants.categories.request_tag),
            'option_general_doubts': interaction.guild.channels.cache.get(constants.categories.general_doubts)
        };

        interaction.guild.channels.create(name, {
            type: 'text',
            parent: ticketCategories[interaction.values[0]],
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['VIEW_CHANNEL'],
                }
            ]

        }).then(async c => {
            await c.lockPermissions();

            c.permissionOverwrites.create(user.id, {
                VIEW_CHANNEL: true
            });

            c.permissionOverwrites.create(constants.roles.staff, {
                VIEW_CHANNEL: true
            });
           
            const embedChannel = new MessageEmbed();

            const nameCategories = {
                'option_financial': `${constants.emojis.ticket_financial} Financeiro`,
                'option_reports': `${constants.emojis.ticket_reports} Denúncias ou punições`,
                'option_request_tag': `${constants.emojis.ticket_request_tag} Beneficios`,
                'option_general_doubts': `${constants.emojis.ticket_general_doubts} Outros`
            }

            embedChannel
                .setColor(constants.embed.color)
                .setTitle(`${nameCategories[interaction.values[0]]}`)
                .setDescription('Olá jogador!\n\nSeja bem-vindo ao central de suporte.\n\nUm membro de nossa equipe irá lhe responder em no máximo 1 hora. Caso não responda, você tem direito a marcar nossa equipe.')
                .setThumbnail(client.user.avatarURL())
                .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });
            
            c.send({ embeds: [embedChannel] });
        });
        
    } else {
        if (interaction.customId !== `select_help_${interaction.member.id}`) return interaction.reply({ content: `${interaction.member}, apenas quem usou o comando pode selecionar uma categoria.`, ephemeral: true });
                
        const commandsFolders = fs.readdirSync('./commands');
        let embedHelp, commands = [];

        for (const folder of commandsFolders) {
            const folderFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

            commandsOfCategory = [];

            for (const file of folderFiles) {
                commandsOfCategory.push(file.replace('.js', ''));
            }

            commands.push(commandsOfCategory);
        }

        let description = '', command;

        switch (interaction.values[0]) {
            case 'option_everyone':
                commands[0].forEach(commandName => {
                    command = client.commands.get(commandName);
                    description += `\`${command.name}\` - ${command.description}\n`;
                });

                embedHelp = new MessageEmbed()
                    .setColor(constants.embed.color)
                    .setAuthor({ name: 'Central de Comandos', iconURL: client.user.avatarURL() })
                    .setTitle(`${constants.emojis.help_option_everyone} Comandos Gerais`)
                    .setDescription(description)
                    .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                break;

            case 'option_giveaways':
                commands[1].forEach(commandName => {
                    command = client.commands.get(commandName);
                    description += `\`${command.name}\` - ${command.description}\n`;
                });

                embedHelp = new MessageEmbed()
                    .setColor(constants.embed.color)
                    .setAuthor({ name: 'Central de Comandos', iconURL: client.user.avatarURL() })
                    .setTitle(`${constants.emojis.help_option_giveaways} Comandos de Sorteios`)
                    .setDescription(description)
                    .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                break;

            case 'option_moderation':
                commands[2].forEach(commandName => {
                    command = client.commands.get(commandName);
                    description += `\`${command.name}\` - ${command.description}\n`;
                });

                embedHelp = new MessageEmbed()
                    .setColor(constants.embed.color)
                    .setAuthor({ name: 'Central de Comandos', iconURL: client.user.avatarURL() })
                    .setTitle(`${constants.emojis.help_option_moderation} Comandos de Moderação`)
                    .setDescription(description)
                    .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                break;

            case 'option_team':
                commands[3].forEach(commandName => {
                    command = client.commands.get(commandName);
                    description += `\`${command.name}\` - ${command.description}\n`;
                });

                embedHelp = new MessageEmbed()
                    .setColor(constants.embed.color)
                    .setAuthor({ name: 'Central de Comandos', iconURL: client.user.avatarURL() })
                    .setTitle(`${constants.emojis.help_option_team} Comandos da Equipe`)
                    .setDescription(description)
                    .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                break;

            default:
                embedHelp = new MessageEmbed()
                    .setColor(constants.embed.color)
                    .setTitle('Central de Comandos')
                    .setDescription('Olá jogador!\n\nNesta seção, você pode obter informações de todos os comandos disponíveis deste robô.\n\nPara começarmos, selecione uma categoria.')
                    .setFooter({ text: `${client.user.username} | CLOUD STORE • Todos os direitos reservados`, iconURL: client.user.avatarURL() });

                break;
        }

        let options = [];

        if (interaction.values[0] === 'option_back') {
            options.push({ value: 'option_everyone', label: `Geral (${commands[0].length})`, description: 'Exibir comandos gerais.', emoji: constants.emojis.help_option_everyone });

        } else {
            options.push([
                { value: 'option_back', label: `Voltar (Início)`, description: 'Voltar ao menu inicial.', emoji: constants.emojis.help_option_back },
                { value: 'option_everyone', label: `Públicos (${commands[0].length})`, description: 'Exibir comandos públicos.', emoji: constants.emojis.help_option_everyone }
            ]);
        }

        if (interaction.member.roles.cache.get(constants.roles.staff)) {
            options.push([
                { value: 'option_team', label: `Equipe (${commands[3].length})`, description: 'Exibir comandos da equipe.', emoji: constants.emojis.help_option_team },
                { value: 'option_giveaways', label: `Sorteios (${commands[1].length})`, description: 'Exibir comandos de sorteios.', emoji: constants.emojis.help_option_giveaways },
                { value: 'option_moderation', label: `Moderação (${commands[2].length})`, description: 'Exibir comandos de moderação.', emoji: constants.emojis.help_option_moderation },
            ]);
        }

        const row = new MessageActionRow().addComponents(new MessageSelectMenu()
            .setCustomId(`select_help_${interaction.member.user.id}`)
            .setPlaceholder('Selecione uma categoria')
            .addOptions(options)
        );

        interaction.message.edit({ embeds: [embedHelp], components: [row] });
    }

    interaction.deferUpdate();
}