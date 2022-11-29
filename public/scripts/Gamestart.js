const Gamestart = function(){
    /* Get the canvas and 2D context */
    const cv = $("canvas").get(0);
    const context = cv.getContext("2d");
    const totalGameTime = 200;   // Total game time in seconds
    const itemMaxAge = 3000;     // The maximum age of the items in milliseconds
    const trapMaxAge=4000;
    let gameStartTime = 0;      // The timestamp when the game starts

    

    /* create players in the game */
    let player = null;
    let player2 = null;
    let player_init_pos = {x1:0, y1:0, x2:0, y2:0}

    /* create mob in the game */
    let mobs = [];
    let mobNum = 0;
    let mobID = 0;
    const mobTime = Math.random()*7000;

    /* create items in the game */
    let items = [];
    let itemID = 0;
    let itemNub=0;

    const sounds = {
        collect: new Audio("../music/collect.mp3"),
    };
    

    /* Create the game area */
    let gameArea = null;

    const start = function(){
        gameArea = BoundingBox(context, 245, -20, 400, 880);

        // Create 2 players
        player = (Authentication.getUser().role === 1) ?  Character_Swordsman(context,player_init_pos.x1,player_init_pos.y1,gameArea) : Character_Berserker(context, player_init_pos.x1, player_init_pos.y1, gameArea); 
        player2= (Authentication.getAnotherUser().role === 1) ?  Character_Swordsman(context,player_init_pos.x2,player_init_pos.y2,gameArea) : Character_Berserker(context, player_init_pos.x2, player_init_pos.y2, gameArea);
        [x,y]=gameArea.getPoints().topLeft;
        [a,b]=gameArea.getPoints().topRight;
        [c,d]=gameArea.getPoints().bottomRight;
        [e,h]=gameArea.getPoints().bottomLeft;


        function spawnMob(){
            if(mobNum<=20){
                let choice = Math.floor(Math.random() * 4);
                if(choice === 0){
                    mobs[mobID] =  Mob_Bat(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    mobNum++;mobID++;
                }
                else if(choice === 1 ){
                    mobs[mobID] =  Mob_Sprite(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    mobNum++;mobID++;
                }
                else{
                    mobs[mobID] = Mob_Slime(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    //mobs[mobID] = Mob_Shinigami(context, 700+Math.random()*150, 260+Math.random()*150, gameArea);
                    mobNum++;mobID++;
                }
                if(mobNum === 19){
                    mobs[mobID] = Mob_Shinigami(context, 700+Math.random()*100, 260+Math.random()*100, gameArea);
                    mobNum++;mobID++;
                }
            }
            setTimeout(spawnMob,mobTime);
        }
        setTimeout(spawnMob,mobTime);


        //Create Effect
        const Effect=AttackEffect(context,2000,30);

        /* The main processing of the game */
        function doFrame(now) {
            if (gameStartTime === 0) gameStartTime = now;

            /* Update the time remaining */
            const gameTimeSoFar = now - gameStartTime;
            const timeRemaining = Math.ceil((totalGameTime * 1000 - gameTimeSoFar) / 1000);
            $("#time-remaining").text(timeRemaining);

            if(timeRemaining===0)
            {
                return;
            }

            /* Handle the game over situation here */
            // if(timeRemaining<=0)
            // {
            //     $("#final-gems").html(collectedGems);
            //     $("#game-over").show();
            //     sounds.background.pause();
            //     sounds.gameover.play();
            //     return;
            // }

            /* Update the sprites */
            player.update(now);
            player2.update(now);
            Effect.update(now);
            for(let i = 0; i<mobs.length;i++){
                mobs[i].update(now);
            }
            for(let i = 0; i<itemNub;i++){
                items[i].update(now);
            }

            // Check
            for (let i=0;i<items.length;i++) {
                let x = items[i].getX();
                let y = items[i].getY();
                const box = player.getBoundingBox();
                if (box.isPointInBox(x, y)) {
                    if(items[i].name==="Heart")
                    {
                        sounds.collect.pause();
                        sounds.collect.load();
                        sounds.collect.play();
                        player.increaseLife();
                        items[i].hide();
                    }
                    else if(items[i].name==="Fire")
                    {
                        player.decreaseLife();
                        items[i].hide();
                    }
                    else if(items[i].name==="Speed")
                    {
                        player.increaseSpeed();
                        items[i].hide();
                    }
                    else if(items[i].name==="Attack")
                    {
                        player.increasePower();
                        items[i].hide();
                    }
                    else if(items[i].name==="Fan")
                    {
                        player.decreaseSpeed();
                        items[i].hide();
                    }
                    else if(items[i].name==="ICE")
                    {
                        player.decreasePower();
                        items[i].hide();
                    }
                }
            }
           //Disappear
            for (let i=0;i<items.length;i++) {
                if(items[i].name==="Heart")
                {
                    if(items[i].getAge(now)>itemMaxAge)
                    {
                        items[i].hide();
                    }
                }
                else if(items[i].name==="Fire")
                {
                    if(items[i].getAge(now)>trapMaxAge)
                    {
                        items[i].hide();
                    }
                }
                // else if(items[i].name==="Speed")
                // {
                //     if(items[i].getAge(now)>itemMaxAge)
                //     {
                //         items[i].hide();
                //     }
                // }
                // else if(items[i].name==="Attack")
                // {
                //     if(items[i].getAge(now)>itemMaxAge)
                //     {
                //         items[i].hide();
                //     }
                // }
                // else if(items[i].name==="Fan")
                // {
                //     if(items[i].getAge(now)>trapMaxAge)
                //     {
                //         items[i].hide();
                //     }
                // }
                // else if(items[i].name==="ICE")
                // {
                //     if(items[i].getAge(now)>trapMaxAge)
                //     {
                //         items[i].hide();
                //     }
                // }
                else if(items[i].getAge(now)>itemMaxAge)
                {
                    items[i].hide();
                }
            }
            //check effect
            if(Effect.getAge(now)>430)
            {
                Effect.setXY(2000,300);
            }
            //check life
            if(player.checkLife()===true)
            {
                player.Die();

            }

            /* Clear the screen */
            context.clearRect(0, 0, cv.width, cv.height);

            /* Draw the sprites */
            //chest.draw();
            player.draw();
            player2.draw();
            Effect.draw();

            for(let i = 0; i<mobs.length;i++){
                mobs[i].draw();
            }
            for(let i = 0; i<items.length;i++){
                items[i].draw(now);
            }

            /* Process the next frame */
            requestAnimationFrame(doFrame);
        };

        /* Randomize the dir and move mob  */
        function movement(){
            for(let i = 0; i<mobNum;i++){
                let mobDir = Math.floor(Math.random() * 8);
                    if(mobDir>=5){
                        mobs[i].move(1);
                    }
                    else{
                        mobs[i].move(mobDir);
                    }
            }
            setTimeout(movement,1000+Math.random() * 500);
        }
        setTimeout(movement,1000+Math.random() * 500);

        /* Handle the keydown of arrow keys and spacebar */
        $(document).on("keydown", function(event) {
            // Inform server of player action
            Socket.playerAction(event.keyCode, "keydown");
            /* Handle the key down */
            switch(event.keyCode){
                case 37:player.move(1);break
                case 38:player.move(2);break;
                case 39:player.move(3);break;
                case 40:player.move(4);break;
                case 32:player.attack();break;
            }
            if(event.keyCode===32)
            {
                for (let a = 0; a < mobs.length; a++) {
                    let x = mobs[a].getX();
                    let y = mobs[a].getY();
                    if(player.name==="Swordsman")
                    {
                        const box = player.getAttackingBoxSword();
                        if (box.isPointInBox(x, y)) {
                            Effect.setXY(x,y);
                            Effect.born();
                            player.increasePoints();
                            mobs[a].hide();
                        }
                    }
                    else if(player.name==="Berserker")
                    {
                        const box = player.getAttackingBox();
                        if (box.isPointInBox(x, y)) {
                            Effect.setXY(x,y);
                            Effect.born();
                            player.increasePoints();
                            mobs[a].hide();
                        }
                    }
                }
            }
         });

        /* Handle the keyup of arrow keys and spacebar */
        $(document).on("keyup", function(event) {
            // Inform server of player action
            Socket.playerAction(event.keyCode, "keyup");
            /* Handle the key up */
            switch(event.keyCode){
                case 37:player.stop(1);break;
                case 38:player.stop(2);break;
                case 39:player.stop(3);break;
                case 40:player.stop(4);break;
                case 32:player.attackdone();break;
            }
        });
        // /* Start the game */
        requestAnimationFrame(doFrame);
    }

    const setPlayerAction = function(keyCode, keyStatus){
        if(keyStatus === "keydown"){
            switch(keyCode){
                case 37:player2.move(1);break;
                case 38:player2.move(2);break;
                case 39:player2.move(3);break;
                case 40:player2.move(4);break;
                case 32:player2.attack();break;
            }
        }
        else{
            switch(keyCode){
                case 37:player2.stop(1);break;
                case 38:player2.stop(2);break;
                case 39:player2.stop(3);break;
                case 40:player2.stop(4);break;
                case 32:player2.attackdone();break;
            }
        }
    }

    const initPlayerPosition = function(x1, y1, x2, y2){
        player_init_pos.x1 = x1;
        player_init_pos.y1 = y1;
        player_init_pos.x2 = x2;
        player_init_pos.y2 = y2;
    }

    const setPlayerAttr = function(life, speed, power){
        player2.setAttr(life, speed, power);
    }

    const spawnItem = function(choice, x, y){
        if(choice === 0){
            items[itemID] =  Item_Heart(context, x, y, gameArea);
            itemNub++;itemID++;
        }
        else if(choice === 1){
            items[itemID] =  Item_Fire(context, x, y, gameArea);
            itemNub++;itemID++;
        }
        else if(choice === 2){
            items[itemID] =  Item_speed(context, x, y, gameArea);
            itemNub++;itemID++;
        }
        else if(choice===3)
        {
            items[itemID] =  Item_attack(context, x, y,gameArea);
            itemNub++;itemID++;
        }
        else if(choice===4)
        {
            items[itemID] =  Item_Fan(context, x, y, gameArea);
            itemNub++;itemID++;
        }
        else if(choice === 5){
            items[itemID] =  Item_ice(context, x, y, gameArea);
            itemNub++;itemID++;
        }


        // else{
        //     items[itemID] = Mob_Slime(context, 700+Math.random()*150, 260+Math.random()*150, gameArea);
        //     items[itemID] = Mob_Shinigami(context, 700+Math.random()*150, 260+Math.random()*150, gameArea);
        //     itemNub++;itemID++;
        // }
}

    return {start, setPlayerAction, initPlayerPosition, setPlayerAttr, spawnItem}
}();