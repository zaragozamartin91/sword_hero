// @ts-check

import Phaser from 'phaser'
import ActionButton from './ActionButton'
import StaticEnemy from './StaticEnemy'


const WORLD_DIMS = { worldWidth: 0, worldHeight: 0, half_worldWidth: 0, half_worldHeight: 0 }

class BaseScene extends Phaser.Scene {
    /**
     * Crea una escena base
     * @param {string} sceneName Nombre de escena
     */
    constructor(sceneName) {
        super(sceneName)

        this.leftButton = new ActionButton(this, 'left_btn')
        this.rightButton = new ActionButton(this, 'right_btn')
        this.aButton = new ActionButton(this, 'a_btn')
        this.bButton = new ActionButton(this, 'b_btn')

        // Control actions for character
        this.leftPress = false
        this.rightPress = false
        this.jumpPress = false
        this.attackPress = false
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

    /** Obtiene el manejador del puntero tactil */
    get pointer1() { return this.input.pointer1 }

    /** Obtiene el manejador de teclado */
    get cursors() {
        //Phaser has a built-in Keyboard manager 
        //This populates the cursors object with four properties: up, down, left, right, that are all instances of Key objects. 
        return this.cs
    }

    createKeyboardCursorKeys() {
        //Phaser has a built-in Keyboard manager 
        //This populates the cursors object with four properties: up, down, left, right, that are all instances of Key objects. 
        console.log('Creating keyboard cursor keys') 
        this.cs = this.input.keyboard.createCursorKeys()
    }

    checkLeftPress() {
        return this.cursors.left.isDown || this.leftPress
        // return this.cursors.left.isDown || (this.pointer1.isDown && this.pointer1.x <= this.half_worldWidth)
    }

    checkRightPress() {
        return this.cursors.right.isDown || this.rightPress
        // return this.cursors.right.isDown || (this.pointer1.isDown && this.pointer1.x > this.half_worldWidth)
    }

    checkJumpPress() {
        return this.cursors.up.isDown || this.jumpPress
        // return this.cursors.up.isDown || (this.pointer1.isDown && this.pointer1.y < this.half_worldHeight)
    }

    checkAttackPress() {
        return this.cursors.space.isDown || this.attackPress
        // return this.cursors.up.isDown || (this.pointer1.isDown && this.pointer1.y < this.half_worldHeight)
    }

    preload() { throw new Error('Not implemented') }

    create() {
        this.createKeyboardCursorKeys()

        this.leftButton.init()
            .setPosition({ x: this.leftButton.displayWidth * 0.6, y: WORLD_DIMS.worldHeight - this.leftButton.displayHeight })
            .pointerdown((pointer, localX, localY) => {
                console.log(pointer, localX, localY)
                this.leftPress = true
            })
            .pointerup(() => this.leftPress = false)
            .pointerout(() => this.leftPress = false)

        this.rightButton.init()
            .setPosition({ x: this.rightButton.displayWidth * 1.65, y: WORLD_DIMS.worldHeight - this.rightButton.displayHeight })
            .pointerdown(() => { console.log('right!'); this.rightPress = true })
            .pointerup(() => this.rightPress = false)
            .pointerout(() => this.rightPress = false)

        this.aButton.init()
            .setPosition({ x: WORLD_DIMS.worldWidth - (this.aButton.displayWidth * 1.65), y: WORLD_DIMS.worldHeight - this.aButton.displayHeight })
            .pointerdown(() => this.jumpPress = true)
            .pointerup(() => this.jumpPress = false)
            .pointerout(() => this.jumpPress = false)

        this.bButton.init()
            .setPosition({ x: WORLD_DIMS.worldWidth - this.bButton.displayWidth * 0.6, y: WORLD_DIMS.worldHeight - this.bButton.displayHeight })
            .pointerdown(() => this.attackPress = true)
            .pointerup(() => this.attackPress = false)
            .pointerout(() => this.attackPress = false)
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
}


export default BaseScene;
