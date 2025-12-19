const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const MAIL_ROOT = "/home";
const DOMAIN = "taimoor.site";

// Generate unique username
function generateUsername() {
    return `temp${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// Create temp email
function createTempEmail() {
    return new Promise((resolve, reject) => {
        const username = generateUsername();
        const email = `${username}@${DOMAIN}`;
        const userHome = path.join(MAIL_ROOT, username);

        exec(`sudo adduser --disabled-password --gecos "" ${username} && sudo -u ${username} maildirmake.dovecot ${userHome}/Maildir && sudo chown -R ${username}:${username} ${userHome}/Maildir`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve({ username, email });
        });
    });
}

// Fetch emails
function getEmails(username) {
    return new Promise((resolve, reject) => {
        const maildirNew = path.join(MAIL_ROOT, username, 'Maildir', 'new');
        if (!fs.existsSync(maildirNew)) return reject(new Error('User not found'));

        const emails = fs.readdirSync(maildirNew).map(file => ({
            file,
            content: fs.readFileSync(path.join(maildirNew, file), 'utf-8')
        }));
        resolve({ emails });
    });
}

// Delete temp email
function deleteTempEmail(username) {
    return new Promise((resolve, reject) => {
        exec(`sudo deluser --remove-home ${username}`, (error, stdout, stderr) => {
            if (error) return reject(new Error(stderr));
            resolve({ message: `Temp email ${username} deleted` });
        });
    });
}

module.exports = { createTempEmail, getEmails, deleteTempEmail };
