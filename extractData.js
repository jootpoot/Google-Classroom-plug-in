const { google } = require('googleapis');
const axios = require('axios');

// Set up Google Classroom API credentials
const credentials = require('./credentials.json');
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Set up Google Classroom API
const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });

// Set up Classroom API request to list courses
async function listCourses() {
  try {
    const response = await classroom.courses.list();
    const courses = response.data.courses;

    // Extract course data into an array
    const courseData = courses.map(course => ({
      id: course.id,
      name: course.name,
      ownerId: course.ownerId,
      courseState: course.courseState,
    }));

    console.log('Courses:', courseData);
  } catch (err) {
    console.error('Error listing courses:', err.message);
  }
}

// Authenticate and run the script
async function authenticateAndRun() {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/classroom.courses.readonly'],
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    const code = ''; // Paste the code obtained from the authorization URL
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    await listCourses();
  } catch (err) {
    console.error('Authentication error:', err.message);
  }
}

authenticateAndRun();
