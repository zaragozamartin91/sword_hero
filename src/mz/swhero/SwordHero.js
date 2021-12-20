// @ts-check

import AssetLoader from './AssetLoader'
import Hitbox from './Hitbox'
import InputManager from './InputManager'

const MAX_SPEED_X = 400
const MAX_SPEED_Y = 1100

/* Aceleracion del jugador mientras camina */
const ACCEL = MAX_SPEED_X * 0.90
const HALF_ACCEL = ACCEL * 0.5
const DOUBLE_ACCEL = ACCEL * 3
const TRIPLE_ACCEL = ACCEL * 3

const NEG_ACCEL = -ACCEL
const NEG_DOUBLE_ACCEL = -DOUBLE_ACCEL
const NEG_TRIPLE_ACCEL = -TRIPLE_ACCEL

const RAW_JUMP_POWER = 700
const JUMP_POWER = -RAW_JUMP_POWER
const BOUNCE_POWER = JUMP_POWER * 1
const NEG_BOUNCE_POWER = -BOUNCE_POWER
const DEFAULT_BOUNCE_FRAME = -1
const BOUNCE_FRAME_SPAN = 5

const SPIN_DURATION_MS = 400
const SPIN_TIMEOUT_MS = 200
const SPIN_ANGLE = 360 * 2

const EMPTY_LAMBDA = () => { }

const STAND_ATTACK_INFO = { animKey: 'unsheath_and_attack', duration: 400 }
const BODY_SCALING_FACTOR = { w: 0.3, h: 0.8 }

// variables temporales para ahorrar memoria
const TEMP = {
    input: { dir: 'NONE', action: 'NONE' }, // inputManager's input
    status: { position: 'STANDING', action: 'NONE' } // hero's position & action status
}

class StandAttackHitbox extends Hitbox {
    /**
     * @param {Phaser.Scene} scene Escena del juego
     * @param {SwordHero} hero Sword hero reference
     */
    constructor(scene, hero) {
        super(scene)
        this.hero = hero
        this.init({ x: 0, y: 0, w: 60, h: 20 })
    }

    attack() {
        const { x, y } = this.calculatePosition()
        this.enable(x, y)
    }

    calculatePosition() {
        const attackOffset = this.hero.facingLeft ? (-this.hero.width) : this.hero.width
        return { x: this.hero.x + attackOffset * BODY_SCALING_FACTOR.w, y: this.hero.y }
    }

    update() {
        if (this.enabled) {
            const { x, y } = this.calculatePosition()
            this.setPosition(x, y)
        }
    }
}

export default class SwordHero {
    /** @type{Phaser.Scene} */                                      scene = null
    /** @type{Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */ player = null
    /** @type{boolean} Determina si el personaje esta muerto */     dead = false
    /** @type{function} Funcion a ejecutar al morir */              onDeath = EMPTY_LAMBDA
    /** @type{boolean} Controla si el personaje puede girar */      canSpin = false
    /** @type{number} El frame en el que el jugador reboto */       bounceFrame = DEFAULT_BOUNCE_FRAME
    /** @type{StandAttackHitbox} Hitbox de ataques */               standHitbox = null
    /** @type{Boolean} Indica si el heroe esta girando */           spinning = false
    /** @type{Boolean} Indica si el heroe esta atacando */          attacking = false

    /** @type{boolean} Determina si el personaje esta bloqueado para hacer movimientos */
    motionBlocked = false

    /**
     * Crea un objeto de tipo jugador
     * @param {Phaser.Scene} scene Escena del juego
     */
    constructor(scene) {
        this.scene = scene
    }

