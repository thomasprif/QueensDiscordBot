const path = require("node:path");
const fs = require("node:fs");
module.exports = {

    // Takes disicpline JSON file and finds all courses, retruns list of every course + Description 
    getCourses: function(discipline){

        const allCourses = [];

        for(const course in discipline["common core courses"]){
            const topic = discipline["common core courses"][course][0];
            allCourses.push([course, topic]);
        }
        
        for(const subPlan in discipline["sub-plans"]){
            const courses = Object.keys(discipline["sub-plans"][subPlan]["courses"]);
            for(const course of courses){
                const topic = discipline["sub-plans"][subPlan]["courses"][course][0];
                allCourses.push([course, topic]);
            }
        }
        for(const choice of discipline["choices"]){
            for(const course in choice){
                const topic = choice[course][0];
                allCourses.push([course, topic]);
            }
        }
        return allCourses;

    },

    getDisciplines: function() {
        const disciplineDataPath = path.join(__dirname, "disciplineData");
        return fs.readdirSync(disciplineDataPath) // Get all the files in the disciplineData dir
                              .filter(file => file.endsWith(".json")) // Filter for the json ones
                              .map(file => { // Map json file to the object because it's imported
                                  const filePath = path.join(disciplineDataPath, file);
                                  return require(filePath);
                              });

    },

    addRole: async function(guild, guildMember, roleName) {
        // Get role and create if it doesn't exist
        let roles = (await guild.roles.fetch()).filter(role => {
            return role["name"] == roleName;
        });
        let role;
        if (roles.size == 0) { // Role doesn't exist
            role = await guild.roles.create({
                name: roleName,
                color: 'BLUE',
                reason: 'New role needed',
            });
        } else { // Role exists
            role = roles.first();
        }
        // Assign role to user
        await guildMember.roles.add(role.id, 'add role to user');
    }
};
