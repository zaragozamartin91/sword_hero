// @ts-check

import Phaser from 'phaser'
import InputManager from './InputManager'
import StaticEnemy from './StaticEnemy'
import AssetLoader from './AssetLoader'


const WORLD_DIMS = { worldWidth: 0, worldHeight: 0, half_worldWidth: 0, half_worldHeight: 0 }

export default class BaseScene extends Phaser.Scene {
    /** @type{InputManager} Manejador de inputs de jugador */ inputManager = null

    /**
     * Crea una escena base
     * @param {string} sceneName Nombre de escena
     */
    constructor(sceneName) {
        super(sceneName)
        window.scene = this
        this.inputManager = new InputManager(this)
    }

    /**
     * Establece las dimensiones del mundo
     * @param {number} worldWidth Anchura del mundo
     * @param {number} worldHeight Altura del mundo
     */
    static setWorldDimensions(worldWidth, worldHeight) {
        WORLD_DIMS.worldWidth = worldWidth
        WORLD_DIMS.worldHeight = worldHeight
        WORLD_DIMS.half_worldWidth = worldWidth / 2
        WORLD_DIMS.half_worldHeight = worldHeight / 2
    }

    static getWorldDimensions() {
        const { worldWidth, worldHeight, half_worldWidth, half_worldHeight } = WORLD_DIMS
        return { worldWidth, worldHeight, half_worldWidth, half_worldHeight }
    }

    get worldDims() {
        return BaseScene.getWorldDimensions()
    }

    preload() {
        // loading common game assets
        AssetLoader.loadFor(this, 'IMAGES', () => {
            // load sword hero sprites ; dimensions 350 × 666 ; 7 imgs horizontal & 18 imgs vertical
            this.load.spritesheet('sword_hero', 'assets/sword_hero.png', { frameWidth: 50, frameHeight: 37 })

            this.load.image('star', 'assets/star.png')
            this.load.image('bomb', 'assets/bomb.png')

            this.load.image('background', 'assets/industrial-background.jpeg') // LOOKS GOOD

            this.load.multiatlas('sparkle', 'assets/sparkle.json', 'assets')
            this.load.multiatlas('explosion', 'assets/explosion.json', 'assets')

            // cargamos la imagen de la avispa
            this.load.multiatlas('wasp', 'assets/wasp.json', 'assets')

            // cargamos la imagen de la avispa
            this.load.multiatlas('crab_walk', 'assets/crab_walk.json', 'assets')

            // cargamos los tiles del map
            this.load.image('main_map', 'assets/main_map_tiles.png')
            this.load.tilemapTiledJSON('main_map', 'assets/main_map.json')

            this.load.image('factory_map', 'assets/factory_tiles.png')
            this.load.tilemapTiledJSON('factory_map', 'assets/factory_map.json')

            // cargamos las imagenes de los botones
            this.load.image('left_btn', 'assets/buttons/left.png')
            this.load.image('right_btn', 'assets/buttons/right.png')
            this.load.image('a_btn', 'assets/buttons/a.png')
            this.load.image('b_btn', 'assets/buttons/b.png')
        })
    }

    create() {
        const { worldWidth, worldHeight } = BaseScene.getWorldDimensions()
        this.inputManager.init(worldWidth, worldHeight)
    }

    update() { throw new Error('Not implemented') }

    /**
     * Calcula un numero aleatorio entre dos limites
     * @param {number} lowBound Limite inferior
     * @param {number} upBound Limite superior
     * @returns {number} Numero aleatorio
     */
    numberBetween(lowBound, upBound) {
        return (Math.random() * (upBound - lowBound) + lowBound)
    }

    /* Crea una nueva instancia de StaticEnemy para una avispa */
    newWasp() {
        return new StaticEnemy(this, { key: 'wasp', prefix: 'wasp_', suffix: '.png', start: 1, end: 37, animDurationMs: 2000 })
    }

    /** Crea una nueva instancia de StaticEnemy para un cangrejo */
    newCrab() {
        return new StaticEnemy(this, { key: 'crab_walk', prefix: 'crab_', suffix: '.png', start: 8, end: 18, animDurationMs: 2000, scale: 0.5 })
    }

    startAnotherScene(sceneKey) {
        this.scene.start(sceneKey)
    }
}
