const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("commerce")
        .setDescription("Shuts down the bot") // Used for collaboration so we don't have to remember to close the bot so others can test it
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply("dies of cringe");
        throw new Error("Commerce Cringe");
    },
};
