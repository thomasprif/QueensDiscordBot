const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getDiscplineRoles, getDisciplines, addRole, getCourses } = require("../tools");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update-roles")
        .setDescription("creates and updates roles based for each discipline and sub path")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        interaction.reply("Creating roles");
        const guild = interaction.guild;

        await guild.roles.fetch(); // Get all the roles
        const rolesAdded = Array.from(guild.roles.cache.values()).map((r) => { return r.name; }); // Map them onto their names

        for(const d of getDisciplines()){ // Get all disciplines
            const roles = getDiscplineRoles(d); // Get the names of all the disciplines and subdisciplines
            for(const r of roles){
                if(rolesAdded.includes(r[0])) continue; // Ensure no dupes or excessive discord api calls
                let colour; // Role colour
                if(r[1] == "M"){ // If it's a main discipline
                    colour = "Purple";
                } else if (r[1] == "S"){ // Subdiscipline
                    colour = "Blue";
                }

                await addRole(guild, r[0], colour); // Create the role
                rolesAdded.push(r[0]); // Add to our list
            }

            let courses = getCourses(d); // Get all the courses
            courses = courses.map((c) => { return c[0] }); // Map to their names

            for(const course of courses){
                if(rolesAdded.includes(course)) continue; // Ensure no dupes or axcessive api calls
                await addRole(interaction.guild, course, "LightGrey"); // Create the course role
                rolesAdded.push(course); // Add it to our list
            }
        }
        console.log("Done creating roles");
    },
};