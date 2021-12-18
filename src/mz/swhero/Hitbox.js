const EMPTY_FN = () => { }

export default class Hitbox {
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
     * Reproduce la animacion.
     */
    playAnim({ completeCb = EMPTY_FN, startCb = EMPTY_FN }) {
        const self = this

        /* Establecemos como duracion la mitad del tiempo dado que la animacion hace un yoyo */
        this.scene.tweens.add({
            targets: self.sprite,

            props: {
                scaleX: 1,
                scaleY: 1,
            },

            ease: 'Power1',
            duration: HALF_SPIN_DURATION_MS,
            yoyo: true,
            onStart: function () { self.enableBody(); startCb(); },
            onComplete: function () { self.disableBody(); completeCb(); },
            onYoyo: function () { },
            onRepeat: function () { },
        });
    }

    /**
     * Desactiva el hitbox.
     */
    disableBody() {
        // un rectangle no puede desactivarse como otros sprites...
        // por lo cual se lo 'esconde' para deshabilitarlo
        this.setPosition(-100, -100)
    }

    /**
     * Activa el cuerpo del sprite
     * @param {Number} x posicion x
     * @param {Number} y posicion y
     */
    enableBody(x, y) {
        // un rectangle no puede desactivarse como otros sprites...
        // por lo cual se lo reestablece en la posicion indicada
        this.setPosition(x, y)
    }

    update() {
        this.sprite.x = this.player.x;
        this.sprite.y = this.player.y;
        this.body.velocity.x = this.player.body.velocity.x;
        this.body.velocity.y = this.player.body.velocity.y;
    }
}



/*
const radius = 10;

        const circle = this.gameScene.add.circle(100, 450, radius, 0xABCDEF)
        this.physics.add.existing(circle, true);
        circle.body.setCircle(radius);
        circle.body.x -= radius / 2;
        circle.body.y -= radius / 2;
        this.physics.add.overlap(this.player.sprite, circle, (p, _) => {
            this.explosion.enableBody(true, this.player.x, this.player.y);
            this.explosion.setPosition(this.player.x, this.player.y);
            this.explosion.playAnim();
            console.log("Circle collision!");
        });
        this.physics.add.collider(this.platforms.group, circle);
        window.circle = circle;


*/
