const mongoose = require('mongoose');

/**
 * Configuration.
 */

const clientModel = require('./mongo/model/client'),
    tokenModel = require('./mongo/model/token'),
    userModel = require('./mongo/model/user');


/*
 * Methods used by all grant types.
 */

const getAccessToken = function (token, callback) {

    tokenModel.findOne({
        accessToken: token
    }).lean().exec((function (callback, err, token) {

        if (!token) {
            console.error('Token not found');
        }

        callback(err, token);
    }).bind(null, callback));
};

const getClient = function (clientId, clientSecret, callback) {

    clientModel.findOne({
        clientId: clientId,
        clientSecret: clientSecret
    }).lean().exec((function (callback, err, client) {

        if (!client) {
            console.error('Client not found');
        }

        callback(err, client);
    }).bind(null, callback));
};

const saveToken = function (token, client, user, callback) {

    token.client = {
        id: client.clientId
    };

    token.user = {
        username: user.username
    };

    const tokenInstance = new tokenModel(token);
    tokenInstance.save((function (callback, err, token) {

        if (!token) {
            console.error('Token not saved');
        } else {
            token = token.toObject();
            delete token._id;
            delete token.__v;
        }

        callback(err, token);
    }).bind(null, callback));
};

/*
 * Method used only by password grant type.
 */

const getUser = function (username, password, callback) {

    userModel.findOne({
        username: username,
        password: password
    }).lean().exec((function (callback, err, user) {

        if (!user) {
            console.error('User not found');
        }

        callback(err, user);
    }).bind(null, callback));
};

/*
 * Method used only by client_credentials grant type.
 */

const getUserFromClient = function (client, callback) {
    clientModel.findOne({
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        grants: 'client_credentials'
    }).lean().exec((function (callback, err, client) {

        if (!client) {
            console.error('Client not found');
        }

        callback(err, {
            username: ''
        });
    }).bind(null, callback));
};

/*
 * Methods used only by refresh_token grant type.
 */

const getRefreshToken = function (refreshToken, callback) {

    tokenModel.findOne({
        refreshToken: refreshToken
    }).lean().exec((function (callback, err, token) {

        if (!token) {
            console.error('Token not found');
        }

        callback(err, token);
    }).bind(null, callback));
};

const revokeToken = function (token, callback) {

    tokenModel.deleteOne({
        refreshToken: token.refreshToken
    }).exec((function (callback, err, results) {

        const deleteSuccess = results && results.deletedCount === 1;

        if (!deleteSuccess) {
            console.error('Token not deleted');
        }

        callback(err, deleteSuccess);
    }).bind(null, callback));
};

/**
 * Export model definition object.
 */

module.exports = {
    getAccessToken: getAccessToken,
    getClient: getClient,
    saveToken: saveToken,
    getUser: getUser,
    getUserFromClient: getUserFromClient,
    getRefreshToken: getRefreshToken,
    revokeToken: revokeToken
};