var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var StationtModel = require('../mongo/schema/station');

// Connecting to database
var query = process.env.CONNECTION_STRING;

const db = (query);
mongoose.Promise = global.Promise;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error) {
    if (error) {
        console.log("Error!" + error);
    }
});

// Post Data
router.post('/', function (req, res) {
    let newStation = new StationtModel();
    newStation.StationName = req.body.StationName;
    newStation.StationFreq = req.body.StationFreq;
    newStation.save(function (err, data) {
        if (err) {
            console.log(error);
        }
        else {
            res.send("Data inserted");
        }
    });
});

// Get all Data
router.get('/', function (req, res) {
    StationtModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

// Get specific Data
router.get('/:id', function (req, res) {
    StationtModel.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) },
        function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
            }
        });
});

// Delete A Data
router.delete('/:id', function (req, res) {
    StationtModel.deleteOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
                console.log("Data Deleted!");
            }
        });
});

// Update A Data
router.put('/:id', function (req, res) {
    const updateData = req.body;
    StationtModel.updateOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $set: updateData }, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
                console.log("Data updated!");
            }
        });
});

module.exports = router;