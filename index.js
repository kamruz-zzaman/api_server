// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// Import Routes
const authRoute = require('./routes/auth');
const stationRoute = require('./routes/stations')

// application routes
const run = async () => {
    app.get('/', (req, res) => {
        res.send('Hey, Welcome !');
    });
    app.use('/auth', authRoute);
    app.use('/station', stationRoute);
}


run().catch(console.dir);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
