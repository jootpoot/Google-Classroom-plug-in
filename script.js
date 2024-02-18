function retrieveData() {
    try {
        const classdata = Classroom.Courses.list().courses;

        // Delate an array to store the data
        const data = [];

        // Loop through each in course classroom 
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
                        data.push([course.name, student.profile.name.familyName, student.profile.name.givenName, student.profile.emailAddress, work.title, score]);
                    }
                });
            });
        });

        Logger.log(data);

        //link spreadsheet
        const spreadsheet = SpreadsheetApp.openById("1hQzk67w5Au7fCMPb4ySJ81S1qQGRV9v350Lfxycu7Tk");
        const sheet = spreadsheet.getSheetByName("testsheet");

        //where to start inserting data
        const startRow = 2;
        const startColumn = 1;

        sheet.getRange(startRow, startColumn, data.length, data[0].length).setValues(data);

        
        //statement that runs if all the data has been added 
        console.log("New classroom data has been added");
    } catch (error) {
        console.error("Error: " + error.toString());
    }
}
// 