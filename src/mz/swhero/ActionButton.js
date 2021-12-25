// @ts-check

export default class ActionButton {
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

    /**
     * Configures callback for pointerover event
     * @param {Function} callback Callback function
     * @returns {ActionButton} this
     */
    pointerover(callback) {
        this.sprite.on('pointerover', callback)
        return this
    }

    /**
     * Configures callback for pointerout event
     * @param {Function} callback Callback function
     * @returns {ActionButton} this
     */
    pointerout(callback) {
        this.sprite.on('pointerout', callback)
        return this
    }

    /**
     * Configures callback for pointerdown event
     * @param {Function} callback Callback function
     * @returns {ActionButton} this
     */
    pointerdown(callback) {
        this.sprite.on('pointerdown', callback)
        return this
    }

    /**
     * Configures callback for pointerup event
     * @param {Function} callback Callback function
     * @returns {ActionButton} this
     */
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