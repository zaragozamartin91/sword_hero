// @ts-check

// temp vars to avoid using extra memory
const TEMP = { posX: 0, posY: 0 }

export default class Camera {
    /** @type{Phaser.Scene} Game scene*/                            scene = null
    /** @type{Phaser.GameObjects.GameObject} player sprite */       playerSprite = null
    /** @type{Phaser.GameObjects.Rectangle} camera's focus point*/  focusPoint = null
    /** @type{boolean} follow player horizontally */                followHorizontal = false
    /** @type{boolean} follow player vertically */                  followVertical = false
    /** @type{number} camera limit downward Y axis */               lowerBound = Number.MAX_SAFE_INTEGER

    /**
     * Builds a Camera instance
     * @param {Phaser.Scene} scene Game scene
     */
    constructor(scene) {
        this.scene = scene
    }

    get mainCamera() {
        return this.scene.cameras.main
    }

    /**
     * 
     * @param {{
     * playerSprite: Phaser.GameObjects.GameObject , 
     * x: number ,
     * y: number,
     * followHorizontal:boolean, 
     * followVertical: boolean}} cameraConfig Camera config params 
     */
    init({ playerSprite, x, y, followHorizontal, followVertical }) {
        /* Con esta funcion podemos establecer los limites de la camara */
        //this.scene.cameras.main.setBounds(0, 0, 800, 600);
        // la camara principal sigue al jugador
        this.playerSprite = playerSprite
        const focusPoint = this.scene.add.rectangle(x, y, 10, 10, 0xABCDEF, 0)
        this.mainCamera.startFollow(focusPoint, false, 0.9, 0.9)

        this.mainCamera.setZoom(1)
        this.focusPoint = focusPoint
        this.followHorizontal = followHorizontal
        this.followVertical = followVertical

        return this
    }

    /**
     * @param {number} lowerBound Lower bound value
     */
    withLowerBound(lowerBound) {
        this.lowerBound = lowerBound
        return this
    }

    update() {
        if (this.followHorizontal) {
            // @ts-ignore
            TEMP.posX = this.playerSprite.x
        } else {
            TEMP.posX = this.focusPoint.x
        }

        if (this.followVertical) {
            // @ts-ignore
            TEMP.posY = Math.min(this.playerSprite.y, this.lowerBound)
        } else {
            TEMP.posY = this.focusPoint.y
        }

        this.focusPoint.setPosition(TEMP.posX, TEMP.posY)
    }

    fadeOut(duration = 1000, colors = { r: 0, g: 0, b: 0 }) {
        const { r, g, b } = colors
        this.mainCamera.fadeOut(duration, r, g, b)
    }

    /**
     * Fades out camera and triggers callback
     * @param {() => void} callback Function to call after fade out
     */
    fadeOutAndThen(duration = 1000, colors = { r: 0, g: 0, b: 0 }, callback) {
        const { r, g, b } = colors
        this.mainCamera.fadeOut(duration, r, g, b)
        this.scene.time.delayedCall(duration, () => callback())
    }

    fadeIn(duration = 1000, colors = { r: 0, g: 0, b: 0 }) {
        const { r, g, b } = colors
        this.mainCamera.fadeIn(duration, r, g, b)
    }
}