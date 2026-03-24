require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Load message log (optional, but good for debugging)
console.log('dotenv loaded successfully.');
console.log(`Server is attempting to start on port: ${PORT}`);

app.get('/', (req, res) => {
    res.send(`Server running on port ${PORT}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
