/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const path = require("node:path");
const tools = require(path.join("..", "tools.js"));
const fs = require("node:fs");

function getChannelName(channel){
    return channel.name;
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName("updates-channels")
        .setDescription("Updates Channel with discipline data")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const guild = interaction.guild;
        const disciplineDataPath = path.join(__dirname, "..", "disciplineData");
        const disciplineFiles = fs.readdirSync(disciplineDataPath).filter(file => file.endsWith(".json"));
        
        let channels = await Array.from(guild.channels.cache.values());
        channels = channels.map(getChannelName);


        for(const file of disciplineFiles){
            const filePath = path.join(disciplineDataPath, file);
            const discipline = require(filePath);

            const courses = tools.getCourses(discipline);

            function updateClassChannel(course, topic){
                course = course.toLowerCase().replace(' ', '-');
                if(!(channels.includes(course))){
                    guild.channels.create({
                        name: course,
                        type: ChannelType.GuildText,
                        topic: topic,
                    });
                }
            }

            for(const course of courses){
                updateClassChannel(course[0], course[1]);
            }

        }

        await interaction.reply("Created Channel");
    },
};