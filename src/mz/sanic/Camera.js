export default class Camera {
    /** @type{Phaser.Scene} */ camera = null

    /**
     * Builds a Camera instance
     * @param {Phaser.Scene} scene Game scene
     */
    constructor(scene) {
        this.scene = scene
    }

    init({playerSprite , offsetY}) {
        /* Con esta funcion podemos establecer los limites de la camara */
        //this.scene.cameras.main.setBounds(0, 0, 800, 600);
        // la camara principal sigue al jugador
        this.scene.cameras.main.startFollow(playerSprite, false, 0.9, 0.9, 0, offsetY)
        this.scene.cameras.main.setZoom(1)
    }
}