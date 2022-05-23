const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;
const router = express.Router();
require('dotenv').config()
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const mongoUri = `${process.env.CONNECTION_STRING}`;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, res) {

    if (err) {
        return console.error('Error connecting to "%s":', mongoUri, err);
    }
    console.log('Connected successfully to "%s"', mongoUri);
});

app.oauth = new OAuth2Server({
    model: require('../model.js'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

function obtainToken(req, res) {
    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.token(request, response)
        .then(function (token) {

            res.json(token);
        }).catch(function (err) {

            res.status(err.code || 500).json(err);
        });
}

function authenticateRequest(req, res, next) {

    const request = new Request(req);
    const response = new Response(res);

    return app.oauth.authenticate(request, response)
        .then(function (token) {

            next();
        }).catch(function (err) {

            res.status(err.code || 500).json(err);
        });
}

router.all('/oauth/token', obtainToken);

router.get('/', authenticateRequest, function (req, res) {

    res.send('Congratulations, you are in a secret area!');
});
module.exports = router;