    /**
     * Inicializa el jugador en una posicion.
     * @param {Number} x Posicion x.
     * @param {Number} y Posicion y.
     */
    init(x, y) {
        const scene = this.scene
        console.log('Loading sword hero!')

        const heroKey = 'sword_hero'
        const hero = scene.physics.add.sprite(x, y, heroKey)
        hero.setScale(2, 2)
        // carefully configuring hitbox correctly...
        hero.body.setSize(hero.body.width * BODY_SCALING_FACTOR.w, hero.body.height * BODY_SCALING_FACTOR.h)
        hero.body.setOffset(hero.body.offset.x, 6)
        hero.setBounce(0.0)
        hero.setCollideWorldBounds(false)

        AssetLoader.loadFor(scene, heroKey, () => {
            scene.anims.create({
                key: 'left',
                frames: scene.anims.generateFrameNumbers(heroKey, { start: 8, end: 13 }),
                frameRate: 10,
                repeat: -1
            })

            scene.anims.create({
                key: 'stand',
                frames: scene.anims.generateFrameNumbers(heroKey, { start: 0, end: 3 }),
                frameRate: 5,
                repeat: -1
            })

            scene.anims.create({
                key: 'right',
                frames: scene.anims.generateFrameNumbers(heroKey, { start: 8, end: 13 }),
                frameRate: 10,
                repeat: -1
            })

            scene.anims.create({
                key: 'jump',
                frames: scene.anims.generateFrameNumbers(heroKey, { start: 16, end: 23 }),
                frameRate: 10,
                repeat: 0
            })

            scene.anims.create({
                key: STAND_ATTACK_INFO.animKey,
                frames: scene.anims.generateFrameNumbers(heroKey, { start: 47, end: 52 }),
                duration: 400,
                repeat: 0
            })
        })

        this.player = hero

        /* Seteo la velocidad maxima del sprite en el eje x e y */
        this.player.setMaxVelocity(MAX_SPEED_X, MAX_SPEED_Y)

        /* Inicializacion del hitbox de golpe */
        this.standHitbox = new StandAttackHitbox(scene, this)
    }

    get sprite() { return this.player }

    get body() { return this.player.body }

    get velocity() { return this.player.body.velocity }

    get angularVelocity() { return this.body.angularVelocity }

    get angularAcceleration() { return this.body.angularAcceleration }

    get x() { return this.player.x }

    get y() { return this.player.y }

    get width() { return this.player.width }

    get height() { return this.player.height }

    get anims() { return this.player.anims }

    get angle() { return this.player.angle }

    /**
     * Voltea sprite del jugador.
     * 
     * @param {Boolean} value True para voltear sprite.
     */
    set flipX(value) { this.player.flipX = value }

    get facingLeft() { return this.player.flipX }

    get facingRight() { return !this.facingLeft }

    /**
     * Establece los manejadores de input (teclado y tactil)
     * @param {InputManager} inputManager Manejador de los inputs del mundo exterior. 
     */
    setInputManager(inputManager) {
        this.inputManager = inputManager
    }

    /**
     * Establece el rebote del jugador
     * @param {Number} value Valor de rebote.
     */
    setBounce(value) { this.player.setBounce(value) }

    /**
     * Determina si el sprite del jugador debe rebotar contra los limites del mundo o no.
     * @param {Boolean} value True para que el sprite del jugador rebote.
     */
    setCollideWorldBounds(value) { this.player.setCollideWorldBounds(value) }

    /**
     * Establece la posicion.
     * @param {Number} x posicion x.
     * @param {Number} y posicion y.
     */
    setPosition(x, y) { this.sprite.setPosition(x, y) }

    /**
     * Establece la velocidad Horizontal
     * @param {Number} value valor de velocidad.
     */
    setVelocityX(value) { this.sprite.setVelocityX(value) }

    /**
     * Establece la velocidad Vertical
     * @param {Number} value valor de velocidad.
     */
    setVelocityY(value) { this.sprite.setVelocityY(value) }

    /**
     * Establece la aceleracion Horizontal
     * @param {Number} value Valor de aceleracion. 
     */
    setAccelerationX(value) { this.sprite.setAccelerationX(value) }

    /**
     * Establece la aceleracion Vertical
     * @param {Number} value Valor de aceleracion. 
     */
    setAccelerationY(value) { this.sprite.setAccelerationY(value) }

    /**
     * Rota el sprite del jugador
     * @param {Number} degrees Grados horarios de rotacion.
     */
    rotate(degrees) { this.player.angle = this.player.angle + degrees }

    /**
     * Establece la velocidad angular del cuerpo.
     * 
     * @param {Number} value Velocidad angular.
     */
    setAngularVelocity(value) { this.player.setAngularVelocity(value) }

    /**
     * Establece la aceleracion angular del cuerpo.
     * 
     * @param {Number} value Aceleracion angular.
     */
    setAngularAcceleration(value) { this.player.setAngularAcceleration(value) }

    resetRotation() {
        this.player.angle = 0
        this.setAngularVelocity(0)
    }

