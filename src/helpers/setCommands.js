const fs = require('fs');
const path = require('path');
const colorette = require('colorette');
const Discord = require('discord.js');

async function SetCommands(client) {
    const commandFolder = fs.readdirSync(path.join(__dirname, '../commands'));
    const commands = [];
    client.commands = [];

    for (const file of commandFolder) {
        console.log(colorette.yellow(
            `[Commands Loader]: Trying to load ${file}`
        ))
        try {
            const command = require(path.join(__dirname, '../commands', file));
            if (!command || !command.data || !command.execute) {
                console.log(colorette.red(`[Commands Loader]: Failed to add ${file} to the array, missing data or execute function.`));
                continue; // Skip to the next file
            }

            if (command.data.name && typeof command.execute === 'function') {
                commands.push(command.data.toJSON());
                client.commands.push({
                    name: command.data.name,
                    execute: command.execute,
                });
                console.log(colorette.green(`[Commands Loader]: Loaded ${file}`))
            } else {
                console.log(colorette.red(`[Commands Loader]: Failed to add ${file} to the array, missing name or execute function.`));
            }
        } catch (error) {
            console.log(colorette.red(`[Commands Loader]: Error loading command file ${file}: ${error.message}`));
        }
    }

    try {
        const rest = new Discord.REST({
            version: '10'
        }).setToken(process.env.CLIENT_TOKEN);
        await rest.put(Discord.Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands
        });
        console.log(colorette.green(`[Commands Loader]: All slash commands are loaded!`));
    } catch (error) {
        console.log(colorette.red(`[Commands Loader]: Failed to load slash commands!\n\nReason:\n${error.message}`));
    }
}

module.exports = {
    SetCommands,
};