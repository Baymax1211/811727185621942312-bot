const fs = require('fs')
const path = require('path')
const colorette = require('colorette')

async function SetEvents(client) {
    const eventFiles = fs.readdirSync(path.join(__dirname, '../events'))
        .filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        console.log(colorette.yellow(`[Event Loader]: Trying to load ${file}`))
        const fullPath = path.join(__dirname, '../events', file)
        const event = require(fullPath)

        if (!event.name && !event.type && typeof event.execute !== 'function') {
            console.log(colorette.red(`[Event Loader]: Failed to load the ${file} event, no function found`));
        }

        if (event.enabled !== true) {
            console.log(colorette.magenta(`[Event Loader]: Event ${file} not loaded. Event Disabled`));
            return;
        }

        // Add the event to the client
        if (event.once === true) {
            client.once(event.type, (...args) => event.execute(...args, client));
        } else {
            client.on(event.type, (...args) => event.execute(...args, client));
        }
        console.log(colorette.green(`[Event Loader]: Loaded ${file}`))

    }

};

module.exports = {
    SetEvents
}