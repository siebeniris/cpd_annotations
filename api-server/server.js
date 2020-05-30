// https://robkendal.co.uk/blog/how-to-build-a-restful-node-js-api-server-using-json-files/

// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');

// create an instance of express to serve our end points
const app = express();

// we will load up node's built in file system helper library here
const fs = require('fs');

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// this is where we'll handle our various routes from
// passes our instance of express, app and the node file system library, fs into the routs

const routes = require('./routes/routes.js')(app, fs);

// finally, launch our server on port 3001.
const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});

