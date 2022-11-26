const Character_Swordsman=function(ctx,x,y,gameArea){
    const sequences={
        idleRight:{x:0, y:18, width:48,height:25,count:6,timing:400,loop:true},
        moveToRight:{x:0, y:65, width:48,height:25,count:6,timing:200,loop:true},
        attackRight:{x:0,y:110,width:48,height:30,count:4,timing:60,loop:true},
        idleLeft:{x:288, y:18, width:48,height:25,count:6,timing:400,loop:true},
        moveToLeft:{x:288, y:65, width:48,height:25,count:6,timing:200,loop:true},
        attackLeft:{x:384,y:110,width:48,height:30,count:4,timing:60,loop:true},
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleRight)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.20 })
        .useSheet("img/Char_Swordsman.png")

    let direction=0;
    let horizontal_direction=3;
    let speed=150;
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    const move = function(dir) {
        if (dir >= 1 && dir <= 4 && dir !== direction) {
              if(dir===1) {
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
            if(dir===1){
                horizontal_direction=dir;
            }
            else if(dir===3)
            {
                horizontal_direction=dir;
            }
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