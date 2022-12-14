const Authentication = (function() {
    // This stores the current signed-in user
    let user = null;
    let another_user = null;

    // This function gets the signed-in user
    const getUser = function() {
        return user;
    }

    const getAnotherUser = function() {
        return another_user;
    }

    const setAnotherUser = function(user) {
        another_user = user;
    }

    // This function sends a sign-in request to the server
    // * `username`  - The username for the sign-in
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signin = function(username, password, role, onSuccess, onError) {

        //
        // A. Preparing the user data
        //

        const data = JSON.stringify({username, password, role});
 
        //
        // B. Sending the AJAX request to the server
        //
        fetch("/signin", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: data
        })
        
        // H. Handling the success response from the server
        .then(res => res.json())
        .then(json =>{
            if(json.status === "success"){
                user = json.user;
                another_user = json.another_user;
                onSuccess();
            }
            else if (onError) onError(json.error);
        })
        
        // F. Processing any error returned by the server
        .catch(err => {
            console.log("Error: " + err);
        })


        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    // This function sends a validate request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const validate = function(onSuccess, onError) {

        //
        // A. Sending the AJAX request to the server
        //
        fetch("/validate")

        //
        // C. Processing any error returned by the server
        //
        

        //
        // E. Handling the success response from the server
        //
        .then(res => res.json())
        .then(json => {
            if(json.status === "success"){
                user = json.user;
                another_user = json.another_user;
                onSuccess();
            }
            else{
                onError();
            }
        })

        .catch(err => {
            console.log("Error: " + err);
        })

        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    // This function sends a sign-out request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signout = function(onSuccess, onError) {

        fetch("/signout")
        .then(res => res.json())
        .then(json => {
            if(json.status === "success"){
                onSuccess();
            }
        })
        // Delete when appropriate
        //if (onError) onError("This function is not yet implemented.");
    };

    return { getUser, getAnotherUser, setAnotherUser, signin, validate, signout };
})();
