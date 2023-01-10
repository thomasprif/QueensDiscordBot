const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const path = require("node:path");
const fs = require("node:fs");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("new-disicpline-selector-message")
        .setDescription("Creates a new message for users to select diciplines")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const disciplineDataPath = path.join(__dirname, "..", "disciplineData");
        const disciplines = fs.readdirSync(disciplineDataPath)
                              .filter(file => file.endsWith(".json"))
                              .map(file => {
                                  const filePath = path.join(disciplineDataPath, file);
                                  return require(filePath)["name"];
                              });
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("primary")
                    .setLabel("Not Sure")
                    .setStyle(ButtonStyle.Primary),
                ...disciplines.map(name => {
                    console.log(name);
                    return new ButtonBuilder()
                        .setCustomId(name)
                        .setLabel(name)
                        .setStyle(ButtonStyle.Primary);
                }),
            );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Choose Your Discipline!');

         interaction.reply({ content: "", embeds: [embed], components: [row] });
    },
};
