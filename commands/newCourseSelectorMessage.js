/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("new-course-selector-message")
        .setDescription("Creates a new message for users to select manually their courses")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

            const button = new ActionRowBuilder()
                .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`Elective Button`)
                            .setLabel("Pick Elective")
                            .setStyle(ButtonStyle.Primary)
                );

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Add an elective!');

         interaction.reply({ content: "", embeds: [embed], components: [button] });
    },
};
