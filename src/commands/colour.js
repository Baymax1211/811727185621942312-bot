const configs = require('../configs/config.json');
const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('deadchat-color')
        .setDescription('Set the color for the dead chat role')
        .addStringOption(option =>
            option.setName('color')
            .setDescription('The new color. Has to be a hex with the "#"')
            .setRequired(true)
            .setMinLength(7)
            .setMaxLength(7)
        ),
    async execute(interaction) {
        const deadChatRole = await interaction.guild.roles.cache.get(configs.deadChatRoleId);
        const Holder = deadChatRole.members.size > 0 ? deadChatRole.members.first() : null;

        // Check if the role holder exists and if they are the one using the command
        if (!Holder || Holder.id !== interaction.user.id) {
            return await interaction.reply({
                content: 'You are not the role holder',
                flags: Discord.MessageFlags.Ephemeral
            });
        };

        const hex = await interaction.options.getString('color');

        const Regex = /^#[0-9A-Fa-f]{6}$/; // Updated regex for hex color validation

        const valid = Regex.test(hex);

        if (!valid) {
            return await interaction.reply({
                content: 'Invalid color format. Please provide a valid hex color (e.g., #FFFFFF).',
                flags: Discord.MessageFlags.Ephemeral
            });
        };

        // Check if bot has permission to change the role color
        const botRole = interaction.guild.members.me.roles.highest;
        if (botRole.position <= deadChatRole.position) {
            return await interaction.reply({
                content: 'I need to have a higher role than the Dead Chat role to change its color.',
                flags: Discord.MessageFlags.Ephemeral
            });
        }

        // Convert the hex to RGB
        const hexNoHash = hex.slice(1)

        const r = parseInt(hexNoHash.slice(0, 2), 16);
        const g = parseInt(hexNoHash.slice(2, 4), 16);
        const b = parseInt(hexNoHash.slice(4, 6), 16);

        const rgb = r + g + b;

        // Edit the color of the dead chat role
        try {
            await deadChatRole.edit({
                color: rgb
            });

            return await interaction.reply({
                content: `The color of the dead chat role has been updated to ${hex}.`,
                flags: Discord.MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error('Error editing role color:', error);
            return await interaction.reply({
                content: 'An error occurred while updating the color of the Dead Chat role.',
                flags: Discord.MessageFlags.Ephemeral
            });
        }
    }
};