// @ts-check

import InputManager from './InputManager'
import AssetLoader from './AssetLoader'
import BaseScene from './BaseScene'
import GameText from './GameText'
import Healthbar from './Healthbar'
import SwordHero from './SwordHero'

const TEMP = { seconds: 0, minutes: 0 }

/**
 * Defines a scene where the player may control the main character sprite
 */
export default class InteractiveScene extends BaseScene {
    /** @type{InputManager} Handles player's inputs */  inputManager
    /** @type{number} Player's score */                 score
    /** @type{GameText} Score text display */           scoreText
    /** @type{GameText} Debug text display */           debugText
    /** @type{GameText} Stage clock text */             clockText
    /** @type{Healthbar} Player's health bar */         healthbar
    /** @type{SwordHero} Hero character */              hero

    /**
     * Creates an interactive scenes
     * @param {string} sceneName Scene key/name
     */
    constructor(sceneName) {
        super(sceneName)
        this.inputManager = new InputManager(this)

        this.score = 0
        this.scoreText = new GameText(this)
        this.healthbar = new Healthbar(this)
        this.clockText = new GameText(this)
        this.debugText = new GameText(this)
        this.hero = new SwordHero(this) // new sword hero object
    }

    preload() {
        // loading interactive game assets
        AssetLoader.loadFor(this, 'Buttons', () => {
            // Loading input button assets
            this.load.image('left_btn', 'assets/buttons/left.png')
            this.load.image('right_btn', 'assets/buttons/right.png')
            this.load.image('a_btn', 'assets/buttons/a.png')
            this.load.image('b_btn', 'assets/buttons/b.png')
        })
    }

    create() {
        this.initInputManager()

        this.scoreText.init(0, 0, 'Score: 0')
        this.healthbar.init(0, 32)
        this.clockText.init(0, 64, 'Time: 00:00')
        this.debugText.init(0, 96, '')

        // resetting score
        this.score = 0
        this.startTime = this.time.now
    }

    /**
     * Initializes game input manager to manipulate main character
     */
    initInputManager() {
        const { worldWidth, worldHeight } = this.worldDims
        this.inputManager.init(worldWidth, worldHeight)
    }

    /**
     * Bumps player score
     * @param {number} value Amount to bump
     */
    bumpScore(value = 10) {
        this.score = this.score + value
        this.scoreText.setText('Score: ' + this.score)
    }

    /**
     * Updates debug text
     * @param {string} text Text to set
     */
    setDebugText(text) {
        this.debugText.setText(text)
    }

    /**
     * @param {number} maxHealth Player max health
     */
    resetHealthBar(maxHealth) {
        this.healthbar.setMaxHealth(maxHealth).update(0)
    }

    /**
     * Updates healthbar status based on accumulated damage
     * @param {number} accDamage Accumulated damage
     */
    updateHealthBar(accDamage) {
        this.healthbar.update(accDamage)
    }

    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} [_delta] The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    update(time, _delta) {
        this.updateClockText(time)
        this.updateDebugText()
    }

    /**
     * @param {number} time Current time in milliseconds
     */
     updateClockText(time) {
        TEMP.seconds = Math.round((time - this.startTime) / 1000) // round seconds
        TEMP.minutes = Math.floor(TEMP.seconds / 60) // compute minutes
        TEMP.seconds = TEMP.seconds - (TEMP.minutes * 60) // reduce seconds
        this.clockText.setText(`Time: ${TEMP.minutes.toString().padStart(2, '0')}:${TEMP.seconds.toString().padStart(2, '0')}`)
    }

    updateDebugText() {
        if (InteractiveScene.devProfileEnabled()) {
            this.setDebugText(`X: ${Math.round(this.hero.x)} ; Y: ${Math.round(this.hero.y)}, 
p1x: ${Math.round(this.input.pointer1.x)} ; p2x: ${Math.round(this.input.pointer2.x)}
acx: ${Math.round(this.hero.body.acceleration.x)} ; acy: ${Math.round(this.hero.body.acceleration.y)},
vx: ${Math.round(this.hero.velocity.x)} ; vy: ${Math.round(this.hero.velocity.y)},
blockedDown: ${this.hero.blockedDown()}
canSpin: ${this.hero.canSpin}`)
        }
    }
}
