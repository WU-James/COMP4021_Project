const Item_Chest=function(ctx, x, y, gameArea){
    const sequences={
        one:  { x: 0, y:0, width: 16, height: 16, count: 4, timing: 200, loop: true }
    };
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(sequences.one)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("img/item_chest.png");

    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update
    };
}