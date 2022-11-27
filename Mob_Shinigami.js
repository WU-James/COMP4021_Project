const Mob_Shinigami=function(ctx, x, y, gameArea){
    const sequences={
        idleRight:{x:0, y:0, width:100,height:80,count:4,timing:300,loop:true},
        idleLeft:{x:0, y:301, width:100,height:80,count:4,timing:300,loop:true},

        //attackLeft:{x:0, y:401, width:100,height:80,count:4,timing:150,loop:true},
        //attackLeft:{x:0, y:501, width:100,height:80,count:4,timing:150,loop:true},

        //attackRight:{x:0, y:101, width:100,height:80,count:4,timing:150,loop:true},
        //attackRight:{x:0, y:201, width:100,height:80,count:4,timing:150,loop:true},

    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleLeft)
        .setScale(2.5)
        .setShadowScale({ x: 0.3, y: 0.02 })
        .useSheet("img/mob_shinigami.png")

    let direction = 0;
    let horizontal_direction=3;
    let speed=10;
    // - `0` - not moving  - `1` - moving to the left
    // - `2` - moving up - `3` - moving to the right - `4` - moving down

    const move = function(dir){
        //sprite.setSequence(sequences.idleLeft);
        if (dir >= 1 && dir <= 4 && dir !== direction) {
            if(dir===1) {
                horizontal_direction=dir;
                sprite.setSequence(sequences.idleLeft);
            }
            else if(dir===2){
                if(horizontal_direction===1)
                {
                    sprite.setSequence(sequences.idleLeft);
                }
                else if(horizontal_direction===3){
                    sprite.setSequence(sequences.idleRight);
                }
            }
            else if(dir===3)
            {
                horizontal_direction=dir;
                sprite.setSequence(sequences.idleRight);
            }
            else if(dir===4)
            {
                if(horizontal_direction===1)
                {
                    sprite.setSequence(sequences.idleLeft);
                }
                else if(horizontal_direction===3)
                {
                    sprite.setSequence(sequences.idleRight);
                }
            }
        }
        direction = dir;
    };

    const stop = function(dir) {
        if (direction === dir) {
            switch (dir) {
                case 1: {
                    sprite.setSequence(sequences.idleLeft);
                    break;
                }
                case 2: {
                    if (horizontal_direction === 1) {
                        sprite.setSequence(sequences.idleLeft);
                    } else if (horizontal_direction === 3) {
                        sprite.setSequence(sequences.idleRight);
                    }
                    break;
                }
                case 3:
                    sprite.setSequence(sequences.idleRight);
                    break;
                case 4: {
                    if (horizontal_direction === 1) {
                        sprite.setSequence(sequences.idleLeft);
                    } else if (horizontal_direction === 3) {
                        sprite.setSequence(sequences.idleRight);
                    }
                    break;
                }
            }
            sprite.setSequence(sequences.idleLeft);
            direction = 0;
        }
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
        //speedUp: speedUp,
        //slowDown: slowDown,
        //attack:attack,
        //attackdone:attackdone,

    };
};