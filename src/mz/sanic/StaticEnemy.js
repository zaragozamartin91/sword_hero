// @ts-check

import AssetLoader from './AssetLoader';

const REPEAT_FOREVER = -1

class StaticEnemy {
    /**
     * Crea un objeto de tipo Enemigo estatico
     * @param {Phaser.Scene} scene Escena del juego
     * @param {{key:string, prefix:string, suffix:string, start:number, end:number, animDurationMs:number, scale?:number}} config Configuracion del enemigo
     */
    constructor(scene, { key, prefix, suffix, start, end, animDurationMs, scale }) {
        this.scene = scene;
        this.key = key;
        this.prefix = prefix;
        this.suffix = suffix || '.png'
        this.start = start === undefined ? 1 : start
        this.end = end
        this.animKey = `${key}_anim`
        this.animDurationMs = animDurationMs || 500
        this.scale = scale || 1
    }

    /**
     * Inicializa el enemigo en una posicion.
     * @param {Number} x Posicion x.
     * @param {Number} y Posicion y.
     * @param {boolean} allowGravity True para habilitar la gravedad en el eje Y, false en caso contrario
     */
    init(x, y, allowGravity = false) {
        const scene = this.scene;
        const startFrame = `${this.prefix}0${this.start}${this.suffix}` // algo como wasp_01.png
        console.log('Loading ', this.key, ' static enemy with startFrame ', startFrame)
        this.p_sprite = scene.physics.add.sprite(x, y, this.key, startFrame)
        this.p_sprite.setScale(this.scale, this.scale)
        this.p_sprite.body.setAllowGravity(allowGravity)

        AssetLoader.loadFor(scene, this.key, () => {
            const frames = scene.anims.generateFrameNames(this.key, {
                start: this.start, end: this.end, zeroPad: 2, prefix: this.prefix, suffix: this.suffix
            })

            scene.anims.create({
                key: this.animKey, frames: frames, duration: this.animDurationMs, repeat: REPEAT_FOREVER
            })
        })

        return this
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
    playAnim() { 
        this.sprite.anims.play(this.animKey, true)
        return this 
    }

    /**
     * Reproduce la animacion.
     */
    pauseAnim(time) {
        this.sprite.anims.pause()
        this.scene.time.delayedCall(time, () => { this.playAnim() })
    }

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

    get x() { return this.sprite.x; }

    get y() { return this.sprite.y; }

    set x(nx) { this.sprite.setX(nx) }

    set bodyX(nx) { this.sprite.body.x = nx }

    set flipX(f) { this.sprite.setFlipX(f) }

    toggleFlipX() { this.flipX = !this.sprite.flipX }

    die() {
        this.disableBody()
    }
}

export default StaticEnemy;
