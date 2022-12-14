const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {

            socket.on("start", (msg) => {
                GameHeader.start();
                
                // Initialize life
                // if(Authentication.getUser().role == 1){
                //     $("#user-panel .life").html("Life:3");
                // }
                // else{
                //     $("#user-panel .life").html("Life:4");
                // }

                // if(Authentication.getAnotherUser().role == 1){
                //     $("#user-panel2 .life").html("Life:3");
                // }
                // else{
                //     $("#user-panel2 .life").html("Life:4");
                // }


                // Set another user's info in Authentication
                msg = JSON.parse(msg);
                const user = Authentication.getUser();
                for (const key in msg.onlineUsers){
                    if (key !== user.username){
                        another_user = {username:key, ...msg.onlineUsers[key]};
                        Authentication.setAnotherUser(another_user);
                    }
                }
    
                // Update header
                GameHeader.updateUsers(user, Authentication.getAnotherUser());


                // Set initial position
                let x1 = null, y1 = null, x2 = null, y2 = null;
                x1 = msg.pos[Authentication.getUser().username].x;
                y1 = msg.pos[Authentication.getUser().username].y;
                x2 = msg.pos[Authentication.getAnotherUser().username].x;
                y2 = msg.pos[Authentication.getAnotherUser().username].y;

                Gamestart.initPlayerPosition(x1, y1, x2, y2);
            })
    
            socket.on("end", () =>{
                GameHeader.end();
                GameHeader.setTitle("You Win!")
                GameHeader.updateUsers(Authentication.getUser(),null);
                Endpage.initialize();
            })

            socket.on("setPlayerAction", (msg)=>{
                msg = JSON.parse(msg);
                if(msg.user.username !== Authentication.getUser().username){
                    Gamestart.setPlayerAction(msg.keyCode, msg.keyStatus);
                }
            })

            socket.on("setPlayerAttr", (msg)=>{
                msg = JSON.parse(msg);
                if(msg.user.username !== Authentication.getUser().username){
                    Gamestart.setPlayerAttr(msg.life, msg.speed, msg.power);
                    GameHeader.updateAnotherLife(msg.life);
                    console.log(msg.life);
                    console.log(msg.speed);
                    console.log(msg.power);
                }
            })

            socket.on("createItem", (msg)=>{
                msg = JSON.parse(msg);
                Gamestart.spawnItem(msg.choice, msg.x, msg.y);
            })

            socket.on("createMob", (msg)=>{
                msg = JSON.parse(msg);
                Gamestart.spawnMob(msg.choice, msg.x, msg.y);
            })

            socket.on("setMobDir", (msg) => {
                msg = JSON.parse(msg);
                Gamestart.setMobDir(msg.dir);
            })

            socket.on("setAnotherScore", (msg)=>{
                msg = JSON.parse(msg);
                if(msg.user.username !== Authentication.getUser().username){
                    GameHeader.setAnotherScore(msg.points);
                }
            })

            socket.on("setEnd", (msg) =>{
                msg = JSON.parse(msg);
                if(msg.user.username !== Authentication.getUser().username){
                    Gamestart.setEnd("win");
                }
                else{
                    Gamestart.setEnd("lose");
                }
            })
        });

    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };


    // This function inform server of player action
    const playerAction = function(keyCode, keyStatus) {
        const user = Authentication.getUser();
        const msg = JSON.stringify({user, keyCode, keyStatus}, null, "  ");
        socket.emit("playerAction", msg);
    }

    // This function inform server of player attribute update
    const playerAttr = function(life, speed, power){
        const user = Authentication.getUser();
        const msg = JSON.stringify({user, life, speed, power}, null, "  ");
        socket.emit("playerAttr", msg);
        GameHeader.updateLife(life);

        console.log(life);
        console.log(speed);
        console.log(power);
    }

    const anotherScore = function(points){
        const user = Authentication.getUser();
        const msg = JSON.stringify({user, points}, null, "  ");
        socket.emit("anotherScore", msg);
    }

    const end = function(status){
        if(status === "win"){
            socket.emit("end", JSON.stringify(Authentication.getUser(), null, "  "));
        }
        else{
            socket.emit("end", JSON.stringify(Authentication.getAnotherUser(), null, "  "));
        }
    }

    return { getSocket, connect, disconnect, playerAction, playerAttr, anotherScore, end };

})();


