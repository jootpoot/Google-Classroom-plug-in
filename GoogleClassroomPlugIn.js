// Kevin
function retrieveCourseStuInfoData() {
    try {
      const classdata = Classroom.Courses.list({
      courseStates: 'ACTIVE'
    }).courses;
  
      classdata.forEach(course => {
        const students = Classroom.Courses.Students.list(course.id).students;
  
        // Initialize an array to store the data
        const Studata = [];
  
        students.forEach(student => {
          Studata.push([student.profile.name.familyName, student.profile.name.givenName, student.profile.emailAddress]);
        });
  
        // Link spreadsheet
        let spreadsheet = SpreadsheetApp.openById("1hQzk67w5Au7fCMPb4ySJ81S1qQGRV9v350Lfxycu7Tk");
  
        let sheet = spreadsheet.getSheetByName(course.name);
        if (!sheet) {
          sheet = spreadsheet.insertSheet(course.name);
        }
  
        // Set the header row
        const headerRow = ["Last Name", "First Name", "Email-Address"];
        sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
  
        // Where to start inserting data
        const startRow = 2;
        const startColumn = 1;
  
        sheet.getRange(startRow, startColumn, Studata.length, Studata[0].length).setValues(Studata);
  
        // Statement that runs if all the data has been added
        console.log(`New Student data has been added to ${course.name} sheet`);
      });
    } catch (error) {
      console.error("Error: " + error.toString());
    }
  }
  
  // Aishani
  function updateData() {
    const classdata = Classroom.Courses.list({
      courseStates: 'ACTIVE'
    }).courses;
  
    let spreadsheet = SpreadsheetApp.openById("1hQzk67w5Au7fCMPb4ySJ81S1qQGRV9v350Lfxycu7Tk");
  
    classdata.forEach(course => {
      let sheet = spreadsheet.getSheetByName(course.name);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(course.name);
      }
  
      const students = Classroom.Courses.Students.list(course.id).students;
      const courseWork = Classroom.Courses.CourseWork.list(course.id).courseWork;
  
      if (!courseWork) {
        console.error(`No course work found for course ${course.name}`);
        return;
      }
  
      const studentData = {};
  
  
    // Jyotsana {
      // Loops through each student and create an object to store their data
      students.forEach(student => {
        studentData[student.profile.emailAddress] = {
          firstName: student.profile.name.givenName,
          lastName: student.profile.name.familyName,
          email: student.profile.emailAddress,
          scores: {}
        };
      });
      // Loops through each piece of course work and gets submissions
      courseWork.forEach(work => {
        const submissions = Classroom.Courses.CourseWork.StudentSubmissions.list(course.id, work.id).studentSubmissions;
  
        // Loops through each submission and matches the student to the submission
        submissions.forEach(submission => {
          const student = students.find(student => student.userId === submission.userId);
  
          //update their scores, if there is no score it assigns "-"
          if (student) {
            const score = submission.assignedGrade? submission.assignedGrade : "-";
            studentData[student.profile.emailAddress].scores[work.title] = score;
          }
        });
      });
  
      // Format the Student info
      const headers = ["Last Name", "First Name", "Email-Address"].concat(courseWork.map(work => work.title));
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1,1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#9BC1BC');
  
      // Creates an array of formatted data to output
      const data = Object.keys(studentData).map(email => {
        const student = studentData[email];
        return [student.lastName, student.firstName, student.email].concat(courseWork.map(work => student.scores[work.title] || "-"));
      });
  
      const startRow = 2;
      const startColumn = 1;
      sheet.getRange(startRow, startColumn, data.length, data[0].length).setValues(data);
      sheet.setFrozenColumns(3);
      sheet.setFrozenRows(1);
  
  
  
    });
  }
  
  function onChanges() {
    updateData();
  }
  // }
  