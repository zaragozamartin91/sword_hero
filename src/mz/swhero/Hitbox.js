// @ts-check

export default class Hitbox {
    /** @type{boolean} indica si el hitbox esta activo */ enabled = false

    /**
     * Construye un hitbox 
     * @param {Phaser.Scene} scene Escena del juego
     */
    constructor(scene) {
        this.scene = scene
    }

    /**
     * Inicializa el hitbox.
     * @param {{x:number, y:number, w:number, h:number}} PositionAndDimensions Posicion y dimensiones del hitbox.
     */
    init({ x, y, w, h }) {
        const scene = this.scene
        const rectangle = scene.add.rectangle(x, y, w, h, 0xABCDEF, 0)
        this.rectangle = scene.physics.add.existing(rectangle, false)
        // @ts-ignore
        this.rectangle.body.setAllowGravity(false)
        return this
    }

    get sprite() { return this.rectangle }

    get body() { return this.sprite.body }

    /**
     * Establece la posicion.
     * @param {Number} x posicion x.
     * @param {Number} y posicion y.
     */
    setPosition(x, y) { this.sprite.setPosition(x, y) }

    /**
     * Desactiva el hitbox.
     */
    disable() {
        // un rectangle no puede desactivarse como otros sprites...
        // por lo cual se lo 'esconde' para deshabilitarlo
        this.setPosition(-100, -100)
        this.enabled = false
    }

    /**
     * Activa el cuerpo del sprite
     * @param {Number} x posicion x
     * @param {Number} y posicion y
     */
    enable(x, y) {
        // un rectangle no puede desactivarse como otros sprites...
        // por lo cual se lo reestablece en la posicion indicada
        this.setPosition(x, y)
        this.enabled = true
    }
}

