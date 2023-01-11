/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType } = require("discord.js");
const path = require("node:path");
const tools = require(path.join("..", "tools.js"));
const { getDisciplines } = require("../tools");

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
        
        let channels = await Array.from(guild.channels.cache.values());
        channels = channels.map(getChannelName);
            
        const disciplines = getDisciplines();

        function updateClassChannel(course, topic){
            course = course.toLowerCase().replace(' ', '-');
            if(!(channels.includes(course))){
                guild.channels.create({
                    name: course,
                    type: ChannelType.GuildText,
                    topic: topic,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });
                channels.push(course);
            }
        }

        function updateClassChannelPermisions(){
            
        }


        for(const discipline of disciplines){

            const courses = tools.getCourses(discipline);

            for(const course of courses){
                updateClassChannel(course[0], course[1]);

            }


            }

        await interaction.reply("Created Channel");
    },
};