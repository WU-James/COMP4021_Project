const Character_Berserker =function(ctx,x,y,gameArea){
    const sequences={
        idleRight:{x:0, y:6, width:32.18661,height:25,count:5,timing:200,loop:true},
        moveToRight:{x:0, y:38, width:32.18661,height:25,count:8,timing:60,loop:true},
        attackRight:{x:0,y:67,width:32.18661,height:27,count:7,timing:35,loop:false},
        idleLeft:{x:2, y:163, width:31.05,height:25,count:5,timing:200,loop:true},
        moveToLeft:{x:0, y:194, width:31.7,height:25,count:8,timing:60,loop:true},
        attackLeft:{x:0,y:225,width:32.18661,height:27,count:7,timing:35,loop:false},
        dieRight:{x:0,y:133,width:32.18661,height:27,count:7,timing:200,loop:false},
        dieLeft:{x:0,y:290,width:31.7,height:27,count:7,timing:200,loop:false},
        damageRight:{x:0,y:133,width:32.18661,height:27,count:3,timing:200,loop:false},
        damageLeft:{x:0,y:290,width:31.7,height:27,count:3,timing:200,loop:false},
    };

    const sprite=Sprite(ctx,x,y);
    sprite.setSequence(sequences.idleRight)
        .setScale(2.3)
        .setShadowScale({ x: 0.5, y: 0.18 })
        .useSheet("img/char_berserker.png")

    let direction=0;
    let name="Berserker";
    let life=4;
    let horizontal_direction=3;
    let speed=130;
    let power=2;
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
    };
    const decreaseLife=function(){
        if(life>0) {
            life = life - 1;
        }
        Socket.playerAttr(life, speed, power);
    };
    /* speed */
    const increaseSpeed=function(){
        speed = speed + 20;
        Socket.playerAttr(life, speed, power);
    };
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
    const increasePower=function() {
        power = power + 1;
        Socket.playerAttr(life, speed, power);
    };
    const decreasePower=function() {
        if(power>1) {
            power = power - 1;
        }
        if(life>0) {
            life = life - 1;
        }
        Socket.playerAttr(life, speed, power);
    };
    /* points */
    const increasePoints=function(){
        points=points+1;
        console.log(points);
        GameHeader.setScore(points);
        Socket.anotherScore(points);
    }
    const checkLife=function(){
        if(life<=0){
            return true;
        }
        return false;
    }

    const setAttr=function(l, s, p){
        life = l;
        speed = s;
        power = p;
    }

    return {
        stop: stop,
        update: update,
        move:move,
        attack:attack,
        attackdone:attackdone,
        getBoundingBox: sprite.getBoundingBox,
        getAttackingBox:sprite.getAttackingBox,
        getAttackingBoxSword:sprite.getAttackingBoxSword,
        draw: sprite.draw,
        name:name,
        increaseLife:increaseLife,
        decreaseLife:decreaseLife,
        increaseSpeed:increaseSpeed,
        decreaseSpeed:decreaseSpeed,
        increasePower:increasePower,
        decreasePower:decreasePower,
        increasePoints:increasePoints,
        Damage:Damage,
        Die:Die,
        checkLife:checkLife,
        setAttr:setAttr
    };
};