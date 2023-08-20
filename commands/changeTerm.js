const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { UserSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { ModalBuilder } = require('discord.js');
const { currentSemester } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("new-term-change-message")
        .setDescription("Changes the current term")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`Change Current Term`);
        
        const terms = new StringSelectMenuBuilder()
            .setCustomId("Term Dropdown Menu")
            .setPlaceholder("Select Term")
            .addOptions(["Fall", "Winter", "Summer"].map(item => { return { label: item, description: `Change term to ${item}`, value: item.toLowerCase() };}))
            .setMinValues(1)
            .setMaxValues(1);
        const row = new ActionRowBuilder().addComponents(terms);

        await interaction.reply({ content: "", components: [row], embeds: [embed], ephemeral: false});
    },
};
