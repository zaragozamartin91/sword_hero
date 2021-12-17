import Player from './Player'

const SPIN_DURATION_MS = 400;
const HALF_SPIN_DURATION_MS = SPIN_DURATION_MS / 2;

const EMPTY_FN = () => { };

class Spin {
    /**
     * Construye un SPIN o giro de jugador ante un doble-salto
     * @param {Phaser.Scene} scene Escena del juego
     */
    constructor(scene) {
        this.scene = scene;
        this.__duration = SPIN_DURATION_MS;
    }

    /**
     * Inicializa el componente de giro.
     * @param {Player} player Jugador.
     */
    init(player) {
        const scene = this.scene;

        this.p_sprite = scene.physics.add.sprite(100, 450, 'spin');
        this.player = player;
        this.p_sprite.body.setCircle(this.p_sprite.width / 2);
        this.p_sprite.body.allowGravity = false;

        this.sprite.scaleX = this.sprite.scaleY = 0.1;

        this.spinning = false;
        this.disableBody();
    }

    get sprite() { return this.p_sprite; }

    get body() { return this.sprite.body; }

    /**
     * Obtiene la duracion del giro en ms
     * @returns {Number} duracion del giro en ms
     */
    get duration() { return this.__duration; }

    /**
     * Establece la posicion.
     * @param {Number} x posicion x.
     * @param {Number} y posicion y.
     */
    setPosition(x, y) { this.sprite.setPosition(x, y); }


    /**
     * Reproduce la animacion.
     */
    playAnim({ completeCb = EMPTY_FN, startCb = EMPTY_FN }) {
        if (this.spinning) { return; }

        this.spinning = true;
        const self = this;

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
            onStart: function () { self.enableBody(); self.spinning = true; startCb(); },
            onComplete: function () { self.disableBody(); self.spinning = false; completeCb(); },
            onYoyo: function () { },
            onRepeat: function () { },
        });
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

    update() {
        this.sprite.x = this.player.x;
        this.sprite.y = this.player.y;
        this.body.velocity.x = this.player.body.velocity.x;
        this.body.velocity.y = this.player.body.velocity.y;
    }
}

export default Spin;



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
