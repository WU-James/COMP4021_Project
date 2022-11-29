const Frontpage = (function() {
    // This function initializes the UI
    const initialize = function() {
        
        // Hide it
        $("#frontpage-container").hide();

        // Hightlight role image when selected
        $("#role1-radio").on("click", ()=>{
            $("#role1-img").css({"border-color": "grey","background-color": "#fde0c5"});
            $("#role2-img").css({"border-color": "transparent","background-color": "transparent"});

        })

        $("#role2-radio").on("click", ()=>{
            $("#role2-img").css({"border-color": "grey","background-color": "#fde0c5"});
            $("#role1-img").css({"border-color": "transparent","background-color": "transparent"});
        })

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();
            const role1 = document.getElementById("role1-radio").checked;
            const role2 = document.getElementById("role2-radio").checked;
            let role = null;

            if(!role1 && !role2){
                $("#signin-message").text("Please choose a player.");
                return;
            }
            else{
                if(role1) role=1;
                else role=2;
            }

            // Send a signin request
            Authentication.signin(username, password, role,
                () => {
                    hide();
                    GameHeader.setTitle("Waiting For Another User...");
                    GameHeader.updateUsers(Authentication.getUser(), Authentication.getAnotherUser());
                    GameHeader.show();
                    Socket.connect();
                },
                (error) => { $("#signin-message").text(error); }
            );

        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const name     = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function() {
        $("#frontpage-container").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#role1-img").css({"border-color": "transparent","background-color": "transparent"});
        $("#role2-img").css({"border-color": "transparent","background-color": "transparent"});
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#frontpage-container").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const GameHeader = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Hide it
        $("#header").hide();

        // Click event for the signout button
        $("#signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();

                    hide();
                    Frontpage.show();
                }
            );
        });
    };

    // This function shows the form with the user
    const show = function(user) {
        $("#header").show();
        $("#game-container").show();
    };

    // This function hides the form
    const hide = function() {
        $("#header").hide();

        $("#game-container").hide();

    };

    // This function updates the user panel
    const updateUsers = function(user, anotherUser) {
        if (user) {
            const test = user.name;
            $("#user-panel .user-name").html(user.name);
        }
        else {
            $("#user-panel .user-name").html("");
        }

        if (anotherUser) {
            $("#user-panel2 .user-name").html(anotherUser.name);
        }
        else {
            $("#user-panel2 .user-name").html("?");
        }
    };


    let timeout = null;
    // This function count down from 5 and start the game when there are 2 users
    const start = function(){
        $("#timer").html("5");

        let timeRemaining = 5;

        function countDown() {
            timeRemaining = timeRemaining - 1;
            $("#timer").html(timeRemaining);
            if (timeRemaining > 0)
                timeout = setTimeout(countDown, 1000);
            else{
                $("#timer").html("Game Start!");
                Gamestart.start();
            }
        }
    
        timeout = setTimeout(countDown, 1000);


    }

    const end = function(){
        clearTimeout(timeout);
    }

    const setTitle = function(text){
        $("#timer").html(text);
    }

    return { initialize, show, hide, updateUsers, start, end, setTitle };
})();

const UI = (function() {
    // The components of the UI are put here
    const components = [Frontpage, GameHeader];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { initialize };
})();

const Endpage = (function() {
    const initialize = function() {
        $("#endpage-container").show();

    };

    return {initialize};

})();

