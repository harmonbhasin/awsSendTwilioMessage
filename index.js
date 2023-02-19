require('dotenv').config()
const mysql = require('mysql2')

exports.handler = (event, context, callback) => {
    
    // Your Account SID from www.twilio.com/console
    // See http://twil.io/secure for important security information
    const accountSid = process.env.ACCOUNT_SID;

    // Your Auth Token from www.twilio.com/console 
    // See http://twil.io/secure for important security information
    const authToken = process.env.AUTH_TOKEN;

    // Import Twilio's Node Helper library
    // Create an authenticated Twilio Client instance
    const client = require('twilio')(accountSid, authToken);
    
    // Creates connection to PlanetScale
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    
    // Creates a query to get the name and phone number of each client.
    const query = `SELECT phone, fname, lname FROM Personal`;
    
    connection.query(query, (error, results) => {
        if (error) throw error;
        // Save the results into a variable
        const clients = results;
        
        clients.forEach((person) => {
            client.messages.create({body:'Good morning ' + person.fname + ", how much do you weigh today (lbs or kgs)?", to: person.phone, from:'+15802035836'}).then((message)=>{callback(null,message.sid)}).catch((e)=>{callback(Error(e))});
        });
    });
    connection.end();
    
    return {
        statusCode:200
    }
};


