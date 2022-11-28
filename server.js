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

// online user list
let onlineUsers = {};





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
    db[username] = {name, "password":hash};

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
    const { username, password, role } = req.body;

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


    // Firstly, add user to online user list & session
    const name = db[username].name;
    onlineUsers[username] = {name, role};
    req.session.user = {username, name, role};

    // Check whether there is another user. If yes, return another user's info
    let another_user = null;

    if (Object.keys(onlineUsers).length == 2){
        for(const key in onlineUsers){
            if(key !== username){
                another_user = {username:key, ...onlineUsers[key]};
                break;
            }
        }
    }

    
    // Send response
    const user = {username, name, role};
    res.json({status:"success", user, another_user});

});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    const user = req.session.user;

    //
    // D. Sending a success response with the user account
    //


    // Check whether there is another user. If yes, return another user's info
    let another_user = null;

    if (Object.keys(onlineUsers).length == 2){
        for(const key in onlineUsers){
            if(key !== username){
                another_user = {username:key, ...onlineUsers[key]};
                break;
            }
        }
    }


    // Send respons
    if(user){
        res.json({status:"success", user, another_user});
    }
    else{
        res.json({status: "error"});
    }

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
 
});


//
// ***** Socket Part *****
//

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

// socket uses session
io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});




io.on("connection", (socket) => {
    

    // If the current user number is 2, start. Broadcast to update enemy (another user) info.
    const num = Object.keys(onlineUsers).length;
    if(num === 2){
        // Initialize 2 players position
        let pos = {};
        for (const key in onlineUsers){
            pos[key] = {x:Math.floor(Math.random() * 500 + 200), y:Math.floor(Math.random() * 100 + 280)};
           //pos[key].x = Math.floor(Math.random() * 854);
            //pos[key].y = Math.floor(Math.random() * 480);
        }
        const msg = {onlineUsers, pos}

        io.emit("start", JSON.stringify(msg, null, "  "));
    }

    socket.on("disconnect", () => {
        // Remove the user from the online user list
        const {username, name} = socket.request.session.user;
        delete onlineUsers[username];
        io.emit("end");
    })   

    socket.on("playerAction", (msg) => {
        io.emit("setPlayerAction", msg);
    })
    
})




// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The server has started...");
});
