const path = require("node:path");
const fs = require("node:fs");
module.exports = {

    // Takes disicpline JSON file and finds all courses, retruns list of every course + Description + Semseter
    // Also returns courses only for a subdiscpline if specified else returns all courses in JSON
    getCourses: function(discipline, Subdiscipline = "None"){

        const allCourses = [];

        for(const course in discipline["common core courses"]){
            const topic = discipline["common core courses"][course][0];
            const semester = discipline["common core courses"][course][1];
            allCourses.push([course, topic, semester]);
        }

        if(Subdiscipline !== "None"){
            for(const d in discipline["sub-plans"]){
                if(discipline["sub-plans"][d]["name"] === Subdiscipline){
                    console.log("test");
                    Subdiscipline = d;
                    break;
                }
            }

            const courses = Object.keys(discipline["sub-plans"][Subdiscipline]["courses"]);

            for(const course of courses){
                const topic = discipline["sub-plans"][Subdiscipline]["courses"][course][0];
                const semester = discipline["sub-plans"][Subdiscipline]["courses"][course][1];
                allCourses.push([course, topic, semester]);
            }
            return allCourses;
        }

        
        for(const subPlan in discipline["sub-plans"]){
            const courses = Object.keys(discipline["sub-plans"][subPlan]["courses"]);
            for(const course of courses){
                const topic = discipline["sub-plans"][subPlan]["courses"][course][0];
                const semester = discipline["sub-plans"][subPlan]["courses"][course][1];
                allCourses.push([course, topic, semester]);
            }
        }

        for(const choice of discipline["choices"]){
            for(const course in choice){
                const topic = choice[course][0];
                const semester = choice[course][1];
                allCourses.push([course, topic, semester]);
            }
        }
        return allCourses;

    },

    // Gets discpline JSON objects
    getDisciplines: function() {
        const disciplineDataPath = path.join(__dirname, "disciplineData");
        return fs.readdirSync(disciplineDataPath) // Get all the files in the disciplineData dir
                              .filter(file => file.endsWith(".json")) // Filter for the json ones
                              .map(file => { // Map json file to the object because it's imported
                                  const filePath = path.join(disciplineDataPath, file);
                                  return require(filePath);
                              });

    },

    // Creats of list of needed roles for each discipline
    // Returns a list of lists of the format [[Name, Type]]
    // Type can be either "M" main or "S" for Subdiscpline
    // First item will always be main
    getDiscplineRoles: function(disciplineJSON){
        const output = [];
        const main_discpline = disciplineJSON["name"];
        output.push([main_discpline, "M"]);

        for(const sub of Object.keys(disciplineJSON["sub-plans"])){
            output.push([disciplineJSON["sub-plans"][sub]["name"], "S"]);
        }

        return output;
    },
    
    addRole: async function(guild, roleName, colour) {
        // Get role and create if it doesn't exist
        const role = await guild.roles.cache.find((r) => r.name === roleName);

        if (role !== undefined){
            return;
        }

        console.log(`${roleName} does not exist`);

        await guild.roles.create({
            name: roleName,
            color: colour,
        });

    },

    assignRole: async function(member, role_name){
        const role = member.guild.roles.cache.find((r) => r.name === role_name);
        if (!role) return;
        member.roles.add(role);
    },
};
