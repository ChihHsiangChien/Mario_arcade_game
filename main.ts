namespace SpriteKind {
    export const FLOWER = SpriteKind.create()
}

// 按鈕 up 跳躍事件
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (控制權 !== "玩家") {
        return
    }
    if (小鴨.isHittingTile(CollisionDirection.Bottom)) {
        小鴨.vy = -180
        jumping = true
    }
})
function 產生火球花 (tile: tiles.Location) {
    flower = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . 4 4 4 . . . . . 
        . . . . . . . 4 e e e 4 . . . . 
        . . . . . . . 4 4 4 4 4 . . . . 
        . . . . . . . . 4 4 4 . . . . . 
        . . 4 4 4 . . . . 7 . . . . . . 
        . 4 e e e 4 . . . 7 . . . . . . 
        . 4 4 4 4 4 . . 7 7 . 7 . . . . 
        . . 4 4 4 . . . 7 7 6 6 . . . . 
        . . . 7 . . . . 7 6 6 . . . . . 
        . . . . 7 . . . 7 6 . . . . . . 
        . . 7 7 7 7 . . 7 . . . . . . . 
        . . . 6 6 6 7 . 6 . . . . . . . 
        . . . . . . 6 6 6 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.FLOWER)
    tiles.placeOnTile(flower, tile)
    flower.y -= 20
}
function 產生敵人 (tile: tiles.Location) {
    敵人 = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . c c c c c c . . . . . 
        . . . . c e e e e e e c . . . . 
        . . . c e 1 1 1 1 1 1 f c . . . 
        . . c e f f 1 1 1 1 f f e c . . 
        . . c e 1 f f f 1 f f 1 e c . . 
        . . c e 1 1 1 f 1 f 1 1 e c . . 
        . . c e 1 1 1 1 1 1 1 1 e c . . 
        . . c e e e e e e e e e e c . . 
        . c c e e e e e e e e e e c c . 
        . c 1 1 1 1 1 1 1 1 1 1 1 1 c . 
        . c 1 1 1 1 c c c c 1 1 1 1 c . 
        . c c c c c . . . . c c c c c . 
        . . c c . . . . . . . . c c . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Enemy)
    tiles.placeOnTile(敵人, tile)
    敵人.ay = 500
    敵人.vx = 40
}
// 按A發射火球
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (控制權 !== "玩家") {
        return
    }
    發射火球()
})
function 吃到花 () {
    if (小鴨狀態 == "small") {
        小鴨狀態 = "big"
        變大鴨()
    } else if (小鴨狀態 == "big") {
        小鴨狀態 = "fire"
        變火球鴨()
    }
}
function 更新靜止圖像 () {
    if (控制權 !== "玩家" ) {
        return
    }
    if (小鴨方向 == "left") {
        if (小鴨狀態 == "small") {
            小鴨.setImage(duckImageSmallLeft)
        } else if (小鴨狀態 == "big") {
            小鴨.setImage(duckImageBigLeft)
        } else {
            小鴨.setImage(duckImageFireLeft)
        }
    } else {
        if (小鴨狀態 == "small") {
            小鴨.setImage(duckImageSmallRight)
        } else if (小鴨狀態 == "big") {
            小鴨.setImage(duckImageBigRight)
        } else {
            小鴨.setImage(duckImageFireRight)
        }
    }
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (fireball, enemy) {
    enemy.destroy(effects.fire, 200)
    fireball.destroy()
    info.changeScoreBy(1)
    music.baDing.play()
})
// 玩家碰到花事件
sprites.onOverlap(SpriteKind.Player, SpriteKind.FLOWER, function (player2, flower) {
    flower.destroy(effects.disintegrate, 200)
    music.powerUp.play()
    吃到花()
    info.changeScoreBy(1)
})
function 受傷 () {
    if (小鴨狀態 == "fire") {
        小鴨狀態 = "big"
        變大鴨()
    } else if (小鴨狀態 == "big") {
        小鴨狀態 = "small"
        變小鴨()
    } else {
        game.gameOver(true)
    }
}
function 設定牆 () {
    for (let 磚塊 of tiles.getTilesByType(sprites.builtin.brick)) {
        tiles.setWallAt(磚塊, true)
    }
}
function 變大鴨 () {
    小鴨.setImage(duckImageBigRight)
    小鴨.y = 小鴨.y - 8
}
// 長按跳更高
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    if (jumping && 小鴨.vy < -50) {
        小鴨.vy = -60
    }
    jumping = false
})
function 變火球鴨 () {
    小鴨.setImage(duckImageFireRight)
}
// 毫秒
function 發射火球 () {
    if (小鴨狀態 != "fire") {
        return
    }
    if (game.runtime() - 火球上次時間 < 火球冷卻時間) {
        return
    }
    火球上次時間 = game.runtime()
    fireball = sprites.create(assets.image`FIREBALL`, SpriteKind.Projectile)
    fireball.setPosition(小鴨.x, 小鴨.y)
    fireball.ay = 500
    if (小鴨方向 == "right") {
        fireball.vx = 120
    } else {
        fireball.vx = -120
        fireball.image.flipX()
    }
    fireball.vy = -100
    fireball.setFlag(SpriteFlag.BounceOnWall, true)
    fireball.setFlag(SpriteFlag.AutoDestroy, true)
    fireball.lifespan = 3000
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Player, function (sprite, otherSprite) {
	
})
function 播放移動動畫 () {
    if (小鴨方向 == "right") {
        animation.runImageAnimation(
        小鴨,
        assets.animation`duckRight`,
        200,
        true
        )
    } else {
        animation.runImageAnimation(
        小鴨,
        assets.animation`duckLeft`,
        200,
        true
        )
    }
}
function 產生香菇 (tile: tiles.Location) {
    mushroom = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . c e e e e e c c . . . . 
        . . . e e b b b b b e e . . . . 
        . . e e b b b b b b b e e c . . 
        . e e b b b b b b b b b e e . . 
        e b b b b b b b b b b b b e c c 
        e b b b b b b b b b b b b b e c 
        e b b b b b b b b b b b b b e e 
        e b b b b b b b b b b b b b b e 
        b b b b b e e e e e e b b b c e 
        b b b b e d d d d d e e b b c e 
        b b b b e d d d d d d e b e e e 
        e e e e e d d d d d d e e e . . 
        . . . . e d d d d d d e . . . . 
        . . . . e e e e e e e e e . . . 
        . . . e e e e e e e e e e . . . 
        `, SpriteKind.Food)
    tiles.placeOnTile(mushroom, tile)
    mushroom.y -= 20
mushroom.ay = 600
    if (小鴨.vx >= 0) {
        mushroom.vx = 100
    } else {
        mushroom.vx = -100
    }
}
function 吃到香菇 () {
    if (小鴨狀態 == "small") {
        小鴨狀態 = "big"
        變大鴨()
    }
}
// 玩家碰到香菇事件（變大）
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy(effects.disintegrate, 200)
    music.powerUp.play()
    if (小鴨狀態 == "small") {
        小鴨狀態 = "big"
        變大鴨()
    }
    info.changeScoreBy(1)
})
// 小鴨圖像（小鴨 大鴨 火球鴨）
function 設定圖像 () {
    duckImageSmallRight = img`
        . . . . . . . . . . b 5 b . . . 
        . . . . . . . . . b 5 b . . . . 
        . . . . . . b b b b b b . . . . 
        . . . . . b b 5 5 5 5 5 b . . . 
        . . . . b b 5 d 1 f 5 5 d f . . 
        . . . . b 5 5 1 f f 5 d 4 c . . 
        . . . . b 5 5 d f b d d 4 4 . . 
        . b b b d 5 5 5 5 5 4 4 4 4 4 b 
        b d d d b b d 5 5 4 4 4 4 4 b . 
        b b d 5 5 5 b 5 5 5 5 5 5 b . . 
        c d c 5 5 5 5 d 5 5 5 5 5 5 b . 
        c b d c d 5 5 b 5 5 5 5 5 5 b . 
        . c d d c c b d 5 5 5 5 5 d b . 
        . . c b d d d d d 5 5 5 b b . . 
        . . . c c c c c c c c b b . . . 
        . . . . . . . . . . . . . . . . 
        `
    duckImageSmallLeft = duckImageSmallRight.clone()
    duckImageSmallLeft.flipX()
    duckImageBigRight = img`
        . . . . . . b b b b b b b . . . 
        . . . . . b 5 5 5 5 5 5 5 b . . 
        . . . . b 5 d 1 f 5 5 5 5 5 b . 
        . . . b 5 5 1 f f 5 d d 4 4 b . 
        . . b 5 5 d f b d d d 4 4 4 4 b 
        . b 5 5 5 5 5 4 4 4 4 4 4 4 4 b 
        . b d d d d d 4 4 4 4 4 4 4 4 b 
        b 5 5 5 5 5 5 5 5 5 5 5 5 5 5 b 
        b 5 5 5 5 5 5 5 5 5 5 5 5 5 5 b 
        b 5 5 5 5 5 5 5 5 5 5 5 5 5 5 b 
        b b b b b b b b b b b b b b b b 
        . b b b b b b b b b b b b b b . 
        . . b b b b b b b b b b b b . . 
        . . . b b b b b b b b b b . . . 
        . . . . b b b b b b b b . . . . 
        . . . . . . . . . . . . . . . . 
        `
    duckImageBigLeft = duckImageBigRight.clone()
    duckImageBigLeft.flipX()
    duckImageFireRight = img`
        . . . . 2 2 2 2 2 2 2 2 2 2 2 . 
        . . . 2 2 2 5 5 5 5 5 5 2 2 2 2 
        . . 2 2 2 2 d 1 f 5 5 5 5 5 2 2 
        . 2 2 2 2 5 1 f f 5 d d 4 4 b 2 
        2 2 2 2 5 d f b d d d 4 4 4 4 2 
        2 2 2 5 5 5 5 4 4 4 4 4 4 4 4 2 
        2 2 d d d d d 4 4 4 4 4 4 4 4 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 5 5 5 5 5 5 5 5 5 5 5 5 5 5 2 
        2 b b b b b b b b b b b b b b 2 
        2 2 b b b b b b b b b b b b b 2 
        2 2 2 b b b b b b b b b b b 2 2 
        . 2 2 2 b b b b b b b b b 2 2 2 
        . 2 2 2 2 2 b b b b b b 2 2 2 2 
        . . 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
        `
    duckImageFireLeft = duckImageFireRight.clone()
    duckImageFireLeft.flipX()
}
function 變小鴨 () {
    小鴨.setImage(duckImageSmallRight)
    小鴨.y = 小鴨.y + 8
}
// 玩家碰到敵人事件（死或變小）
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player2, enemy) {
    if (player2.vy > 0) {
        // 從上方踩死敵人
        enemy.destroy(effects.spray, 200)
        music.baDing.play()
        info.changeScoreBy(1)
        player2.vy = -100
    } else {
        // 從側面碰到敵人
        if (小鴨狀態 == "big") {
            // 變小但不死
            小鴨狀態 = "small"
            變小鴨()
            music.wawawawaa.play()
        } else {
            // 直接扣命
            scene.cameraShake(4, 200)
            music.zapped.play()
            info.changeLifeBy(-1)
        }
    }
})
let speed = 0
let 正在移動 = false
let tile: tiles.Location = null
let fireball: Sprite = null
let 火球上次時間 = 0
let duckImageFireRight: Image = null
let duckImageBigRight: Image = null
let duckImageFireLeft: Image = null
let duckImageBigLeft: Image = null
let duckImageSmallLeft: Image = null
let 敵人: Sprite = null
let 自動前進中 = false
let jumping = false
let 到達目標 = false
let duckImageSmallRight: Image = null
let 小鴨: Sprite = null
let 小鴨狀態 = ""
let 小鴨方向 = ""
let 火球冷卻時間 = 0
let flower: Sprite = null
let mushroom: Sprite = null
火球冷卻時間 = 1000
小鴨方向 = "right"
小鴨狀態 = "small"
let 正常速度 = 100
let 加速速度 = 200
scene.setBackgroundImage(assets.image`background`)
// 初始化地圖與角色
tiles.setCurrentTilemap(tilemap`layer1`)
設定牆()
設定圖像()
小鴨 = sprites.create(duckImageSmallRight, SpriteKind.Player)
tiles.placeOnTile(小鴨, tiles.getTileLocation(0, 12))
scene.cameraFollowSprite(小鴨)
小鴨.ay = 500

// 檢查所有火球
game.onUpdate(function () {
    if (sprites.allOfKind(SpriteKind.Projectile).length != 0) {
        for (let value of sprites.allOfKind(SpriteKind.Projectile)) {
            if (value.isHittingTile(CollisionDirection.Bottom)) {
                value.vy = value.vy * 0.7
            }
        }
    }
})
// 香菇與敵人遇牆反向
game.onUpdate(function () {
    if (sprites.allOfKind(SpriteKind.Food).length != 0) {
        for (let mushroom2 of sprites.allOfKind(SpriteKind.Food)) {
            if (mushroom2.isHittingTile(CollisionDirection.Right)) {
                mushroom2.vx = -100
            }
            if (mushroom2.isHittingTile(CollisionDirection.Left)) {
                mushroom2.vx = 100
            }
        }
    }
})
// 撞到寶箱
game.onUpdate(function () {
    if (小鴨.vy < 0) {
        tile = tiles.getTileLocation(小鴨.tilemapLocation().column, 小鴨.tilemapLocation().row - 1)
        if (tiles.tileAtLocationEquals(tile, sprites.dungeon.chestClosed)) {
            小鴨.vy = -50
            tiles.setTileAt(tile, assets.tile`transparency16`)
            music.baDing.play()
            產生香菇(tile)
        } else if (tiles.tileAtLocationEquals(tile, sprites.dungeon.chestOpen)) {
            小鴨.vy = -50
            tiles.setTileAt(tile, sprites.dungeon.floorLight2)
            tiles.setWallAt(tile, true)
            music.baDing.play()
            產生火球花(tile)
        }
    }
})

// 設定所有敵人的撞牆邏輯
game.onUpdate(function () {
    if (sprites.allOfKind(SpriteKind.Enemy).length != 0) {
        for (let 敵人2 of sprites.allOfKind(SpriteKind.Enemy)) {
            if (敵人2.isHittingTile(CollisionDirection.Right)) {
                敵人2.vx = -40
            }
            if (敵人2.isHittingTile(CollisionDirection.Left)) {
                敵人2.vx = 40
            }
        }
    }
})



// 主 update 只保留流程控制邏輯
game.onUpdate(function () {
    if (控制權  !== "玩家") {return}

    if (controller.left.isPressed()) {
        小鴨方向 = "left"
    } else if (controller.right.isPressed()) {
        小鴨方向 = "right"
    }
    if (controller.left.isPressed() || controller.right.isPressed()) {
        //控制每次動畫都播完 而不是每次都從第1 frame
        if (!(正在移動)) {
            正在移動 = true
            播放移動動畫()
        }
    } else {
        animation.stopAnimation(animation.AnimationTypes.All, 小鴨)
        正在移動 = false
        更新靜止圖像()
    }
})

//速度控制
game.onUpdate(function () {

    if (控制權 === "玩家") {
        let speed = 正常速度
        if (controller.B.isPressed()) {
            speed = 加速速度
        }
        controller.moveSprite(小鴨, speed, 0)
    } else {
        // 系統控制時，玩家無法控制角色
        controller.moveSprite(小鴨, 0, 0)
    }
})

// 狀態變數
let 控制權 = "玩家"       // "玩家" / "系統"
let 行為狀態 = "靜止"     // "靜止" / "移動" / "滑落旗桿" / "自動前進"

game.onUpdate(function () {
    if (控制權 === "玩家") {
        // 玩家控制流程
        if (controller.left.isPressed()) {
            小鴨方向 = "left"
            行為狀態 = "移動"
        } else if (controller.right.isPressed()) {
            小鴨方向 = "right"
            行為狀態 = "移動"
        } else {
            行為狀態 = "靜止"
        }

        if (行為狀態 === "移動" && !正在移動) {
            正在移動 = true
            播放移動動畫()
        } else if (行為狀態 === "靜止" && 正在移動) {
            animation.stopAnimation(animation.AnimationTypes.All, 小鴨)
            正在移動 = false
            更新靜止圖像()
        }

        let speed = 正常速度
        if (controller.B.isPressed()) {
            speed = 加速速度
        }
        controller.moveSprite(小鴨, speed, 0)
    } else if (控制權 === "系統") {
        // 系統自動流程
        if (行為狀態 === "滑落旗桿") {
            // 鴨子自動滑落旗桿的邏輯
            if (!小鴨.isHittingTile(CollisionDirection.Bottom)) {
                小鴨.vx = 0
                小鴨.vy = 50 // 往下滑落
            } else {
                小鴨.vy = 0
                行為狀態 = "自動前進"
            }
        } else if (行為狀態 === "自動前進") {
            小鴨.vx = 20
            小鴨.vy = 0
            // 這邊可以加判斷，走到某點改回玩家控制
        }
    }
})

// 碰到旗竿時切換狀態
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile`, function (sprite, location) {
    if (控制權 === "系統") return // 已經系統控制中，跳過

    控制權 = "系統"
    行為狀態 = "滑落旗桿"
    controller.moveSprite(小鴨, 0, 0) // 停止玩家控制
    tiles.placeOnTile(小鴨, location)
    小鴨.vx = 0
    小鴨.vy = 50
})


/*
//碰到旗竿
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile`, function (sprite, location) {
    if (到達目標 == true) {
        return
    }
    到達目標 = true
    // 停止玩家控制
    controller.moveSprite(小鴨, 0, 0)
    tiles.placeOnTile(小鴨, location)
    sprite.vx = 0
    sprite.vy = 50
    自動前進中 = true
})

game.onUpdate(function () {
    if (自動前進中 && 小鴨.isHittingTile(CollisionDirection.Bottom)) {
        小鴨.vy = 0
        小鴨.vx = 20
        // 只做一次
        自動前進中 = false
    }
})
*/