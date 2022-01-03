// @ts-check

import AssetLoader from './AssetLoader'
import Hitbox from './Hitbox'
import InputManager from './InputManager'

const MAX_SPEED_X = 400
const MAX_SPEED_Y = 1100
const MAX_DROP_SPEED_Y = 800

/* Aceleracion del jugador mientras camina */
const ACCEL = MAX_SPEED_X * 0.90
const HALF_ACCEL = ACCEL * 0.5
const TRIPLE_ACCEL = ACCEL * 3

const NEG_ACCEL = -ACCEL
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
const TAKE_DAMAGE_INFO = { animKey: 'take_damage', duration: 300, speedX: 250, speedY: 300 }
const FLOAT_ATTACK_INFO = { animKey: 'float_attack', duration: 300 }
const BODY_SCALING_FACTOR = { w: 0.3, h: 0.8 }

// variables temporales para ahorrar memoria
const TEMP = {
    input: { dir: 'NONE', action: 'NONE' }, // inputManager's input
    status: { position: 'STANDING', action: 'NONE' } // hero's position & action status
}

class HeroHitbox extends Hitbox {
    /**
     * @param {Phaser.Scene} scene Escena del juego
     * @param {SwordHero} hero Sword hero reference
     */
    constructor(scene, hero) {
        super(scene)
        this.hero = hero
    }

    attack() {
        const { x, y } = this.calculatePosition()
        this.enable(x, y)
    }

    update() {
        if (this.enabled) {
            const { x, y } = this.calculatePosition()
            this.setPosition(x, y)
        }
    }

    calculatePosition() {
        const widthDiff = Math.abs(this.hero.width - this.width)
        const attackOffset = this.hero.facingLeft ? (-widthDiff) : widthDiff
        return { x: this.hero.x + attackOffset / 2, y: this.hero.y }
    }
}

class StandAttackHitbox extends HeroHitbox {
    /**
     * @param {Phaser.Scene} scene Escena del juego
     * @param {SwordHero} hero Sword hero reference
     */
    constructor(scene, hero) {
        super(scene, hero)
        this.init({ x: 0, y: 0, w: 60, h: 20 })
    }
}

class FloatAttackHitbox extends HeroHitbox {
    /**
     * @param {Phaser.Scene} scene Escena del juego
     * @param {SwordHero} hero Sword hero reference
     */
    constructor(scene, hero) {
        super(scene, hero)
        this.init({ x: 0, y: 0, w: 65, h: 50 })
    }
}

