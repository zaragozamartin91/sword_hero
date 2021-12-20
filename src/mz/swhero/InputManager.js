// @ts-check

import ActionButton from "./ActionButton"

export default class InputManager {
    /**
     * Escena de juego
     * @param {Phaser.Scene} scene Phaser Scene
     */
    constructor(scene) {
        this.scene = scene
    }

    /** Obtiene el manejador del puntero tactil */
    get pointer1() { return this.scene.input.pointer1 }

    /** Obtiene el manejador de teclado */
    get cursors() {
        //Phaser has a built-in Keyboard manager 
        //This populates the cursors object with four properties: up, down, left, right, that are all instances of Key objects. 
        return this.cs
    }

    checkLeftPress() {
        return this.cursors.left.isDown || this.leftPress
    }

    checkRightPress() {
        return this.cursors.right.isDown || this.rightPress
    }

    checkJumpPress() {
        return this.cursors.up.isDown || this.jumpPress
    }

    checkAttackPress() {
        return this.cursors.space.isDown || this.attackPress
    }

    /**
     * Inicializa el manejador de inputs
     * @param {number} worldWidth Ancho del mundo
     * @param {number} worldHeight Alto del mundo
     */
    init(worldWidth, worldHeight) {
        this.leftButton = new ActionButton(this.scene, 'left_btn')
        this.rightButton = new ActionButton(this.scene, 'right_btn')
        this.aButton = new ActionButton(this.scene, 'a_btn')
        this.bButton = new ActionButton(this.scene, 'b_btn')

        // Control actions for character
        this.leftPress = false
        this.rightPress = false
        this.jumpPress = false
        this.attackPress = false

        this.createKeyboardCursorKeys()

        this.leftButton.init()
            .setPosition({ x: this.leftButton.displayWidth * 0.6, y: worldHeight - this.leftButton.displayHeight })
            .pointerdown((pointer, localX, localY) => {
                console.log(pointer, localX, localY)
                this.leftPress = true
            })
            .pointerup(() => this.leftPress = false)
            .pointerout(() => this.leftPress = false)

        this.rightButton.init()
            .setPosition({ x: this.rightButton.displayWidth * 1.65, y: worldHeight - this.rightButton.displayHeight })
            .pointerdown(() => { console.log('right!'); this.rightPress = true })
            .pointerup(() => this.rightPress = false)
            .pointerout(() => this.rightPress = false)

        this.aButton.init()
            .setPosition({ x: worldWidth - (this.aButton.displayWidth * 1.65), y: worldHeight - this.aButton.displayHeight })
            .pointerdown(() => this.jumpPress = true)
            .pointerup(() => this.jumpPress = false)
            .pointerout(() => this.jumpPress = false)

        this.bButton.init()
            .setPosition({ x: worldWidth - this.bButton.displayWidth * 0.6, y: worldHeight - this.bButton.displayHeight })
            .pointerdown(() => this.attackPress = true)
            .pointerup(() => this.attackPress = false)
            .pointerout(() => this.attackPress = false)
    }

    createKeyboardCursorKeys() {
        //Phaser has a built-in Keyboard manager 
        //This populates the cursors object with four properties: up, down, left, right, that are all instances of Key objects. 
        console.log('Creating keyboard cursor keys')
        this.cs = this.scene.input.keyboard.createCursorKeys()
    }

    get currentInput() {
        const currIn = {}
        if (this.checkRightPress()) {
            currIn.dir = 'RIGHT'
        } else if (this.checkLeftPress()) {
            currIn.dir = 'LEFT'
        } else {
            currIn.dir = 'NONE'
        }

        if (this.checkAttackPress()) {
            currIn.action = 'ATTACK'
        } else if (this.checkJumpPress()) {
            currIn.action = 'JUMP'
        } else {
            currIn.action = 'NONE'
        }

        return currIn
    }
}