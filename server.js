const express = require('express');
const mailRoutes = require('./routes/mail');

const app = express();
app.use(express.json());

app.use('/api', mailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Temp Mail API running on port ${PORT}`));
