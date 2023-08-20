const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Term } = require("config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ChangeTerm")
        .setDescription("Changes the current term")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('ChangeTermModal')
            .setTitle('Change Term');
        
        const terms = new StringSelectMenuBuilder()
            .setCustomId("Term Dropdown Menu")
            .setPlaceHolder("Select Term")
        .addOptions(["Fall", "Winter", "Summer"]);
        const row = new ActionRowBuilder().addComponents(terms);

        modal.addComponents(row);
        await interaction.showModal(modal);

        await interaction.reply({content: `Changed Term to ${}`, ephemeral: true});
    },
};
