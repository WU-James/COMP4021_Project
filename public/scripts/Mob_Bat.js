const Mob_Bat=function(ctx,x,y,gameArea){
    const sequences={
        idleLeft:{x:0, y:0, width:96,height:52,count:4,timing:80,loop:true},
        idleRight:{x:0, y:161, width:96,height:52,count:4,timing:80,loop:true},
        dieLeft:{x:0, y:81, width:96,height:52,count:9,timing:90,loop:false},
        dieRight:{x:0, y:241, width:96,height:52,count:9,timing:90,loop:false},
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleLeft)
        .setScale(2)
        .setShadowScale({ x: 0.13, y: 0.05 })
        .useSheet("img/mob_bat.png")

    let direction = 0;
    let horizontal_direction=3;
    let speed=30;
    let life=1;
    let name="Bat";


    // - `0` - not moving  - `1` - moving to the left
    // - `2` - moving up - `3` - moving to the right - `4` - moving down

    const move = function(dir) {
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

    const update = function(time) {
        /* Update when moving */
        if (direction !== 0) {
            let { x, y } = sprite.getXY();

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

    const hide=function(){
        this.setXY(2000, 30);
    };
    const decreaseLife=function(){
        life=life-1;
    }

    return {
        stop: stop,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update,
        move:move,
        hide:hide,
        getX:sprite.getX,
        getY:sprite.getY,
        setXY:sprite.setXY,
        life:life,
        decreaseLife:decreaseLife,
        name:name
    };
};