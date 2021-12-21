// @ts-check

export default class Camera {
    /** @type{Phaser.Scene} Game scene*/                            scene = null
    /** @type{Phaser.GameObjects.GameObject} player sprite */       playerSprite = null
    /** @type{Phaser.GameObjects.Rectangle} camera's focus point*/  focusPoint = null
    /** @type{boolean} follow player horizontally */                followHorizontal = false
    /** @type{boolean} follow player vertically */                  followVertical = false

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

    update() {
        this.focusPoint.setPosition(
            // @ts-ignore
            this.followHorizontal ? this.playerSprite.x : this.focusPoint.x,
            // @ts-ignore
            this.followVertical ? this.playerSprite.y : this.focusPoint.y
        )
    }

    fadeOut(duration = 1000, colors = { r: 0, g: 0, b: 0 }) {
        const { r, g, b } = colors
        this.mainCamera.fadeOut(duration, r, g, b)
    }

    fadeIn(duration = 1000, colors = { r: 0, g: 0, b: 0 }) {
        const { r, g, b } = colors
        this.mainCamera.fadeIn(duration, r, g, b)
    }
}