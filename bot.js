require('dotenv').config()
const Discord = require('discord.js')
const { SetCommands } = require('./src/helpers/setCommands')
const { SetEvents } = require('./src/helpers/setEvents')
const colorette = require('colorette')

const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits)
        .map((intent) => {
            return Discord.GatewayIntentBits[intent]
        }),
    partials: Object.keys(Discord.Partials)
        .map((key) => {
            return Discord.Partials[key];
        })
});

(async () => {
    await SetCommands(
        client
    )

    await SetEvents(
        client
    )
})();

(async () => {
    await client.login(process.env.CLIENT_TOKEN)

    console.log(colorette.green(`[Client]: The client is ready!`))
})();

process.on('SIGINT', async () => {
    await client.user.setPresence({ status: 'invisible' })
    client.destroy()
    console.log(colorette.red(`[Client]: The client has been killed!`));
    process.exit(0)
})