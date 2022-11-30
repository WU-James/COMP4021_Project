const Character_Swordsman=function(ctx,x,y,gameArea){
    const sequences={
        idleRight:{x:0, y:18, width:48,height:25,count:6,timing:400,loop:true},
        moveToRight:{x:0, y:65, width:48,height:25,count:6,timing:60,loop:true},
        attackRight:{x:0,y:110,width:48,height:30,count:4,timing:60,loop:true},
        idleLeft:{x:288, y:18, width:48,height:25,count:6,timing:400,loop:true},
        moveToLeft:{x:288, y:65, width:48,height:25,count:6,timing:60,loop:true},
        attackLeft:{x:384,y:110,width:48,height:30,count:4,timing:60,loop:true},
        dieLeft:{x:433,y:200,width:48,height:40,count:4,timing:200,loop:false},
        dieRight:{x:0,y:200,width:48,height:40,count:4,timing:200,loop:false},
        damageLeft:{x:433,y:200,width:48,height:40,count:2,timing:600,loop:false},
        damageRight:{x:0,y:200,width:48,height:40,count:2,timing:600,loop:false},
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleRight)
        .setScale(2)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("img/char_swordsman.png")

    let direction=0;
    let name="Swordsman"
    let life=3;
    let horizontal_direction=3;
    let speed=140;
    let power=0;

    let points=0;
    // - `0` - not moving - `1` - moving to the left - `2` - moving up
    // - `3` - moving to the right - `4` - moving down
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

    const Die = function() {
        if(horizontal_direction===1)
        {
            sprite.setSequence(sequences.dieLeft);
        }
        else if(horizontal_direction===3)
        {
            sprite.setSequence(sequences.dieRight);
        }
    };

    const Damage = function() {
        if(horizontal_direction===1)
        {
            sprite.setSequence(sequences.damageLeft);
        }
        else if(horizontal_direction===3)
        {
            sprite.setSequence(sequences.damageRight);
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

    /* life */
    const increaseLife=function(){
        life=life+1;
        Socket.playerAttr(life, speed, power);

    }
    const decreaseLife=function(){
        if(life>0) {
            life = life - 1;
        }

        Socket.playerAttr(life, speed, power);

    }
    /* speed */
    const increaseSpeed=function(){
        speed=speed+20;

        Socket.playerAttr(life, speed, power);

    }
    const decreaseSpeed=function(){
        if(speed>80) {
            speed = speed - 10;
        }
        if(life>0) {
            life = life - 1;
        }
        Socket.playerAttr(life, speed, power);
    };
    /* power */
    const increasePower=function(){
        speed=speed+10;
        life=life+1;
        Socket.playerAttr(life, speed, power);
    };
    const decreasePower=function() {
        life=life-1;
        speed=speed-10;
        Socket.playerAttr(life, speed, power);

    };
    /* points */
    const increasePoints=function(){
        points=points+1;
        GameHeader.setScore(points);
        Socket.anotherScore(points);
    }
    const checkLife=function(){
        if(life<=0)
        {
            return true;
        }
        else{
            return false;
        }

    }

    const setAttr=function(l, s, p){
        life = l;
        speed = s;
        power = p;
    }
    const increaseHighPoints=function(){
        points=points+5;
    }

    const getPoints = function(){
        return points;
    }

    return {
        stop: stop,
        getBoundingBox: sprite.getBoundingBox,
        getAttackingBoxSword: sprite.getAttackingBoxSword,
        getAttackingBox:sprite.getAttackingBox,
        getABox:sprite.getABox,

        draw: sprite.draw,
        update: update,
        move:move,
        attack:attack,
        attackdone:attackdone,
        increaseLife:increaseLife,
        decreaseLife:decreaseLife,
        increaseSpeed:increaseSpeed,
        decreaseSpeed:decreaseSpeed,
        increasePower:increasePower,
        decreasePower:decreasePower,
        increasePoints:increasePoints,
        name:name,
        Die:Die,
        Damage:Damage,
        checkLife:checkLife,
        setAttr:setAttr,
        increaseHighPoints:increaseHighPoints,
        getPoints: getPoints
    };
};