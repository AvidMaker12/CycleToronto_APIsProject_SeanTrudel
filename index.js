//-- IMPORT REQUIRED MODULES FROM node_modules --
const express = require("express");
const path = require("path"); // 'path' is a built-in Node module that provides a way of working with directories and file paths.
const https = require("https") // Separate module provides a way of making Node. js transfer data over HTTP TLS/SSL protocol, which is the secure HTTP protocol.

const axios = require("axios"); // Separate module that is a promise-based HTTP Client for node.js and the browser.
const qs = require("querystring"); // 'querystring' is a built-in Node module for manipulating query strings.

const fs = require("fs"); // Separate module that writes to a text file.

const dotenv = require("dotenv"); // Separate module that loads environment variables from .env file, used for storing important API information (e.g. keys, client ID, secret and redirect URI).
dotenv.config();

const app = express(); // Create 'express' app and store within 'app' const variable.
const port = process.env.PORT || "8888"; // Add port number for the code to be able to run on a local server for testing.


//-- APIs CODE --
/* API: Bicycle Parking Racks; from City of Toronto
 * API site: https://open.toronto.ca/dataset/bicycle-parking-racks/
 * API Documentation: https://docs.ckan.org/en/latest/api/index.html
*/

function getBicycleParkingRacks(response) {
  const packageId = "4ddba232-d235-4455-b710-537c89dec7d5";

  // promise to retrieve the package
  const getPackage = new Promise((resolve, reject) => {
      https.get(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=${packageId}`, (response) => {
          let dataChunks = [];
          response
              .on("data", (chunk) => {
                  dataChunks.push(chunk)
              })
              .on("end", () => {
                  let data = Buffer.concat(dataChunks)
                  resolve(JSON.parse(data.toString())["result"])
              })
              .on("error", (error) => {
                  reject(error)
              })
      });
  });

  getPackage.then(pkg => {
      // this is the metadata of the package
      //console.log(pkg);
  }).catch(error => {
      console.error(error);
  })
  // since this package has resources in the datastore, one can get the data rather than just the metadata of the resources
  // promise to retrieve data of a datastore resource 
  const getDatastoreResource = resource => new Promise((resolve, reject) => {
      https.get(`https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=${resource["id"]}`, (response) => {
          let dataChunks = [];
          response
              .on("data", (chunk) => {
                  dataChunks.push(chunk)
              })
              .on("end", () => {
                  let data = Buffer.concat(dataChunks)
                  resolve(JSON.parse(data.toString())["result"]["records"])
              })
              .on("error", (error) => {
                  reject(error)
              })
      })
  });

  // get the package information again
  getPackage.then(package => {
      // get the datastore resources for the package
      let datastoreResources = package["resources"].filter(r => r.datastore_active);

      // retrieve the first datastore resource as an example
      getDatastoreResource(datastoreResources[0])
          .then(resource => {
              // this is the actual data of the resource
              //console.log(resource);
              /*
              // Writes API data to a text file saved to the project root folder for development purposes only.
              fs.writeFile('BikeRack.txt', JSON.stringify(resource), function (err) {
                if (err) return console.log(err);
                console.log('Bike Rack > BikeRack.txt');
              });
              */
              response.render("index", { title: "Home", BikeRacks: resource});
          })
          .catch(error => {
              console.error(error);
          })
  }).catch(error => {
      console.error(error);
  });
} // End of function 'getBicycleParkingRacks'



//-- SETUP PATHS TO IMPORTANT FILES & FOLDERS --
// Set paths to templates/views in Views folder to see rendered page.
app.set("views", path.join(__dirname, "views")); // Set Express views to use <app_directory/views
app.set("view engine", "pug"); // Setup template view engine to 'Pug'
// Setup static path (for use with CSS, client-side JS, and image files).
app.use(express.static(path.join(__dirname, "public")));

//-- SETUP PAGE ROUTES --
// Routing for 'Home' pg.
app.get("/", (request, response) => {
  //response.render("index",{title:"Home"});
  getBicycleParkingRacks(response);
});

/*
//-- SITE ROUTING SECURITY --
app.get("/page-requiring-oauth", (req, res) => {
  if (accessToken !== undefined) {
    //get profile data
    //res.render("user");
    getProfileData(res);
  } else {
    startAuthorizing(res);
  }
});

app.get("/authorize", (req, res) => {
  if (req.query.code && (req.query.state == process.env.TRAKT_STATE)) {
    code = req.query.code; //if there's a code in the query string, store it
  }
  if (!accessToken && !code) {
    startAuthorizing(res);
  } else {
    getAccessToken(res);
  }
  //res.render("auth");
});
*/

//-- HTTP SERVER LISTENING --
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});



/*NOTES:
    - node index.js is a Terminal command to connect to local server to test code
    - Terminate process manually (when without Nodemon) by selecting Terminal, then pressing Ctrl + C keyboard command
    - Nodemon only (without browser-sync): refresh browser page to see changes
    - Request.body for POST requests forms (passes through body), Request.query for GET request forms (passes through URL query string)
    - Do not name form field names with hyphens, cannot handle (unlike CSS)
*/

