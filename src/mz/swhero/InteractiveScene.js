// @ts-check

import InputManager from './InputManager'
import AssetLoader from './AssetLoader'
import BaseScene from './BaseScene'

/**
 * Defines a scene where the player may control the main character sprite
 */
export default class InteractiveScene extends BaseScene {
    /** @type{InputManager} Handles player's inputs */ inputManager = null

    /**
     * Creates an interactive scene
     * @param {string} sceneName Scene key/name
     */
    constructor(sceneName) {
        super(sceneName)
        this.inputManager = new InputManager(this)
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
    }

    /**
     * Initializes game input manager to manipulate main character
     */
    initInputManager() {
        const { worldWidth, worldHeight } = this.worldDims
        this.inputManager.init(worldWidth, worldHeight)
    }
}
