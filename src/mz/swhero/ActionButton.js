// @ts-check

class ActionButton {
    /**
     * 
     * @param {Phaser.Scene} scene Escena de juego
     * @param {string} key clave del boton
     */
    constructor(scene, key) {
        this.key = key
        this.scene = scene
    }

    init(x = 0, y = 0) {
        this.sprite = this.scene.add.image(x, y, this.key)
        this.sprite.setInteractive()
        this.sprite.scrollFactorX = 0
        this.sprite.scrollFactorY = 0
        this.sprite.setDepth(1)
        return this
    }

    pointerover(callback) {
        this.sprite.on('pointerover', callback)
        return this
    }

    pointerout(callback) {
        this.sprite.on('pointerout', callback)
        return this
    }

    pointerdown(callback) {
        this.sprite.on('pointerdown', callback)
        return this
    }

    pointerup(callback) {
        this.sprite.on('pointerup', callback)
        return this
    }

    get width() {
        return this.sprite.width
    }

    get height() {
        return this.sprite.height
    }

    get displayWidth() {
        return this.sprite.displayWidth
    }

    get displayHeight() {
        return this.sprite.displayHeight
    }

    setPosition({ x, y }) {
        this.sprite.setX(x)
        this.sprite.setY(y)
        return this
    }
}

export default ActionButton