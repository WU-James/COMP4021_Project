const Mob_Slime=function(ctx,x,y,gameArea){
    const sequences={
        idleRight:{x:0, y:0, width:32,height:32,count:4,timing:300,loop:true},
        idleLeft:{x:321, y:0, width:32,height:32,count:4,timing:300,loop:true},
        moveToRight:{x:0, y:33, width:32,height:32,count:6,timing:60,loop:true},
        moveToLeft:{x:257, y:33, width:32,height:32,count:6,timing:60,loop:true},
        attackRight:{x:0,y:97,width:32,height:32,count:3,timing:80,loop:true},
        attackLeft:{x:353,y:97,width:32,height:32,count:3,timing:80,loop:true},
        dieLeft:{x:289,y:129,width:32,height:32,count:5,timing:100,loop:false},
        dieRight:{x:0,y:129,width:32,height:32,count:5,timing:100,loop:false},
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleLeft)
        .setScale(2)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("img/mob_slime.png")

    let direction = 0;
    let horizontal_direction=3;
    let speed=50;
    let life=3;

    // - `0` - not moving  - `1` - moving to the left
    // - `2` - moving up - `3` - moving to the right - `4` - moving down

    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir !== direction) {
            if(dir===1) {
                horizontal_direction=dir;
                sprite.setSequence(sequences.moveToLeft);
            }
            else if(dir===2){
                if(horizontal_direction===1)
                {
                    sprite.setSequence(sequences.moveToLeft);
                }
                else if(horizontal_direction===3){
                    sprite.setSequence(sequences.moveToRight);
                }
            }
            else if(dir===3)
            {
                horizontal_direction=dir;
                sprite.setSequence(sequences.moveToRight);
            }
            else if(dir===4)
            {
                if(horizontal_direction===1)
                {
                    sprite.setSequence(sequences.moveToLeft);
                }
                else if(horizontal_direction===3)
                {
                    sprite.setSequence(sequences.moveToRight);
                }
            }
        }
        direction = dir;
    };

    const stop = function(dir) {
        if (direction === dir) {
            switch (dir) {
                case 1:{sprite.setSequence(sequences.idleLeft);break;}
                case 2:
                {
                    if(horizontal_direction===1){
                        sprite.setSequence(sequences.idleLeft);
                    }
                    else if(horizontal_direction===3){
                        sprite.setSequence(sequences.moveToRight);
                    }
                    break;
                }
                case 3: sprite.setSequence(sequences.idleRight); break;
                case 4: {
                    if(horizontal_direction===1)
                    {
                        sprite.setSequence(sequences.idleLeft);
                    }
                    else if(horizontal_direction===3)
                    {
                        sprite.setSequence(sequences.idleRight);
                    }
                    break;}
            }
            direction = 0;
        }
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
        getX:sprite.getX,
        getY:sprite.getY,
        setXY:sprite.setXY,
        life:life,
        decreaseLife:decreaseLife,
        //speedUp: speedUp,
        //slowDown: slowDown,
        //attack:attack,
        //attackdone:attackdone,
    };
};