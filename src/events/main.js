const configs = require('../configs/config.json')

let inactivityTimeout;
let isRoleStealable = false;
let deadChatMessage;

function resetInactivityTimeout() {
    // Clear the existing timeout (if any)
    if (inactivityTimeout) {
        clearInterval(inactivityTimeout);
    }

    // Reset the inactivity timeout
    inactivityTimeout = setTimeout(() => {
        isRoleStealable = true;
    }, configs.inactivityTimeout);
}

// Call this once at the start to initiate the timer
resetInactivityTimeout();

module.exports = {
    name: 'deadChatRoleTransfer',
    type: 'messageCreate',
    enabled: true,
    async execute(message) {
        if (message.author.bot) return;

        if (message.channel.id !== configs.generalChannelId) return;
        if (isRoleStealable === false) {
            return resetInactivityTimeout();
        }

        const deadChatRole = await message.guild.roles.cache.get(configs.deadChatRoleId);
        const newHolder = message.member;

        // Get the old holder
        const oldHolder = deadChatRole.members.size > 0 ? deadChatRole.members.first() : null;

        if (oldHolder && oldHolder.id === newHolder.id) return;

        try {
            if (oldHolder) {
                await oldHolder.roles.remove(deadChatRole);
            }
            await newHolder.roles.add(deadChatRole);

            // Delete the old announcement message
            if (deadChatMessage) {
                try {
                    const oldMessage = await message.channel.messages.fetch(deadChatMessage);
                    if (oldMessage) {
                        await oldMessage.delete();
                    }
                } catch (deleteError) {
                    console.error('Failed to delete old announcement:', deleteError);
                }
            }

            // Send the new announcement message
            const newMessage = await message.channel.send(`<@${newHolder.id}> has stolen the <@&${configs.deadChatRoleId}> role!`);
            deadChatMessage = newMessage.id;

        } catch (error) {
            console.error('Error transferring role:', error);
            message.channel.send('An error occurred while transferring the @Dead Chat role.');
        }

        // Set isRoleStealable to false after the role transfer happens
        isRoleStealable = false;
        resetInactivityTimeout();
    }
}