const express = require('express');
const router = express.Router();
const { createTempEmail, getEmails, deleteTempEmail } = require('../utils/mailUtils');

// Create temp email
router.post('/create', async (req, res) => {
    try {
        const result = await createTempEmail();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// List emails
router.get('/emails/:username', async (req, res) => {
    try {
        const emails = await getEmails(req.params.username);
        res.json(emails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete temp email
router.delete('/delete/:username', async (req, res) => {
    try {
        const result = await deleteTempEmail(req.params.username);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
