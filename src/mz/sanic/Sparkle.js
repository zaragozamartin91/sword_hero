import AssetLoader from './AssetLoader';

const ANIM_KEY = 'sparkle_anim';

const ANIM_DURATION_MS = 500;

class Sparkle {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Inicializa el Sparkle en una posicion.
     * @param {Number} x Posicion x.
     * @param {Number} y Posicion y.
     */
    init(x = 0, y = 0) {
        const scene = this.scene;
        this.p_sprite = scene.physics.add.staticSprite(x, y, 'sparkle', 'sonic2_sparkles_01.png');

        AssetLoader.loadFor(scene, 'sparkle', () => {
            const frames = scene.anims.generateFrameNames('sparkle', {
                start: 1, end: 5, zeroPad: 2, prefix: 'sonic2_sparkles_', suffix: '.png'
            });

            scene.anims.create({ key: ANIM_KEY, frames: frames, duration: ANIM_DURATION_MS });
        });

        this.p_sprite.on('animationcomplete', () => this.disableBody());
    }

    get sprite() { return this.p_sprite; }

    get anims() { return this.sprite.anims; }

    /**
     * Establece la posicion.
     * @param {Number} x posicion x.
     * @param {Number} y posicion y.
     */
    setPosition(x, y) { this.sprite.setPosition(x, y); }


    /**
     * Reproduce la animacion.
     */
    playAnim() { this.sprite.anims.play(ANIM_KEY, true); }

    /**
  * Desactiva un cuerpo de phaser.
  * @param {boolean} disableGameObject Desactiva el game object.
  * @param {boolean} hideGameObject Oculta el game object.
  */
    disableBody(disableGameObject = true, hideGameObject = true) {
        this.sprite.disableBody(disableGameObject, hideGameObject);
    }

    /**
     * Activa el cuerpo del sprite
     * @param {Boolean} reset Resetea el cuerpo del objeto y lo posiciona en (x,y)
     * @param {Number} x posicion x
     * @param {Number} y posicion y
     * @param {Boolean} enableGameObject Activa el objeto
     * @param {Boolean} showGameObject Muestra el objeto
     */
    enableBody(reset, x, y, enableGameObject = true, showGameObject = true) {
        this.sprite.enableBody(reset, x, y, enableGameObject, showGameObject);
    }
}

export default Sparkle;
