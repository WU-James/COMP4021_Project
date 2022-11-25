const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        
        // Hide it
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    Header.update(Authentication.getUser());
                    Header.show();
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
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const Header = (function() {
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
                    SignInForm.show();
                }
            );
        });
    };

    // This function shows the form with the user
    const show = function(user) {
        $("#header").show();
    };

    // This function hides the form
    const hide = function() {
        $("#header").hide();
    };

    // This function updates the user panel
    const update = function(user) {
        $("#title").html("Waiting for another user...");
        if (user) {
            $("#user-panel .user-name").text(user.name);
        }
        else {
            $("#user-panel .user-name").text("");
        }
    };


    let timeout = null;
    // This function count down from 5 and start the game when there are 2 users
    const start = function(){
        $("#title").html("5");

        let timeRemaining = 5;

        function countDown() {
            timeRemaining = timeRemaining - 1;
            $("#title").html(timeRemaining);
            if (timeRemaining > 0)
                timeout = setTimeout(countDown, 1000);
            else{
                $("#title").html("Game Start!");
            }
        }
    
        timeout = setTimeout(countDown, 1000);
    }

    const end = function(){
        clearTimeout(timeout);
        $("#title").html("You win!");
    }




    return { initialize, show, hide, update, start, end };
})();


const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, Header];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    return { getUserDisplay, initialize };
})();
