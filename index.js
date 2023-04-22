// Import required modules
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const axios = require("axios");

require('dotenv').config();

// Create Express app
const app = express();

const bodyParser = require('body-parser');

// Parse JSON request bodies
app.use(bodyParser.json());
// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));


// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render("home");
})

const urlRequestOtp = 'https://api.emptra.com/aadhaarVerification/requestOtp'; // Specify the URL to send the request to
const urlEnterOtp = "https://api.emptra.com/aadhaarVerification/submitOtp";
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const headers = {'Content-Type': 'application/json', 'clientId': client_id, 'secretKey': client_secret }; // Set custom headers
var client;

app.post("/submit", (req, res) => {
    const AdhNum = req.body.aadhar;
    const data1 = { // Set request body data
        aadhaarNumber: AdhNum
    };

    // Perform HTTP POST request
    axios.post(urlRequestOtp, data1, { headers: headers })
    .then(response => {
    var dataRecieved = JSON.parse(JSON.stringify(response.data))
    // console.log(typeof(dataRecieved.result.data.otp_sent));
        console.log(dataRecieved );
        var otp_status = dataRecieved.result.data.otp_sent;
        client = dataRecieved.result.data.client_id;
        // console.log(otp_status);
        if(otp_status == true){
            res.render("SubmitOtp");
        }
        else{
            res.send({ "error": "Otp not sent!", "solution": "Enter valid aadhar or update the wallet of API" });
        }
    })
    .catch(error => {
    console.error('Error:', error);
    });

})

app.post("/submit-otp", (req, res) => {
    const UserOtp = req.body.otp;
    const data2 = { // Set request body data
        client_id: client,
        otp: UserOtp
    };

    // Perform HTTP POST request
    axios.post(urlEnterOtp, data2, { headers: headers })
    .then(response => {
    var dataRecieved = JSON.parse(JSON.stringify(response.data))
        console.log(dataRecieved );
        res.send(dataRecieved);
    })
    .catch(error => {
    console.error('Error:', error);
    });

})


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});