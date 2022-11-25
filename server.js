const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, name, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const db = JSON.parse(fs.readFileSync("data/users.json"));

    //
    // E. Checking for the user data correctness
    //
    if(!username || !name || ! password){
        res.json({ status: "error", error:"Username/Name/Password cannot be empty." });
        return;
    }

    if(!containWordCharsOnly(username)){
        res.json({ status: "error", error:"Username can only contains underscores, letters or numbers" });
        return;
    }

    if(username in db){
        res.json({ status: "error", error:"Username already exists" });
        return;
    }


    //
    // G. Adding the new user account
    //
    hash = bcrypt.hashSync(password, 10);
    db[username] = {avatar, name, "password":hash};

    //
    // H. Saving the users.json file
    //
    fs.writeFileSync("data/users.json", JSON.stringify(db, null, "  "));

    //
    // I. Sending a success response to the browser
    //
    res.json({ status: "success" });

    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const db = JSON.parse(fs.readFileSync("data/users.json"));


    //
    // E. Checking for username/password
    //
    if(!(username in db)){
        res.json({status: "error", error: "Invalid username"});
        return;
    }

    if(!bcrypt.compareSync(password, db[username].password)){
        res.json({status: "error", error: "Incorrect password."});
        return;
    }

    

    //
    // G. Sending a success response with the user account
    //
    user_data = {username: username, name:db[username].name};
    req.session.user = user_data;
    res.json({status: "success", user: user_data});

    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //

    if(req.session.user){
        res.json({status:"success", user:req.session.user});
    }
    else{
        res.json({status: "error"});
    }

    //
    // D. Sending a success response with the user account
    //
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    req.session.destroy();

    //
    // Sending a success response
    //
    res.json({status:"success"});
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

// socket uses session
io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

// online user list
let onlineUsers = {};


io.on("connection", (socket) => {

    // Add a new user to the online user list
    if(socket.request.session.user){
        const {username, name} = socket.request.session.user;
        onlineUsers[username] = {name};
    }

    // If the current user number is 2, start
    const num = Object.keys(onlineUsers).length;
    if(num === 2){
        io.emit("start");
    }

    socket.on("disconnect", () => {
        // Remove the user from the online user list
        const {username, name} = socket.request.session.user;
        delete onlineUsers[username];
        io.emit("end");
    })

    // socket.on("getNumUser", () => {
    //     const num = Object.keys(onlineUsers).length;
    //     if(num === 2){
    //         io.emit("Start");
    //     }
    // })

    

    
})




// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The server has started...");
});
