const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getDiscplineRoles, getDisciplines, addRole, getCourses } = require("../tools");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update-roles")
        .setDescription("creates and updates roles based for each discipline and sub path")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const guild = interaction.guild;
        for(const d of getDisciplines()){
            const roles = getDiscplineRoles(d);
                for(const r of roles){
                let colour;
                if(r[1] == "M"){
                    colour = "Purple";
                } else if (r[1] == "S"){
                    colour = "Blue";
                }

                addRole(guild, r[0], colour);
            }

            const courses = getCourses(d);

            


        }






        await interaction.reply("Roles created");
    },
};