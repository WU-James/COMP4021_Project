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
            })

            socket.on("setPlayerAction", (msg)=>{
                msg = JSON.parse(msg);
                if(msg.user.username !== Authentication.getUser().username){
                    Gamestart.setPlayerAction(msg.keyCode, msg.keyStatus);
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


    return { getSocket, connect, disconnect, playerAction };

})();


