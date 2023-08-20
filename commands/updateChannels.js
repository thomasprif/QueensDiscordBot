/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType } = require("discord.js");
const path = require("node:path");
const { getCourses } = require(path.join("..", "tools.js"));
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

        const { currentSemester, activeCoursesCategoryID } = require(path.join("..", "config.json")); // Do this at command execution instead of startup as term can change during runtime
        interaction.reply(`Creating Channels. Current Term: ${currentSemester})`);
        const guild = interaction.guild;
        
        let channels = await Array.from(guild.channels.cache.values());
        channels = channels.map(getChannelName); // Name of all the channels
            
        const disciplines = getDisciplines(); // Get all the disciplines


        async function updateClassChannel(course, topic){ // Create channel if it doesn't exist. Course code and topic=description
            course = course.toLowerCase().replace(' ', '-'); // APSC 200 -> apsc-200
            if(!(channels.includes(course))){ // Create it if it doesn't exist
                let channel = await guild.channels.create({
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
                // await channel.setParent(activeCoursesCategoryID); // Put it in the category
                channels.push(course); // Keep track of channels for ease of use and to prevent dupes
            }
        }

        async function addPermissions(courseArray, role){ // Give a role permissions to all courses in the array
            for(let c of courseArray){ // For each course code
                c[0] = c[0].toLowerCase().replace(' ', '-'); // Convert to channel name
                console.log(c[0]);
                const channel = guild.channels.cache.find((ch) => ch.name === c[0]); // Find channel
                if(!channel) { // Channel doesn't exist
                    console.log("error channel: " + c[0] + " should have already been created");
                    await updateClassChannel(c[0], c[1]); // Try and create the channel
                    await addPermissions(courseArray, role);
                    return;
                }
                await channel.permissionOverwrites.edit(role.id, {ViewChannel: true});
            }
        }

        async function updateClassChannelPermisions(discipline){ // Handle all the subdiscipline perms for a discipline
            // Gets role for main discipline
            const disciplineRole = guild.roles.cache.find((r) => r.name === discipline["name"]);

            // Get current semester core courses
            let courses = getCourses(discipline, undefined, true).filter((c) => {
                return c[2] === currentSemester;
            });
         
            await addPermissions(courses, disciplineRole);

            // Get subdisciplines
            let subdiscplines = Object.keys(discipline["sub-plans"]);
            subdiscplines = subdiscplines.map((d) => {return discipline["sub-plans"][d]["name"];});

            for(const s of subdiscplines){
                // Get subdiscipline role
                const subDiscRole = guild.roles.cache.find((r) => r.name === s);

                // Get current semester subdiscipline courses
                courses = getCourses(discipline, s, false, true).filter((c) => {
                    return c[2] === currentSemester;
                });

                // Add role to channels
                await addPermissions(courses, subDiscRole);
                // TODO make this shit recursive for subsubdisciplines, etc...
            }
        }

        // Create channels and add permissions for course role
        for(const course of getCourses()) {
            if(!(channels.includes(course[0].toLowerCase().replace(' ', '-')))){ // Create it if it doesn't exist
                await updateClassChannel(course[0], course[1]); // Create all the channels
                const courseRole = guild.roles.cache.find((r) => r.name === course[0]);
                await addPermissions([course],courseRole);
            }
        }

        for(const discipline of disciplines){ // For each discipline
            await updateClassChannelPermisions(discipline); // Handle all main/subdiscipline permissions
        }

        console.log("Done updating channels");
    },
};