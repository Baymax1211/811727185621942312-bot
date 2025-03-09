const Discord = require('discord.js')

module.exports = {
    name: 'Interactions',
    type: 'interactionCreate',
    enabled: true,
    async execute(interaction) {
        try {
			// If the interaction is not a command do nothing
			if (!interaction.isCommand()) return;

			// Check if the command exists
			const command = interaction.client.commands.find((cmd) => cmd.name === interaction.commandName);

			// Do nothing if the command doesn't exist
			if (!command) return;

			// Execute the command
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: Discord.MessageFlags.Ephemeral,
			});
		}
    }
}