    /**
     * Reproduce una animacion.
     * @param {String} anim Nombre de la animacion.
     * @param {Boolean} ignoreIfPlaying If an animation is already playing then ignore this call.
     */
    playAnim(anim, ignoreIfPlaying = true) { this.sprite.anims.play(anim, ignoreIfPlaying) }

    goingLeft() { return this.velocity.x < 0 }

    goingRight() { return !this.goingLeft() }

    goingUp() { return this.velocity.y < 0 }

    touchingDown() { return this.body.touching.down }

    blockedDown() { return this.body.blocked.down }

    /**
     * Marca al jugador como muerto
     */
    die() {
        this.sprite.setTint(0xff0000)
        this.sprite.anims.play('stand')
        this.dead = true

        this.onDeath()
    }

    /**
     * Marca al jugador como vivo
     */
    resurrect() {
        this.dead = false
    }

    isDead() {
        return this.dead
    }

    isAlive() {
        return !this.isDead()
    }


    /**
     * Configura el manejo de plataformas
     * @param {Phaser.GameObjects.GameObject} platforms Platform group 
     */
    handlePlatforms(platforms) {
        this.scene.physics.add.collider(this.sprite, platforms, () => {
            this.disableSpin()
            this.resetRotation()
        })
    }

    /**
     * Configura manejador de golpe de enemigo
     * @param {Phaser.GameObjects.GameObject} enemySprite Enemy sprite
     * @param {function} hitCallback Funcion callback al golpear
     */
    handleAttackingEnemy(enemySprite, hitCallback) {
        this.scene.physics.add.overlap(this.standHitbox.sprite, enemySprite, () => hitCallback())
    }

    /**
     * Establece la funcion a ejecutar cuando el jugador muere.
     * @param {Function} f funcion a ejecutar cuando el jugador muere.
     */
    setOnDeath(f) { this.onDeath = f }

    parseStatus() {
        const heroStatus = {}
        if (this.blockedDown()) {
            heroStatus.position = 'STANDING'
        } else {
            heroStatus.position = 'FLOATING'
        }

        if (this.attacking) {
            heroStatus.action = 'ATTACKING'
        } else if (this.spinning) {
            heroStatus.action = 'SPINNING'
        } else {
            heroStatus.action = 'NONE'
        }

        return heroStatus
    }

    /**
     * Actualiza el estado del jugador a partir de los inputs del mundo real.
     */
    update() {
        this.standHitbox.update()

        // si tengo movimientos bloqueados => evito todo movimiento
        // if (this.motionBlocked) { return }

        TEMP.input = this.inputManager.currentInput
        TEMP.status = this.parseStatus()

        switch (TEMP.status.action) {
            case 'ATTACKING':
                return this.isStopping() ? this.stopMovement() : this.decelerate()
            default: switch (TEMP.status.position) {
                case 'STANDING': return this.updateStading(TEMP.input)
                case 'FLOATING': return this.updateFloating(TEMP.input)
                default: // nothing
            }
        }
    }

    /**
     * Updates sword hero while standing
     * @param {{action:string, dir:string}} input User input
     */
    updateStading(input) {
        // en el piso
        switch (input.action) {
            case 'ATTACK': return this.standAttack()
            case 'JUMP': return this.jump()
            default: // no action button pressed 
                switch (input.dir) {
                    case 'LEFT': return this.walkLeft()
                    case 'RIGHT': return this.walkRight()
                    default: // no direction button pressed
                        return this.isStopping() ? this.haltAndStand() : this.walkSlower()
                }
        }
    }

    /**
     * Updates the sword hero while floating
     * @param {{action:string, dir:string}} input User input
     */
    updateFloating(input) {
        // en el aire
        switch (input.action) {
            case 'JUMP': return this.tryToSpin()
            default: switch (input.dir) {
                case 'LEFT': return this.floatLeft()
                case 'RIGHT': return this.floatRight()
                default: return this.setAccelerationX(0) // no directions pressed
            }
        }
    }

    isStopping() {
        return Math.abs(this.velocity.x) < HALF_ACCEL
    }

    stopMovement() {
        this.setAccelerationX(0)
        this.setVelocityX(0)
    }

    decelerate() {
        return this.setAccelerationX(this.goingLeft() ? ACCEL : NEG_ACCEL)
    }

    haltAndStand() {
        this.playAnim('stand', true)
        return this.stopMovement()
    }

