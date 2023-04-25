/* eslint-disable no-shadow */
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { UserSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { token } = require("./config.json");
const { getCourses, getDisciplines, assignRole } = require("./tools.js");
const fs = require("node:fs");
const path = require("node:path");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for(const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if("data" in command && "execute" in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    client.rest.on("rateLimited", console.log);
});


// Comand Events
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }

});

// Button Event
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isButton()) return;
    if (interaction.customId == "Add Elective Button") { // Pick elective buttons
        const modal = new ModalBuilder()
			.setCustomId('ElectiveModal')
			.setTitle('Pick Elective');

		// Add components to modal

		// Create the text input components
		const courseCodeInput = new TextInputBuilder()
			.setCustomId('Course Code Input')
            // The label is the prompt the user sees for this input
			.setLabel("Please enter the course code (APSC 200)")
            // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		// Add inputs to the modal
		modal.addComponents(new ActionRowBuilder().addComponents(courseCodeInput));

		// Show the modal to the user
		await interaction.showModal(modal);
        return;
    }

    else if (interaction.customId == "Remove Elective Button") { // Remove elective buttons
        const courses = getCourses();
        const options = courses.filter(course => { // Filter courses where user has that role
            return interaction.member.roles.cache.find(role => {return course[0] == role.name});
        }).map(course => { // Map onto the object that is used by the menu
           return { label: course[0], description: course[1], value: course[0]} 
        }).reduce((acc, item) => { // Remove duplicates
            if(!acc.find(obj => obj.value == item.value)) {
                acc.push(item);
            }
            return acc;
        }, []);
        
        if (options.length == 0) { // Cant have an empty dropdown
            await interaction.reply({ content: `No electives to remove!`, ephemeral: true});
            return;
        }
        const select = new StringSelectMenuBuilder()
        			.setCustomId("Remove Elective Menu")
        			.setPlaceholder("Select electives to remove")
        			.addOptions(options)
            .setMinValues(1)
            .setMaxValues(options.length);
        const row = new ActionRowBuilder().addComponents(select);
        await interaction.reply({ content: 'Please select the electives to be removed', components: [row], ephemeral: true});
        return;
    }

    const disciplines = [{name: "Not Sure", 'sub-plans': {}}, ...getDisciplines()];
    const discipline = disciplines.filter(discipline => {return discipline["name"] == interaction.customId})[0];
    if (discipline){ // Found the discipline in the interaction ID
        // Clear disciplines and sub disciplines
        for(const disc of disciplines) {
            await assignRole(interaction.member, disc["name"], true);
            if(disc["name"] != interaction.customId) { // Dont remove subdisciplines from the one they selected
                for(const d in disc["sub-plans"]) {
                    await assignRole(interaction.member, disc["sub-plans"][d]["name"], true);
                }
            }
        }
        // Discipline button

        if (Object.keys(discipline["sub-plans"]).length == 0) {
            // No subdisciplines
           await interaction.reply({ content: `Added to ${discipline["name"]}`, ephemeral: true});
        } else {
            // Subdisciplines
            const subDisciplines = Object.keys(discipline["sub-plans"]).map(key => discipline["sub-plans"][key]);
            const row = new ActionRowBuilder()
                  .addComponents(
                      ...subDisciplines.map(disc => disc["name"]).map(name => {
                          return new ButtonBuilder()
                              .setCustomId(name)
                              .setLabel(name)
                              .setStyle(ButtonStyle.Primary);
                      }),
                  );

            const embed = new EmbedBuilder()
                  .setColor(0x0099FF)
                  .setTitle(`Choose Your ${discipline["name"]} Sub-Discipline!`);
            await interaction.reply({ content: "", embeds: [embed], components: [row], ephemeral: true });
        }
        await assignRole(interaction.member, interaction.customId); // Add discipline role to user
    } else {
        // Subdiscipline button
        for(const discipline of getDisciplines()) {
            for(const d in discipline["sub-plans"]) {
                await assignRole(interaction.member, discipline["sub-plans"][d]["name"], true);
            }
        }
        await interaction.reply({ content: `Added to ${interaction.customId}`, ephemeral: true});
        await assignRole(interaction.member, interaction.customId); // Add discipline role to user

    }
});

// Modal Interraction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
    // Get user input
    const input = interaction.fields.fields.first().value;
    let prefix = input.match(/[a-zA-Z]{4}/);
    if (!prefix) return interaction.reply({content: `Error, incorrect course code input`, ephemeral: true});
    prefix = prefix[0].toUpperCase();
    let number = input.match(/\d{3}/);
    if (!number) return interaction.reply({content: `Error, incorrect course code input`, ephemeral: true});
    number = number[0];
    const course = `${prefix} ${number}`;

    // Check if course exists
    let courses = [];
    getDisciplines().forEach(discipline => {
        getCourses(discipline).forEach(course => {
            courses.push(course[0]);
        });
    });
    courses = courses.filter(realCourse => {return realCourse == course;});
    if (!courses[0]) return interaction.reply({content: `Error, cannot find course ${course}`, ephemeral: true});
    await assignRole(interaction.member, course);
    await interaction.reply({content: `Added to course ${course}`, ephemeral: true});
});

// Handle multiselect menus
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId == "Remove Elective Menu") {
        const roles = interaction.values;
        roles.forEach(role => assignRole(interaction.member, role, true)); // Remove roles
        if (roles.length == 0) {
            await interaction.update({ content: `No electives to remove!`, components: [], ephemeral: true});
        } else if (roles.length == 1) {
            await interaction.update({ content: `Removed from ${roles[0]}`, components: [], ephemeral: true});
        } else {
            await interaction.update({ content: `Removed from ${roles.slice(0,-1).join(', ') + " and " + roles.slice(-1)}`, components: [], ephemeral: true});
        }
        return;
    }
})

client.login(token);