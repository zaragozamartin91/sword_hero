export default class Camera {
    /** @type{Phaser.Scene} Game scene*/                            scene = null
    /** @type{Phaser.GameObjects.GameObject} player sprite */       playerSprite = null
    /** @type{Phaser.GameObjects.GameObject} camera's focus point*/ focusPoint = null
    /** @type{boolean} follow player horizontally */                followHorizontal = false
    /** @type{boolean} follow player vertically */                  followVertical = false

    /**
     * Builds a Camera instance
     * @param {Phaser.Scene} scene Game scene
     */
    constructor(scene) {
        this.scene = scene
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
    init({playerSprite , x , y , followHorizontal , followVertical}) {
        /* Con esta funcion podemos establecer los limites de la camara */
        //this.scene.cameras.main.setBounds(0, 0, 800, 600);
        // la camara principal sigue al jugador
        this.playerSprite = playerSprite
        const focusPoint = this.scene.add.rectangle(x, y, 10, 10, 0xABCDEF, 0)
        this.scene.cameras.main.startFollow(focusPoint, false, 0.9, 0.9)
        
        this.scene.cameras.main.setZoom(1)
        this.focusPoint = focusPoint
        this.followHorizontal = followHorizontal
        this.followVertical = followVertical

        return this
    }

    update() {
        this.focusPoint.setPosition(
            this.followHorizontal ? this.playerSprite.x : this.focusPoint.x, 
            this.followVertical ? this.playerSprite.y : this.focusPoint.y
        )
    }
}