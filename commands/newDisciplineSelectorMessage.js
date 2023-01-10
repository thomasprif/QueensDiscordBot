const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { getDisciplines } = require("../tools.js")
const path = require("node:path");
const fs = require("node:fs");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("new-disicpline-selector-message")
        .setDescription("Creates a new message for users to select diciplines")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const disciplines = getDisciplines().map(discipline => discipline["name"]);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("Not Sure")
                    .setLabel("Not Sure")
                    .setStyle(ButtonStyle.Primary),
                ...disciplines.map(name => {
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
