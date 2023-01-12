const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getDiscplineRoles, getDisciplines, addRole, getCourses } = require("../tools");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update-roles")
        .setDescription("creates and updates roles based for each discipline and sub path")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const guild = interaction.guild;

        await guild.roles.fetch();
        const rolesAdded = Array.from(guild.roles.cache.values()).map((r) => { return r.name; });

        for(const d of getDisciplines()){
            const roles = getDiscplineRoles(d);
            for(const r of roles){
                if(rolesAdded.includes(r[0])) continue;
                let colour;
                if(r[1] == "M"){
                    colour = "Purple";
                } else if (r[1] == "S"){
                    colour = "Blue";
                }

                addRole(guild, r[0], colour);
                rolesAdded.push(r[0]);

            }

            let courses = getCourses(d);
            courses = courses.map((c) => {
                return c[0];
            });

            for(const course of courses){
                if(rolesAdded.includes(course)) continue;
                addRole(interaction.guild, course, "LightGrey");
                rolesAdded.push(course);
            }
            

        }
        
        await interaction.reply("Roles created");
    },
};