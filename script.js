function retrieveStuInfoData() {
    try {
        const classdata = Classroom.Courses.list().courses;

        // Initialize an array to store the data
        const Studata = [];

        // Loop through each course in Classroom 
        classdata.forEach(course => {
            // Retrieve all students for the current course
            const students = Classroom.Courses.Students.list(course.id).students;
            
            // Loop through each student
            students.forEach(student => {
                Studata.push([student.profile.name.familyName, student.profile.name.givenName, student.profile.emailAddress]);
            });
        });

        Logger.log(Studata);

        // Link spreadsheet
        const spreadsheet = SpreadsheetApp.openById("1hQzk67w5Au7fCMPb4ySJ81S1qQGRV9v350Lfxycu7Tk");
        const sheet = spreadsheet.getSheetByName("testsheet");

        // Where to start inserting data
        const startRow = 2;
        const startColumn = 1;

        sheet.getRange(startRow, startColumn, Studata.length, Studata[0].length).setValues(Studata);

        // Statement that runs if all the data has been added 
        console.log("New Student data has been added");
    } catch (error) {
        console.error("Error: " + error.toString());
    }
}







function retrieveCourseData() {
    try {
        const classdata = Classroom.Courses.list().courses;

        // Initialize an array to store the data
        const Coursedata = [];

        // Loop through each course in Classroom
        classdata.forEach(course => {
            // Retrieve all students for the current course
            const students = Classroom.Courses.Students.list(course.id).students;
            const courseWork = Classroom.Courses.CourseWork.list(course.id).courseWork;

            // Loop through each course work
            courseWork.forEach(work => {
                // Retrieve student submissions for the current work
                const submissions = Classroom.Courses.CourseWork.StudentSubmissions.list(course.id, work.id).studentSubmissions;

                // Loop through each student submission
                submissions.forEach(submission => {
                    // Retrieve the student for the current submission
                    const student = students.find(student => student.userId === submission.userId);

                    if (student) {
                        const score = submission.assignedGrade ? submission.assignedGrade : "-";
                        
                        // Push data into array for each combination
                        Coursedata.push([work.title, score ]);
                    }
                });
            });
        });

        Logger.log(Coursedata);

        // Link spreadsheet
        const spreadsheet = SpreadsheetApp.openById("1hQzk67w5Au7fCMPb4ySJ81S1qQGRV9v350Lfxycu7Tk");
        const sheet = spreadsheet.getSheetByName("testsheet");

        // Where to start inserting data
        const startRow = 1;
        const startColumn = 4;

        sheet.getRange(startRow, startColumn, Coursedata.length, Coursedata[0].length).setValues(Coursedata);

        // Statement that runs if all the data has been added 
        console.log("New Course data has been added");

    } catch (error) {
        console.error("Error: " + error.toString());
    }
}
