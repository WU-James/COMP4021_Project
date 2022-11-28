const Mob_Sprite=function(ctx, x, y, gameArea){
    const sequences={
        idle:{x:0, y:0, width:50,height:42,count:4,timing:300,loop:true},
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idle)
        .setScale(2)
        .setShadowScale({ x: 0.18, y: 0.05 })
        .useSheet("img/mob_sprite.png")

    let direction = 0;
    let horizontal_direction=3;
    let speed=20;
    let life=3;
    // - `0` - not moving  - `1` - moving to the left
    // - `2` - moving up - `3` - moving to the right - `4` - moving down

    const move = function(dir) {
        sprite.setSequence(sequences.idle);
        direction = dir;
    };

    const stop = function(dir) {
        sprite.setSequence(sequences.idle);
        direction = dir;
    };
    /*
        const attack=function(){
            if(horizontal_direction===1) {
                sprite.setSequence(sequences.attackLeft);
            }
            else if(horizontal_direction===3)
            {
                sprite.setSequence(sequences.attackRight);
            }
        }
        const attackdone=function(){
            if(horizontal_direction===1){
                sprite.setSequence(sequences.idleLeft)
            }
            else if(horizontal_direction===3) {
                sprite.setSequence(sequences.idleRight);
            }
        }

        const speedUp = function() {
            speed = 250;
        };

        const slowDown = function() {
            speed = 150;
        };
    */
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
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        move:move,
        getX:sprite.getX,
        getY:sprite.getY,
        life:life
        //speedUp: speedUp,
        //slowDown: slowDown,
        //attack:attack,
        //attackdone:attackdone,

    };


};