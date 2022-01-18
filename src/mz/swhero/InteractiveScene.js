// @ts-check

import InputManager from './InputManager'
import AssetLoader from './AssetLoader'
import BaseScene from './BaseScene'
import GameText from './GameText'
import Healthbar from './Healthbar'

/**
 * Defines a scene where the player may control the main character sprite
 */
export default class InteractiveScene extends BaseScene {
    /** @type{InputManager} Handles player's inputs */  inputManager
    /** @type{number} Player's score */                 score
    /** @type{GameText} Score text display */           scoreText
    /** @type{GameText} Debug text display */           debugText
    /** @type{Healthbar} Player's health bar */         healthbar

    /**
     * Creates an interactive scene
     * @param {string} sceneName Scene key/name
     */
    constructor(sceneName) {
        super(sceneName)
        this.inputManager = new InputManager(this)

        this.score = 0
        this.scoreText = new GameText(this)
        this.healthbar = new Healthbar(this)
        this.debugText = new GameText(this)
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
        this.debugText.init(0, 64, '')

        // resetting score
        this.score = 0
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
}
