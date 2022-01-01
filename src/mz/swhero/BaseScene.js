// @ts-check

import Phaser from 'phaser'
import AssetLoader from './AssetLoader'

const WORLD_DIMS = { worldWidth: 0, worldHeight: 0, half_worldWidth: 0, half_worldHeight: 0 }

export default class BaseScene extends Phaser.Scene {
    static profile = 'production'

    /**
     * Crea una escena base
     * @param {string} sceneName Nombre de escena
     */
    constructor(sceneName) {
        super(sceneName)
        window.scene = this
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
        AssetLoader.loadFor(this, 'HeroSprites', () => {
            // load sword hero sprites ; dimensions 350 × 666 ; 7 imgs horizontal & 18 imgs vertical
            this.load.spritesheet('sword_hero', 'assets/sword_hero.png', { frameWidth: 50, frameHeight: 37 })
        })

        AssetLoader.loadFor(this, 'ForestMapSprites', () => {
            /* this.load.image('main_map', 'assets/main_map_tiles.png')
            this.load.tilemapTiledJSON('main_map', 'assets/main_map.json')
            WE DO NOT NEED THIS MAP YET...*/
        })
    }

    create() {
        // do nothing by default
    }

    update() {
        // do nothing by default     
    }

    /**
     * Calcula un numero aleatorio entre dos limites
     * @param {number} lowBound Limite inferior
     * @param {number} upBound Limite superior
     * @returns {number} Numero aleatorio
     */
    numberBetween(lowBound, upBound) {
        return (Math.random() * (upBound - lowBound) + lowBound)
    }

    /**
     * Shuts down current scene and starts next scene
     * @param {string} sceneKey Scene id
     */
    startAnotherScene(sceneKey) {
        this.scene.start(sceneKey)
    }
}
