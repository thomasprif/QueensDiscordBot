const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("commerce")
        .setDescription("lmao"),
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply("dies of cringe");
        throw new Error("Commerce Cringe");
    },
};
