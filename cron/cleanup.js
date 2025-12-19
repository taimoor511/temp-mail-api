const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEMP_HOME = '/home';
const MAX_AGE_HOURS = 24; // Delete users older than 1 day

function cleanupTempUsers() {
  const users = fs.readdirSync(TEMP_HOME);

  users.forEach(user => {
    if (!user.startsWith('temp')) return; // Only temp users

    const userPath = path.join(TEMP_HOME, user);
    const stats = fs.statSync(userPath);
    const ageHours = (Date.now() - stats.ctimeMs) / 1000 / 3600;

    if (ageHours > MAX_AGE_HOURS) {
      console.log(`Deleting temp user: ${user} (age: ${ageHours.toFixed(2)} hours)`);

      try {
        // Delete the user and their home directory
        execSync(`sudo deluser --remove-home ${user}`);
        console.log(`Deleted ${user} successfully`);
      } catch (err) {
        console.error(`Failed to delete ${user}:`, err.message);
      }
    }
  });
}

cleanupTempUsers();
