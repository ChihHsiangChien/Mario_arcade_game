namespace SpriteKind {
    export const FLOWER = SpriteKind.create()
}
// 按上鍵跳躍
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (控制權 != "玩家") {
        return
    }
    if (小方.isHittingTile(CollisionDirection.Bottom)) {
        小方.vy = -200
        jumping = true
    }
})
// 產生蘑菇
function 產生蘑菇 (tile: tiles.Location) {
    mushroom = sprites.create(img`
        . . . . 4 4 4 4 4 4 4 . . . . . 
        . . 4 4 4 4 4 4 4 4 4 4 4 . . . 
        . 4 4 4 4 4 4 4 4 4 4 4 4 . . . 
        . 4 4 4 4 4 2 2 4 4 4 4 4 4 4 . 
        4 4 4 4 4 2 2 2 4 4 4 4 4 4 4 4 
        4 2 2 4 4 2 2 2 2 4 4 4 2 2 4 4 
        4 2 2 4 4 2 2 2 2 2 4 4 2 2 4 4 
        4 2 2 4 4 2 2 2 2 4 4 4 2 2 4 4 
        4 2 2 4 4 2 2 2 2 4 4 4 2 2 4 4 
        4 2 2 4 4 4 4 4 4 4 4 2 2 2 4 4 
        4 2 2 4 4 4 4 4 4 4 4 2 2 4 4 4 
        4 4 2 4 4 4 1 1 1 1 4 4 4 4 4 4 
        4 4 4 4 4 1 1 1 1 1 1 1 4 4 4 . 
        . 4 4 4 1 1 1 1 1 1 1 1 1 . . . 
        . . . 1 1 1 1 1 1 1 1 1 1 . . . 
        . . . . 1 1 1 1 1 1 1 1 . . . . 
        `, SpriteKind.Food)
    tiles.placeOnTile(mushroom, tile)
    mushroom.y -= 20
mushroom.ay = 600
    if (小方方向 == "left") {
        mushroom.vx = -100
    } else {
        mushroom.vx = 100
    }
}
// 遊戲初始化
function 初始化遊戲 () {
    火球冷卻時間 = 500
    info.setLife(3)
    小方方向 = "right"
    小方狀態 = "small"
    正常速度 = 150
    加速速度 = 200
    控制權 = "玩家"
    行為狀態 = "靜止"
    scene.setBackgroundImage(assets.image`background`)
    tiles.setCurrentTilemap(tilemap`layer1`)
    設定牆()
    設定圖像()
    小方 = sprites.create(smallImage, SpriteKind.Player)
    tiles.placeOnTile(小方, tiles.getTileLocation(0, 12))
    scene.cameraFollowSprite(小方)
    小方.ay = 500
    for (let index = 0; index < 0; index++) {
        產生敵人(tiles.getTileLocation(randint(5, 15), 8))
    }
}
// 產生火球花
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
// 碰到旗竿時切換狀態
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile`, function (sprite, location) {
    if (控制權 == "系統") {
        return
    }
    控制權 = "系統"
    行為狀態 = "滑落旗竿"
    controller.moveSprite(小方, 0, 0)
    tiles.placeOnTile(小方, location)
    小方.vx = 0
    小方.vy = 50
})
// 產生敵人
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
    敵人.vx = 40 * (randint(0, 1) * 2 - 1)
}
// 按A發射火球
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (控制權 != "玩家") {
        return
    }
    發射火球()
})
// 吃到花
function 吃到花 () {
    if (小方狀態 == "small") {
        小方狀態 = "big"
        變大鴨()
    } else if (小方狀態 == "big") {
        小方狀態 = "fire"
        變火球鴨()
    }
}
// 吃到蘑菇
function 吃到蘑菇 () {
    if (小方狀態 == "small") {
        小方狀態 = "big"
        變大鴨()
    }
}
// 更新靜止圖像
function 更新靜止圖像 () {

        if (小方狀態 == "small") {
            小方.setImage(smallImage)
        } else if (小方狀態 == "big") {
            小方.setImage(bigImage)
        } else {
            小方.setImage(fireImage)
        }

}
// 火球碰到敵人
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
// 設定牆壁
function 設定牆 () {
    for (let 磚塊 of tiles.getTilesByType(sprites.builtin.brick)) {
        tiles.setWallAt(磚塊, true)
    }
}
// 變大鴨
function 變大鴨 () {
    小方.setImage(bigImage)
    小方.y = 小方.y - 8
}
// 長按跳更高
controller.up.onEvent(ControllerButtonEvent.Released, function () {
    if (jumping && 小方.vy < -50) {
        小方.vy = -60
    }
    jumping = false
})
// 變火球鴨
function 變火球鴨 () {
    小方.setImage(fireImage)
}
// 發射火球
function 發射火球 () {
    if (小方狀態 != "fire") {
        return
    }
    if (game.runtime() - 火球上次時間 < 火球冷卻時間) {
        return
    }
    火球上次時間 = game.runtime()
    fireball = sprites.create(assets.image`FIREBALL`, SpriteKind.Projectile)
    fireball.setPosition(小方.x, 小方.y)
    fireball.ay = 500
    if (小方方向 == "right") {
        fireball.vx = 200
    } else {
        fireball.vx = -200
        fireball.image.flipX()
    }
    fireball.vy = -100
    fireball.setFlag(SpriteFlag.BounceOnWall, true)
    fireball.setFlag(SpriteFlag.AutoDestroy, true)
    fireball.lifespan = 3000
}
// 播放移動動畫
function 播放移動動畫 () {
        if (小方狀態 == "small") {
            animation.runImageAnimation(
            小方,
            assets.animation`smallAnimation`,
            50,
            true
            )
        } else if (小方狀態 == "big") {
            animation.runImageAnimation(
            小方,
            assets.animation`bigAnimation`,
            200,
            true
            )
        } else {
            animation.runImageAnimation(
            小方,
            assets.animation`fireAnimation`,
            200,
            true
            )
        }    

}
// 玩家碰到蘑菇事件
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy(effects.disintegrate, 200)
    music.powerUp.play()
    吃到蘑菇()
    info.changeScoreBy(1)
})
// 設定圖像
function 設定圖像 () {
    smallImage = assets.image`smallImage`    
    bigImage = assets.image`bigImage`
    fireImage = assets.image`fireImage`
}
// 變小方
function 變小方 () {
    小方.setImage(smallImage)
    
}
// 玩家碰到敵人
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (player2, enemy) {
    if (enemy.y - player2.y >= 5) {
        enemy.destroy(effects.spray, 200)
        music.baDing.play()
        info.changeScoreBy(1)
        player2.vy = -100
    } else {
        if (無敵中) {
            return
        }
        無敵時間開始 = game.runtime()
        if (小方狀態 != "small") {
            小方狀態 = "small"
            變小方()
            music.wawawawaa.play()
        } else {
            scene.cameraShake(4, 200)
            music.zapped.play()
            info.changeLifeBy(-1)
        }
        無敵中 = true
    }
})
let 正在移動 = false
let speed = 0
let tile: tiles.Location = null
let 無敵時間開始 = 0
let 無敵中 = false
let fireball: Sprite = null
let 火球上次時間 = 0
let smallImage: Image = null
let fireImage: Image = null
let bigImage: Image = null
let 敵人: Sprite = null

let 行為狀態 = ""
let 加速速度 = 0
let 正常速度 = 0
let 小方狀態 = ""
let 火球冷卻時間 = 0
let 小方方向 = ""
let jumping = false
let 小方: Sprite = null
let 控制權 = ""
let mushroom: Sprite = null
let flower: Sprite = null
// 初始化遊戲
初始化遊戲()
// 往上撞
game.onUpdate(function () {
    // 小方往上跳
    if (controller.up.isPressed()) {
        // 產生
        tile = tiles.getTileLocation(小方.tilemapLocation().column, 小方.tilemapLocation().row - 1)
        if (tiles.tileAtLocationEquals(tile, sprites.dungeon.collectibleRedCrystal)) {
            小方.vy = -50
            tiles.setTileAt(tile, sprites.dungeon.floorLight2)
            tiles.setWallAt(tile, true)
            music.baDing.play()
            產生蘑菇(tile)
        } else if (tiles.tileAtLocationEquals(tile, sprites.dungeon.collectibleBlueCrystal)) {
            小方.vy = -50
            tiles.setTileAt(tile, sprites.dungeon.floorLight2)
            tiles.setWallAt(tile, true)
            music.baDing.play()
            產生火球花(tile)
        } else if (tiles.tileAtLocationEquals(tile, sprites.builtin.brick)) {
            小方.vy = -50
            tiles.setWallAt(tile, false)
            tiles.setTileAt(tile, assets.tile`transparency16`)
            music.baDing.play()
        }
    }
})
game.onUpdate(function () {
    if (行為狀態 == "滑落旗竿" && 小方.isHittingTile(CollisionDirection.Bottom)) {
        game.gameOver(true)
    }
})
// 主要控制邏輯
game.onUpdate(function () {
    if (控制權 == "玩家") {
        // 玩家控制
        speed = 正常速度
        if (controller.B.isPressed()) {
            speed = 加速速度
        }
        controller.moveSprite(小方, speed, 0)
        // 方向控制
        if (controller.left.isPressed()) {
            小方方向 = "left"
        } else if (controller.right.isPressed()) {
            小方方向 = "right"
        }
        // 動畫控制
        if (controller.left.isPressed() || controller.right.isPressed()) {
            // 更新靜止圖像()
            if (!(正在移動)) {
                正在移動 = true
                播放移動動畫()
            }
        } else {
            if (正在移動) {
                animation.stopAnimation(animation.AnimationTypes.All, 小方)
                正在移動 = false
                更新靜止圖像()
            }
        }
    } else if (控制權 == "系統") {
        // 系統控制
        if (行為狀態 == "滑落旗桿") {
            if (!(小方.isHittingTile(CollisionDirection.Bottom))) {
                小方.vx = 0
                小方.vy = 50
            } else {
                小方.vy = 0
                行為狀態 = "遊戲結束"
            }
        } else if (行為狀態 == "遊戲結束") {
            game.over(true, effects.confetti)
        }
    }
})
// 持續檢查是否要解除無敵
game.onUpdate(function () {
    if (無敵中 && game.runtime() - 無敵時間開始 > 1000) {
        無敵中 = false
    }
})
// 火球反彈邏輯
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Projectile)) {
        if (value.isHittingTile(CollisionDirection.Bottom)) {
            value.vy = value.vy * 0.7
        }
    }
})
// 蘑菇遇牆反向
game.onUpdate(function () {
    for (let mushroom2 of sprites.allOfKind(SpriteKind.Food)) {
        if (mushroom2.isHittingTile(CollisionDirection.Right)) {
            mushroom2.vx = -100
        }
        if (mushroom2.isHittingTile(CollisionDirection.Left)) {
            mushroom2.vx = 100
        }
    }
})
// 敵人遇牆反向
game.onUpdate(function () {
    for (let 敵人2 of sprites.allOfKind(SpriteKind.Enemy)) {
        if (敵人2.isHittingTile(CollisionDirection.Right)) {
            敵人2.vx = -40
        }
        if (敵人2.isHittingTile(CollisionDirection.Left)) {
            敵人2.vx = 40
        }
    }
})
forever(function () {
    console.log(小方.vy)
})
