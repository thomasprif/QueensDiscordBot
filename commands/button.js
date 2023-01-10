const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("button")
        .setDescription("Creates new message with button"),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("primary")
                    .setLabel("Click me!")
                    .setStyle(ButtonStyle.Primary),
            );
        
        const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');

         interaction.reply({ content: "I think you should,", embeds: [embed], components: [row] });      

    },
};