    walkLeft() {
        this.moveLeft()
        this.flipX = true
        return this.playAnim('left', true)
    }

    moveLeft() { this.setAccelerationX(this.goingRight() ? NEG_TRIPLE_ACCEL : NEG_ACCEL) }

    floatLeft() { this.setAccelerationX(NEG_ACCEL) }

    walkRight() {
        this.moveRight()
        this.flipX = false
        this.playAnim('right', true)
    }

    moveRight() { this.setAccelerationX(this.goingLeft() ? TRIPLE_ACCEL : ACCEL) }

    walkSlower() {
        console.log('WALKING SLOWER')
        this.playAnim(this.goingLeft() ? 'left' : 'right', true)
        return this.decelerate()
    }

    floatRight() { this.setAccelerationX(ACCEL) }

    jump() {
        this.setVelocityY(JUMP_POWER)
        this.playAnim('jump', true)
        this.scene.time.delayedCall(SPIN_TIMEOUT_MS, this.enableSpin, [], this)
    }

    standAttack() {
        this.attacking = true
        this.setAccelerationX(0)
        this.withMotionBlock(() => {
            this.playAnim(STAND_ATTACK_INFO.animKey, true)
            this.scene.time.delayedCall(STAND_ATTACK_INFO.duration * 0.25, () => {
                // delay the attack hitbox re-positioning to have animation and hitbox in sync
                this.standHitbox.attack()
            }, [], this)
        }, STAND_ATTACK_INFO.duration
            , () => {
                this.standHitbox.disable()
                this.attacking = false
            })
    }

    /**
     * Ejecuta una accion y bloquea movimientos por un tiempo determinado
     * @param {Function} action Accion a ejecutar
     * @param {number} blockTime Tiempo de bloqueo en ms
     * @param {function} endCallback Funcion a ejecutar al finalizar el 'motion block'
     */
    withMotionBlock(action, blockTime, endCallback = EMPTY_LAMBDA) {
        this.motionBlocked = true
        action()
        this.scene.time.delayedCall(blockTime, () => {
            this.motionBlocked = false
            endCallback()
        }, [], this)
    }

    enableSpin() { this.canSpin = true }

    disableSpin() { this.canSpin = false }

    bounce() {
        const bf = this.getGameFrame()
        /* Para prevenir doble rebotes, verifico si pasaron mas de $BOUNCE_FRAME_SPAN frames del ultimo rebote */
        if (this.bounceFrame === DEFAULT_BOUNCE_FRAME || Math.abs(bf - this.bounceFrame) > BOUNCE_FRAME_SPAN) {
            this.bounceFrame = bf
            const bounceFactor = Math.abs(this.velocity.x) / MAX_SPEED_X
            this.setVelocityY(BOUNCE_POWER * bounceFactor)
            this.setVelocityX(this.velocity.x * -1)
        }
    }

    getGameFrame() {
        return this.scene.game.getFrame()
    }

    /**
     * Hace rebotar al personaje contra un enemigo
     * @param {number} enemyY Posicion enemigo Y
     */
    bounceOffEnemy(enemyY) {
        const bp = this.y < enemyY ? BOUNCE_POWER : NEG_BOUNCE_POWER
        this.setVelocityY(bp)
    }

    /**
     * Chequea condicion de rebote contra un TILE
     * @param {Phaser.Tilemaps.Tile} tile 
     */
    checkWallBounce(tile) {
        return tile.properties.bounce && this.goingUp()
    }

    /* Ejecuta un rebote desactivando tambien el cuerpo del giro */
    executeBounce() {
        this.bounce()
    }

    /**
     * Chequea y ejecuta condicion de muerte contra un obstaculo peligroso
     * @param {Phaser.Tilemaps.Tile} tile 
     */
    checkHazard(tile) {
        return tile.properties.deadly
    }

    tryToSpin() {
        if (this.canSpin) { this.doSpin() }
    }

    doSpin() {
        this.spinning = true
        this.disableSpin()

        const self = this
        this.scene.tweens.add({
            targets: self.sprite,
            angle: self.goingRight() ? self.angle + SPIN_ANGLE : self.angle - SPIN_ANGLE,
            ease: 'Power1',
            duration: SPIN_DURATION_MS,
            onComplete: () => { self.spinning = false }
        })
    }
}
