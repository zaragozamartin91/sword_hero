// @ts-check

import Background from './Background'
import Explosion from './Explosion'
import Tileset from './Tileset'
import Camera from './Camera'
import StaticEnemy from './StaticEnemy'
import AssetLoader from './AssetLoader'
import InteractiveScene from './InteractiveScene'
import Hitbox from './Hitbox'
import CollectableGroup from './CollectableGroup'

const PLAYER_START_POS = { x: 150, y: 1200 }
const ABYSS_LIMIT = 1800
const CAMERA_CONFIG = { y: 1250, lowerBound: 1275 }
const FADEOUT_CONFIG = { duration: 1000, color: { r: 0, g: 0, b: 0 } }

export default class Scene01 extends InteractiveScene {
    /**
     * Crea una escena de juego
     */
    constructor() {
        super('Scene01')

        this.explosion = new Explosion(this) // explosion

        this.bg = new Background(this)

        this.tileset = new Tileset(this)

        this.mainCamera = new Camera(this)

        this.wasps = [
            {
                pos: { x: 2400, y: 1050 }, enemy: StaticEnemy.newWasp(this),
                tweencfg: { props: { x: 2600 }, duration: 1500, yoyo: true, repeat: -1, flipX: false, hold: 200, repeatDelay: 200 }
            },

            {
                pos: { x: 4900, y: 1180 }, enemy: StaticEnemy.newWasp(this),
                tweencfg: { props: { x: 5350 }, duration: 1500, yoyo: true, repeat: -1, flipX: false, hold: 200, repeatDelay: 200 }
            },

            {
                pos: { x: 5800, y: 1100 }, enemy: StaticEnemy.newWasp(this),
                tweencfg: { props: { x: 6100 }, duration: 1500, yoyo: true, repeat: -1, flipX: false, hold: 150, repeatDelay: 200 }
            }
        ]

        this.crabs = [
            {
                pos: { x: 1450, y: 1200 }, enemy: StaticEnemy.newCrab(this),
                // x signals END X position
                tweencfg: { props: { x: 1700 }, duration: 1500, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 2700, y: 1300 }, enemy: StaticEnemy.newCrab(this),
                // x signals END X position
                tweencfg: { props: { x: 3200 }, duration: 1500, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 3600, y: 1200 }, enemy: StaticEnemy.newCrab(this),
                // x signals END X position
                tweencfg: { props: { x: 3750 }, duration: 1000, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 3950, y: 1200 }, enemy: StaticEnemy.newCrab(this),
                // x signals END X position
                tweencfg: { props: { x: 4200 }, duration: 1000, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 700, y: 800 }, enemy: StaticEnemy.newCrab(this),
                // x signals END X position
                tweencfg: { props: { x: 1025 }, duration: 1000, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            }
        ]

        this.flagpole = new Hitbox(this)

        // configuring collectable stars
        this.stars = new CollectableGroup(this)
        this.starLocations = [
            { x: 60, y: 1000 }, { x: 1485, y: 1300 }, { x: 1275, y: 1000 },
            { x: 780, y: 800 }, { x: 2975, y: 1200 }, { x: 3975, y: 1200 },
            { x: 5860, y: 1200 }
        ]

        // computing possible max score
        this.maxScore = 10 * (this.starLocations.length + this.crabs.length + this.wasps.length)
    }


    preload() {
        super.preload()

        AssetLoader.loadFor(this, 'Items', () => {
            this.load.image('star', 'assets/star.png')
            this.load.image('bomb', 'assets/bomb.png')
        })

        AssetLoader.loadFor(this, 'Effects', () => {
            //this.load.multiatlas('sparkle', 'assets/sparkle.json', 'assets') SPARKLE IS NOT NEEDED FOR NOW
            this.load.multiatlas('explosion', 'assets/explosion.json', 'assets')
        })

        AssetLoader.loadFor(this, 'EnemySprites', () => {
            // cargamos la imagen de la avispa
            this.load.multiatlas('wasp', 'assets/wasp.json', 'assets')

            // cargamos la imagen de la avispa
            this.load.multiatlas('crab_walk', 'assets/crab_walk.json', 'assets')
        })

        AssetLoader.loadFor(this, 'FactoryMapSprites', () => {
            this.load.image('background', 'assets/industrial-background.jpeg') // LOOKS GOOD
            this.load.image('factory_map', 'assets/factory_tiles.png')
            this.load.tilemapTiledJSON('factory_map', 'assets/factory_map.json')
        })
    }

    create() {
        super.create()

        const wd = Scene01.getWorldDimensions()
        this.bg.init(wd.half_worldWidth, wd.half_worldHeight, wd.worldWidth, wd.worldHeight)

        // creando tileset
        this.tileset
            .init('factory_map', 'factory_tiles')
            .createLayer('world')
            .createLayer('back')
            .createLayer('death')
            .setCollisionByProperty('world', { stand: true, bounce: true })
            .setCollisionByProperty('death', { deadly: true })
        if (Scene01.devProfileEnabled()) {
            this.tileset.renderDebug('world')
            this.tileset.renderDebug('death', { red: 50, green: 255, blue: 255, alpha: 255 })
        }

        const worldLayer = this.tileset.getLayer('world')
        const deathLayer = this.tileset.getLayer('death')

        this.bombs = this.physics.add.group();

        this.explosion.init(100, 950);
        this.explosion.disableBody(true, true);

        this.wasps.forEach(w => w.enemy.init(w.pos.x, w.pos.y).playAnim())
        this.crabs.forEach(c => c.enemy.init(c.pos.x, c.pos.y, true).playAnim())


        // loading sword hero ===================================================================================================
        this.hero.init(PLAYER_START_POS.x, PLAYER_START_POS.y, { health: 3 })
        this.resetHealthBar(this.hero.health)
        this.hero.setInputManager(this.inputManager)
        this.hero.setOnDeath(() => {
            this.explosion.explode(this.hero.x, this.hero.y)
            this.physics.pause()
            this.mainCamera.fadeOutAndThen(FADEOUT_CONFIG.duration, FADEOUT_CONFIG.color, () => {
                this.hero.resurrect()
                this.scene.restart()
            })
        })
        this.hero.setOnTakeDamage(() => this.updateHealthBar(this.hero.damage))

        //Let's drop a sprinkling of stars into the scene and allow the player to collect them ----------------------------------------------------
        //Groups are able to take configuration objects to aid in their setup
        this.stars.init('star').addItems(this.starLocations)
        this.stars.iterate(child => { child.setBounceY(this.numberBetween(0.4, 0.8)) })

        /* DETECCION DE COLISION ----------------------------------------------------------------------------------------------------------------- */

        /* In order to allow the player to collide with the platforms we can create a Collider object. 
        This object monitors two physics objects (which can include Groups) and checks for collisions or overlap between them. 
        If that occurs it can then optionally invoke your own callback, but for the sake of just colliding with platforms we don't require that */

        // we add collider between sword hero and world layer
        this.hero.handlePlatforms(worldLayer)

        this.stars.collideWith(worldLayer)

        //This tells Phaser to check for an overlap between the player and any star in the stars Group
        this.stars.onCollect(this.hero.sprite, star => {
            this.bumpScore(10)

            //We use a Group method called countActive to see how many this.stars are left alive
            if (this.stars.countActive() === 0) {
                //enableBody(reset, x, y, enableGameObject, showGameObject)
                this.stars.iterate(child => child.enableBody(true, child.x, PLAYER_START_POS.y, true, true))
                let x = this.numberBetween(PLAYER_START_POS.x, PLAYER_START_POS.x + 300)

                let bomb = this.bombs.create(x, PLAYER_START_POS.y, 'bomb')
                bomb.setBounce(1)
                bomb.setCollideWorldBounds(false)
                bomb.setVelocity(this.numberBetween(-200, 200), 20)
            }
        })

        this.physics.add.collider(this.bombs, worldLayer)

        this.physics.add.collider(this.hero.sprite, this.bombs, (p, _) => {
            this.hero.die()
        })

        this.wasps.forEach(w => {
            const wasp = w.enemy

            this.hero.handleEnemyHit(wasp.sprite)

            if (w.tweencfg) { this.tweens.add({ ...w.tweencfg, targets: wasp }) }
            wasp.setOnDeath(() => {
                this.explosion.explode(wasp.x, wasp.y, 3, 3)
                this.bumpScore(10)
            })
            this.hero.handleAttackingEnemy(wasp.sprite, wasp.die.bind(wasp))
        })

        this.crabs.forEach(c => {
            const crab = c.enemy
            // disable gravity on crab enemy upon collision to optimise calculations
            this.physics.add.collider(crab.sprite, worldLayer, () => crab.sprite.body.setAllowGravity(false))

            this.hero.handleEnemyHit(crab.sprite)

            if (c.tweencfg) { this.tweens.add({ ...c.tweencfg, targets: crab }) }
            crab.setOnDeath(() => {
                this.explosion.explode(crab.x, crab.y, 3, 3)
                this.bumpScore(10)
            })
            this.hero.handleAttackingEnemy(crab.sprite, crab.die.bind(crab))
        })

        /* Si el jugador toca un objeto de la capa 'death' este muere */
        this.hero.handleSpikes(deathLayer)

        /* MANEJO DE CAMARA ----------------------------------------------------------------------------------------------------------- */

        // configure camera to follow player sprite
        const cameraFollowVertical = Scene01.smallScreen()
        this.mainCamera.init({
            playerSprite: this.hero.sprite,
            x: this.hero.sprite.x,
            y: CAMERA_CONFIG.y,
            followHorizontal: true,
            followVertical: cameraFollowVertical
        }).withLowerBound(CAMERA_CONFIG.lowerBound)
        this.mainCamera.fadeIn() // fade in at start of scene

        // init flagpole to complete stage
        this.flagpole.init({ x: 0, y: 0, w: 100, h: 130 })
        this.flagpole.enable(6700, 975)
        this.flagpole.onOverlap(this.hero.sprite, () => {
            this.flagpole.disable()
            const { duration, color } = FADEOUT_CONFIG
            const sceneData = { score: this.score, maxScore: this.maxScore }
            this.mainCamera.fadeOutAndThen(duration, color, () => this.completeStage(sceneData))
        })
    }


    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} [_delta] The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update(time, _delta) {
        super.update(time)

        if (this.hero.isAlive()) {
            this.mainCamera.update()
            this.hero.update()
            this.bg.update(this.hero.body.velocity.x, 0) // dont update background in Y axis
        }

        /* Si el jugador se cae al fondo, entonces muere y reiniciamos el juego */
        if (this.hero.y > ABYSS_LIMIT) {
            this.hero.setPosition(0, ABYSS_LIMIT - 100)
            this.hero.die()
        }
    }
}
