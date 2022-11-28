


const Heart=function(ctx,x,y,gameArea){
    const sequences={
        one:  { x: 0, y:16, width: 16, height: 16, count: 8, timing: 200, loop: true },



    };

    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.one)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("object_sprites.png");

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
}