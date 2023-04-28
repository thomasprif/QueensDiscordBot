/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { getDisciplines } = require("../tools.js");
const path = require("node:path");
const fs = require("node:fs");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("new-disicpline-selector-message")
        .setDescription("Creates a new message for users to select diciplines and subdisciplines")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const disciplines = getDisciplines().map(discipline => discipline["name"]); // Get a list of discipline names
        const rows = [];

        for(let i = 0; i < disciplines.length; i += 5){ // Split disciplines into rows of 5
            if(i + 5 >= disciplines.length){ // Cant have a full row
                rows.push(disciplines.slice(i, disciplines.length));
                break;
            }
            rows.push(disciplines.slice(i, i + 5));
        }

        rows.forEach((value, index) => { // Add buttons to each row
            rows[index] = new ActionRowBuilder()
                .addComponents(
                    ...value.map(name => {
                        return new ButtonBuilder()
                            .setCustomId(name)
                            .setLabel(name)
                            .setStyle(ButtonStyle.Primary);
                    }),
                );
        });

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Choose Your Discipline!');

         interaction.reply({ content: "", embeds: [embed], components: rows });
    },
};