export default class SwordHero {
    /** @type{Phaser.Scene} */                                      scene = null
    /** @type{Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */ sprite = null
    /** @type{boolean} Determina si el personaje esta muerto */     dead = false
    /** @type{function} Funcion a ejecutar al morir */              onDeath = EMPTY_LAMBDA
    /** @type{boolean} Controla si el personaje puede girar */      canSpin = false
    /** @type{number} El frame en el que el jugador reboto */       bounceFrame = DEFAULT_BOUNCE_FRAME
    /** @type{StandAttackHitbox} Hitbox de ataques */               standHitbox = null
    /** @type{FloatAttackHitbox} Hitbox de ataque aereo */          floatHitbox = null
    /** @type{Boolean} Indica si el heroe esta girando */           spinning = false
    /** @type{Boolean} Indica si el heroe esta atacando */          attacking = false
    /** @type{number} Hero's max health */                          health = 3
    /** @type{number} Hero's current damage */                      damage = 0
    /** @type{boolean} Hero is currently taking damage */           takingDamage = false
    /** @type{function} Take damage callback */                     onTakeDamage = EMPTY_LAMBDA

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
     * Initializes sword hero.
     * @param {Number} x X position.
     * @param {Number} y Y position.
     * @param {{health: Number}} extras Extra parameters like health and stuff
     */
    init(x, y, extras = { health: 3 }) {
        const scene = this.scene
        console.log('Loading sword hero!')

        this.damage = 0

        const heroKey = 'sword_hero'
        const sprite = scene.physics.add.sprite(x, y, heroKey)
        sprite.setScale(2, 2) // scaling up the sprite
        // carefully configuring hitbox correctly...
        sprite.body.setSize(sprite.body.width * BODY_SCALING_FACTOR.w, sprite.body.height * BODY_SCALING_FACTOR.h)
        sprite.body.setOffset(sprite.body.offset.x, 6)
        sprite.setBounce(0.0)
        sprite.setCollideWorldBounds(false)

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
                duration: STAND_ATTACK_INFO.duration,
                repeat: 0
            })

            scene.anims.create({
                key: TAKE_DAMAGE_INFO.animKey,
                frames: scene.anims.generateFrameNumbers(heroKey, { frames: [123, 122, 121] }),
                duration: TAKE_DAMAGE_INFO.duration,
                repeat: 0
            })

            scene.anims.create({
                key: FLOAT_ATTACK_INFO.animKey,
                frames: scene.anims.generateFrameNumbers(heroKey, { start: 95, end: 99 }),
                duration: FLOAT_ATTACK_INFO.duration,
                repeat: 0
            })
        })

        this.sprite = sprite

        /* Seteo la velocidad maxima del sprite en el eje x e y */
        this.sprite.setMaxVelocity(MAX_SPEED_X, MAX_SPEED_Y)

        /* Inicializacion del hitbox de golpe */
        this.standHitbox = new StandAttackHitbox(scene, this)
        this.floatHitbox = new FloatAttackHitbox(scene, this)
    }

    get body() { return this.sprite.body }

    get velocity() { return this.sprite.body.velocity }

    get angularVelocity() { return this.body.angularVelocity }

    get angularAcceleration() { return this.body.angularAcceleration }

    /** Returns X center coordinate */
    get x() { return this.sprite.x }

    /** Returns Y center coordinate */
    get y() { return this.sprite.y }

    get width() {
        // using body width instead of sprite width due to body hitbox scaling (see this.init method) 
        return this.body.width
    }

    get height() { return this.sprite.height }

    get anims() { return this.sprite.anims }

    get angle() { return this.sprite.angle }

    /**
     * Voltea sprite del jugador.
     * 
     * @param {Boolean} value True para voltear sprite.
     */
    set flipX(value) { this.sprite.flipX = value }

    get facingLeft() { return this.sprite.flipX }

    get facingRight() { return !this.facingLeft }

    get remainingHealth() { return this.health - this.damage }

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
    setBounce(value) { this.sprite.setBounce(value) }

    /**
     * Determina si el sprite del jugador debe rebotar contra los limites del mundo o no.
     * @param {Boolean} value True para que el sprite del jugador rebote.
     */
    setCollideWorldBounds(value) { this.sprite.setCollideWorldBounds(value) }

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
    rotate(degrees) { this.sprite.angle = this.sprite.angle + degrees }

    /**
     * Establece la velocidad angular del cuerpo.
     * 
     * @param {Number} value Velocidad angular.
     */
    setAngularVelocity(value) { this.sprite.setAngularVelocity(value) }

    /**
     * Establece la aceleracion angular del cuerpo.
     * 
     * @param {Number} value Aceleracion angular.
     */
    setAngularAcceleration(value) { this.sprite.setAngularAcceleration(value) }

    resetRotation() {
        this.sprite.angle = 0
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
        this.scene.physics.add.overlap(this.floatHitbox.sprite, enemySprite, () => hitCallback())
    }

    /**
     * Establece la funcion a ejecutar cuando el jugador muere.
     * @param {Function} f funcion a ejecutar cuando el jugador muere.
     */
    setOnDeath(f) { this.onDeath = f }

    parseStatus() {
        const heroStatus = {}
        if (this.takingDamage) {
            heroStatus.position = 'TAKING_DAMAGE'
        } else if (this.blockedDown()) {
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
        this.floatHitbox.update()

        TEMP.input = this.inputManager.currentInput
        TEMP.status = this.parseStatus()

        switch (TEMP.status.position) {
            case 'TAKING_DAMAGE': return // movement is blocked while taking damage
            case 'STANDING': return this.updateStading(TEMP.input, TEMP.status)
            case 'FLOATING': return this.updateFloating(TEMP.input)
            default: // nothing
        }
    }

    /**
     * Updates sword hero while standing
     * @param {{action:string, dir:string}} input User input
     * @param {{position:string, action:string}} status Sword hero status
     */
    updateStading(input, status) {
        // en el piso
        switch (status.action) {
            case 'ATTACKING':
                return this.isStopping() ? this.stopMovement() : this.decelerate()
            default: switch (input.action) {
                case 'ATTACK': return this.tryToStandAttack()
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
    }

    /**
     * Updates the sword hero while floating
     * @param {{action:string, dir:string}} input User input
     */
    updateFloating(input) {
        this.capDropSpeed()

        switch (input.action) {
            case 'ATTACK': return this.tryToFloatAttack()
            case 'JUMP': return this.tryToSpin()
            default: switch (input.dir) {
                case 'LEFT': return this.floatLeft()
                case 'RIGHT': return this.floatRight()
                default: return this.setAccelerationX(0) // no directions pressed
            }
        }
    }

    capDropSpeed() {
        if (this.velocity.y > MAX_DROP_SPEED_Y) {
            this.setAccelerationY(0)
            this.setVelocityY(MAX_DROP_SPEED_Y)
        }
    }

    isStopping() {
        return Math.abs(this.velocity.x) < HALF_ACCEL
    }

    /**
     * Configures listener for taking a hit from the enemy
     * @param {Phaser.Physics.Arcade.Sprite} enemySprite Enemy sprite
     */
    handleEnemyHit(enemySprite, damage = 1) {
        this.scene.physics.add.overlap(this.sprite, enemySprite, (_p, _) => {
            this.getHit(damage)
        })
    }

    /**
     * Takes damage and recoils
     * @param {number} damage Damage to receive
     */
    getHit(damage = 1) {
        if (this.takingDamage) { return } // cannot take damage WHILE taking damage
        this.takeDamage(damage)
        this.recoil()
    }

    takeDamage(damage = 1) {
        this.damage += damage
        this.onTakeDamage()
        if (this.damage >= this.health) { this.die() }
        return this
    }

    /**
     * Sets a function to be invoked upon taking damage
     * @param {Function} f Take damage callback
     */
    setOnTakeDamage(f) {
        this.onTakeDamage = f
    }

    recoil() {
        const { speedX, speedY, duration } = TAKE_DAMAGE_INFO
        const velX = this.facingRight ? (-speedX) : speedX
        const velY = -speedY
        this.playAnim(TAKE_DAMAGE_INFO.animKey, true)
        this.setVelocityX(velX)
        this.setVelocityY(velY)
        this.setAccelerationX(0)
        this.setAccelerationY(0)
        this.takingDamage = true
        this.sprite.setTint(0xff0000)
        this.scene.time.delayedCall(duration, () => {
            this.takingDamage = false
            this.sprite.clearTint()
        })
        return this
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
        this.playAnim(this.goingLeft() ? 'left' : 'right', true)
        return this.decelerate()
    }

    floatRight() { this.setAccelerationX(ACCEL) }

    jump() {
        this.setVelocityY(JUMP_POWER)
        this.playAnim('jump', true)
        this.scene.time.delayedCall(SPIN_TIMEOUT_MS, this.enableSpin, [], this)
    }

    tryToStandAttack() {
        if (!this.attacking) {
            this.standAttack()
        }
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

    tryToFloatAttack() {
        if (!this.attacking) {
            this.floatAttack()
        }
    }

    floatAttack() {
        this.attacking = true
        this.withMotionBlock(() => {
            this.playAnim(FLOAT_ATTACK_INFO.animKey, true)
            this.scene.time.delayedCall(FLOAT_ATTACK_INFO.duration * 0.25, () => {
                // delay the attack hitbox re-positioning to have animation and hitbox in sync
                this.floatHitbox.attack()
            }, [], this)
        }, FLOAT_ATTACK_INFO.duration
            , () => {
                this.floatHitbox.disable()
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
        if (tile.properties.deadly) {
            const overlapRectangle = this.getOverlapRectangle(tile)
            return overlapRectangle.height > (tile.height / 2)
        } else {
            return false
        }
    }

    /**
     * Calculates overlapping rectangle between hero sprite and another tile (for example, SPIKES)
     * @param {Phaser.Tilemaps.Tile} os Tile to check for overlapping rectangle for
     */
    getOverlapRectangle(os) {
        const heroRect = { cx: this.x, cy: this.y, w: this.width, h: this.height }
        const osRect = { cx: os.getCenterX(), cy: os.getCenterY(), w: os.width, h: os.height }
        return Phaser.Geom.Intersects.GetRectangleIntersection(
            this.toRectangle(heroRect), this.toRectangle(osRect))
    }

    /**
     * Creates a rectangle using sprite coordinates
     * @param {{cx:number,cy:number,w:number,h:number}} spriteCoordinates  
     * @returns {Phaser.Geom.Rectangle} Phaser rectangle
     */
    toRectangle({ cx, cy, w, h }) {
        return new Phaser.Geom.Rectangle(cx - w / 2, cy - h / 2, w, h)
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
