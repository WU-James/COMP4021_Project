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
            
        });

        socket.on("start", (onlineUsers) => {
            GameHeader.start();

            // Set another user's info in Authentication
            onlineUsers = JSON.parse(onlineUsers);
            const user = Authentication.getUser();
            for (const key in onlineUsers){
                if (key !== user.username){
                    Authentication.setAnotherUser(onlineUsers[key]);
                }
            }

            // Update header
            GameHeader.updateUsers(user, Authentication.getAnotherUser());
        })

        socket.on("end", () =>{
            GameHeader.end();
            GameHeader.setTitle("You Win!")
            GameHeader.updateUsers(Authentication.getUser(),null);
        })

    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };



    return { getSocket, connect, disconnect };
})();
