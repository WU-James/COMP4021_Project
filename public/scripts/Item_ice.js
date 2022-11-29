const Item_ice=function(ctx, x, y){
    const sequences={
        one:  { x: 0, y:0, width: 32, height: 32, count: 7, timing: 200, loop: false },
    };

    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.one)
        .setScale(2)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("img/item_ice.png");

    let birthTime = performance.now();
    let name="ICE";

    // This function gets the age (in millisecond) of the gem.
    // - `now` - The current timestamp
    const getAge = function(now) {
        return now - birthTime;
    };

    // This function randomizes the gem colour and position.
    // - `area` - The area that the gem should be located in.
    const randomize = function(area) {
        /* Randomize the position */
        const {x, y} = area.randomPoint();
        sprite.setXY(x, y);
        birthTime=performance.now()
    };

    const hide=function(){
        this.setXY(2000, 30);
    }

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        randomize:randomize,
        getAge: getAge,
        hide:hide,
        getX:sprite.getX,
        getY:sprite.getY,
        name:name
    };
}