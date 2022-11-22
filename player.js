const Player1=function(ctx,x,y,gameArea){
    const sequences={
        idleLeft:{x:0, y:18, width:48,height:25,count:6,timing:500,loop:true},
        moveTo:{x:0, y:65, width:48,height:25,count:6,timing:300,loop:true},
        attack:{x:0,y:110,width:48,height:30,count:3,timing:50,loop:true}
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleLeft)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.20 })
        .useSheet("playerleft.png")

    let direction=0;
    let previousDirection=0;
    let speed=150;
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir != direction) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveTo); break;
                case 2: sprite.setSequence(sequences.moveTo); break;
                case 3: {sprite.setSequence(sequences.moveTo); break;}
                case 4: sprite.setSequence(sequences.moveTo); break;
            }
            direction = dir;
        }
    };
    const stop = function(dir) {
        if (direction == dir) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.idleLeft); break;
                case 2: sprite.setSequence(sequences.idleLeft); break;
                case 3: sprite.setSequence(sequences.idleLeft); break;
                case 4: sprite.setSequence(sequences.idleLeft); break;
            }
            direction = 0;
        }
    };

    const attack=function(){
        sprite.setSequence(sequences.attack);
    }
    const attackdone=function(){
        sprite.setSequence(sequences.idleLeft);
    }


    const speedUp = function() {
        speed = 250;
    };

    const slowDown = function() {
        speed = 150;
    };
    const update = function(time) {
        /* Update the player if the player is moving */
        if (direction !== 0) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: y -= speed / 60; break;
                case 3: x += speed / 60; break;
                case 4: y += speed / 60; break;
            }

            /* Set the new position if it is within the game area */
            if (gameArea.isPointInBox(x, y))
                sprite.setXY(x, y);
        }

        /* Update the sprite object */
        sprite.update(time);
    };

    return {

        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        move:move,
        attack:attack,
        attackdone:attackdone,

    };


};