module.exports = {

    // Takes disicpline JSON file and finds all courses, retruns list of every course + Description 
    getCourses: function(discipline){

        const allCourses = [];

        for(const course in discipline["common core courses"]){
            const topic = discipline["common core courses"][course];
            allCourses.push((course, topic));
        }
        
        for(const subPlan in discipline["sub-plans"]){
            const courses = Object.keys(discipline["sub-plans"][subPlan]["courses"]);
            for(const course of courses){
                const topic = discipline["sub-plans"][subPlan]["courses"][course];
                allCourses.push((course, topic));
            }
        }
        for(const choice of discipline["choices"]){
            for(const course in choice){
                const topic = discipline["choices"][course];
                allCourses.push((course, topic));
            }
        }

        return allCourses;

    },
};