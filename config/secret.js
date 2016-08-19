module.exports = {

    database: 'mongodb://.....',
    port: process.env.PORT || 3000,
    secretKey: ".....",

    facebook: {
        clientID: process.env.FACEBOOK_ID || '....',
        clientSecret: process.env.FACEBOOK_SECRET || '.....',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'https://........'
    },

    bonsai_url: process.env.BONSAI_URL,
    host: bonsai_url,
    log: 'trace'
}


// Bonsai Elasticsearch
var bonsai_url = process.env.BONSAI_URL;
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: bonsai_url,
    log: 'trace'
});


// Test the connection...
client.ping({
        requestTimeout: 30000,
        hello: "elasticsearch"
    },
    function(error) {
        if (error) {
            console.error('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    }
);
