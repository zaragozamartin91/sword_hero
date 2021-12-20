// @ts-check

import Preloader from './Preloader'
import Background from './Background'
import GameText from './GameText'
import Explosion from './Explosion'
import BaseScene from './BaseScene'
import Tileset from './Tileset'
import GlobalConfig from './GlobalConfig'
import SwordHero from './SwordHero'
import Camera from './Camera'

// const PLAYER_START_POS = { x: 667, y: 2200 }
const PLAYER_START_POS = { x: 150, y: 1100 }
const ABYSS_LIMIT = 1800
const VOID_DEBUG_TEXT = { init: function () { }, setText: function () { } }
const CAMERA_POS = { y: 1250 }


export default class Scene01 extends BaseScene {
    /**
     * Crea una escena de juego
     */
    constructor() {
        super('Scene01')

        this.preloader = new Preloader(this)

        this.swordHero = new SwordHero(this) // new sword hero object
        window.swordHero = this.swordHero
        this.explosion = new Explosion(this) // explosion

        this.score = 0
        this.scoreText = new GameText(this)
        this.debugText = GlobalConfig.devProfile() ? new GameText(this) : VOID_DEBUG_TEXT

        this.bg = new Background(this)

        this.tileset = new Tileset(this)

        this.wasps = [
            { pos: { x: 2400, y: 1050 }, enemy: this.newWasp(), 
            tweencfg: { props: { x: 2600 }, duration: 1500, yoyo: true, repeat: -1, flipX: false, hold: 200, repeatDelay: 200 }},
        ]

        this.crabs = [
            {
                pos: { x: 1450, y: 1000 }, enemy: this.newCrab(),
                // x signals END X position
                tweencfg: { props: { x: 1700 }, duration: 1500, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 2700, y: 1300 }, enemy: this.newCrab(),
                // x signals END X position
                tweencfg: { props: { x: 3200 }, duration: 1500, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 3600, y: 1200 }, enemy: this.newCrab(),
                // x signals END X position
                tweencfg: { props: { x: 3750 }, duration: 1000, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            },
            {
                pos: { x: 3950, y: 1200 }, enemy: this.newCrab(),
                // x signals END X position
                tweencfg: { props: { x: 4200 }, duration: 1000, yoyo: true, repeat: -1, flipX: true, hold: 500, repeatDelay: 500 }
            }
        ]
    }


    preload() {
        console.log("PRELOAD")
        this.preloader.init()
    }

    create() {
        console.log("CREATE")
        super.create()

        this.scoreText.init(0, 0, 'Score: 0')
        this.debugText.init(0, 32, '')
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
        if (GlobalConfig.devProfile()) {
            this.tileset.renderDebug('world')
            this.tileset.renderDebug('death', { red: 50, green: 255, blue: 255, alpha: 255 })
        }

        const worldLayer = this.tileset.getLayer('world')
        const deathLayer = this.tileset.getLayer('death')
        window.worldLayer = worldLayer
        window.deathLayer = deathLayer

        this.bombs = this.physics.add.group();

        this.explosion.init(100, 950);
        this.explosion.disableBody(true, true);

        this.wasps.forEach(w => w.enemy.init(w.pos.x, w.pos.y).playAnim())
        this.crabs.forEach(c => c.enemy.init(c.pos.x, c.pos.y, true).playAnim())


        // loading sword hero ===================================================================================================
        this.swordHero.init(PLAYER_START_POS.x, PLAYER_START_POS.y)
        this.swordHero.setInputManager(this.inputManager)
        this.swordHero.setOnDeath(() => {
            this.explosion.explode(this.swordHero.x, this.swordHero.y)
            this.physics.pause()
            this.time.delayedCall(1000, () => {
                this.swordHero.resurrect()
                this.scene.restart()
            })
        })

        //Let's drop a sprinkling of stars into the scene and allow the player to collect them ----------------------------------------------------
        //Groups are able to take configuration objects to aid in their setup
        this.stars = this.physics.add.group({
            key: 'star', //texture key to be the star image by default
            repeat: 6, //Because it creates 1 child automatically, repeating 11 times means we'll get 12 in total
            setXY: { x: 90, y: PLAYER_START_POS.y, stepX: 70 } //this is used to set the position of the 12 children the Group creates. Each child will be placed starting at x: 12, y: 0 and with an x step of 70
        });

        this.stars.children.iterate(child => { child.setBounceY(this.numberBetween(0.4, 0.8)) })

        /* DETECCION DE COLISION ----------------------------------------------------------------------------------------------------------------- */

        /* In order to allow the player to collide with the platforms we can create a Collider object. 
        This object monitors two physics objects (which can include Groups) and checks for collisions or overlap between them. 
        If that occurs it can then optionally invoke your own callback, but for the sake of just colliding with platforms we don't require that */

        // we add collider between sword hero and world layer
        this.swordHero.handlePlatforms(worldLayer)

        this.physics.add.collider(this.stars, worldLayer)

        //This tells Phaser to check for an overlap between the player and any star in the stars Group
        this.physics.add.overlap(this.swordHero.sprite, this.stars, (_, star) => {
            star.disableBody(true, true);

            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);

            //We use a Group method called countActive to see how many this.stars are left alive
            if (this.stars.countActive(true) === 0) {
                //enableBody(reset, x, y, enableGameObject, showGameObject)
                this.stars.children.iterate(child => child.enableBody(true, child.x, PLAYER_START_POS.y, true, true));
                let x = this.numberBetween(PLAYER_START_POS.x, PLAYER_START_POS.x + 300);

                let bomb = this.bombs.create(x, PLAYER_START_POS.y, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(false);
                bomb.setVelocity(this.numberBetween(-200, 200), 20);
            }
        });

        this.physics.add.collider(this.bombs, worldLayer);

        this.physics.add.collider(this.swordHero.sprite, this.bombs, (p, _) => {
            this.swordHero.die();
        });

        this.wasps.forEach(w => {
            const wasp = w.enemy

            this.physics.add.collider(this.swordHero.sprite, wasp.sprite, (p, _) => {
                this.swordHero.die()
            })

            if (w.tweencfg) { this.tweens.add({ ...w.tweencfg, targets: wasp }) }
            wasp.setOnDeath(() => this.explosion.explode(wasp.x, wasp.y, 3, 3))
            this.swordHero.handleAttackingEnemy(wasp.sprite, wasp.die.bind(wasp))
        })

        this.crabs.forEach(c => {
            const crab = c.enemy
            this.physics.add.collider(crab.sprite, worldLayer)

            this.physics.add.collider(this.swordHero.sprite, crab.sprite, (p, _) => {
                this.swordHero.die()
            })

            if (c.tweencfg) { this.tweens.add({ ...c.tweencfg, targets: crab }) }
            crab.setOnDeath(() => this.explosion.explode(crab.x, crab.y, 3, 3))
            this.swordHero.handleAttackingEnemy(crab.sprite, crab.die.bind(crab))
        })

        /* Si el jugador toca un objeto de la capa 'death' este muere */
        this.physics.add.overlap(deathLayer, this.swordHero.sprite, this.swordHero.die, (_w, tile) => {
            return this.swordHero.checkHazard(tile)
        }, this.swordHero)

        /* MANEJO DE CAMARA ----------------------------------------------------------------------------------------------------------- */

        // configure camera to follow player sprite
        this.camera = new Camera(this)
        this.camera.init({ 
            playerSprite: this.swordHero.sprite, 
            x: this.swordHero.sprite.x , 
            y: CAMERA_POS.y ,
            followHorizontal: true,
            followVertical: false
        })
    }


    update() {
        if (this.swordHero.isAlive()) {
            this.camera.update()
            this.swordHero.update()
            this.bg.update(this.swordHero.body.velocity.x, 0) // dont update background in Y axis
        }

        /* Si el jugador se cae al fondo, entonces muere y reiniciamos el juego */
        if (this.swordHero.y > ABYSS_LIMIT) {
            this.swordHero.setPosition(0, ABYSS_LIMIT - 100)
            this.swordHero.die()
        }


        this.debugText.setText(`X: ${Math.round(this.swordHero.x)} ; Y: ${Math.round(this.swordHero.y)}, 
p1x: ${Math.round(this.input.pointer1.x)} ; p2x: ${Math.round(this.input.pointer2.x)}
acx: ${Math.round(this.swordHero.body.acceleration.x)} ; acy: ${Math.round(this.swordHero.body.acceleration.y)},
vx: ${Math.round(this.swordHero.velocity.x)} ; vy: ${Math.round(this.swordHero.velocity.y)},
blockedDown: ${this.swordHero.blockedDown()}
canSpin: ${this.swordHero.canSpin}`)
    }
}
