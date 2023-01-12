/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType } = require("discord.js");
const path = require("node:path");
const { getCourses } = require(path.join("..", "tools.js"));
const { getDisciplines } = require("../tools");
const { currentSemester } = require(path.join("..", "config.json"));

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

        async function updateClassChannelPermisions(discipline){

            const role = guild.roles.cache.find((r) => r.name === discipline["name"]);
            let courses = getCourses(discipline, undefined, true).map((c) => {return c[0];});
            for(let c of courses){
                c = c.toLowerCase().replace(' ', '-');
                const channel = guild.channels.cache.find((ch) => ch.name === c);
                await channel.permissionOverwrites.edit(role.id, {ViewChannel: true});
            }

            
            
            
            
            
            
            
            
            let subdiscplines = Object.keys(discipline["sub-plans"]);
            subdiscplines = subdiscplines.map((d) => {return discipline["sub-plans"][d]["name"];});




            if(subdiscplines.length === 0){
                courses = getCourses(discipline);
            }
            for(const s of subdiscplines){
                courses = getCourses(discipline, s);
            }
        }


        for(const discipline of disciplines){

            updateClassChannelPermisions(discipline);

            const courses = getCourses(discipline);

            for(const course of courses){
                updateClassChannel(course[0], course[1]);

            }


            }

        await interaction.reply("Created Channel");
    },
};