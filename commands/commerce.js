const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("commerce")
        .setDescription("lmao"),
    async execute(interaction) {
        await interaction.reply("dies of cringe");
        throw new Error("Commerce Cringe");
    },
};
