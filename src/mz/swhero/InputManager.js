// @ts-check

import ActionButton from "./ActionButton"


export default class InputManager {
    /** @type{Phaser.Types.Input.Keyboard.CursorKeys} */    cursors

    /** @type{boolean} */                                   leftPress = false
    /** @type{boolean} */                                   rightPress = false
    /** @type{boolean} */                                   jumpPress = false
    /** @type{boolean} */                                   attackPress = false

    /** @type{ActionButton} */                              leftButton
    /** @type{ActionButton} */                              rightButton
    /** @type{ActionButton} */                              aButton
    /** @type{ActionButton} */                              bButton


    /**
     * Escena de juego
     * @param {Phaser.Scene} scene Phaser Scene
     */
    constructor(scene) {
        this.scene = scene
    }

    /** Obtiene el manejador del puntero tactil */
    get pointer1() { return this.scene.input.pointer1 }

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
        // initialize game action buttons
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
        this.cursors = this.scene.input.keyboard.createCursorKeys()
    }

    get currentInput() {
        return InputValue.parse(
            this.checkLeftPress(),
            this.checkRightPress(),
            this.checkAttackPress(),
            this.checkJumpPress()
        )
    }
}

export class InputValue {
    /** @type{string} Direction input */    dir
    /** @type{string} Action input */       action

    /**
     * Creates input value instance
     * @param {string} dir Direction
     * @param {string} action Action
     */
    constructor(dir = 'NONE', action = 'NONE') {
        this.dir = dir
        this.action = action
    }

    static LEFT = 'LEFT'
    static RIGHT = 'RIGHT'
    static ATTACK = 'ATTACK'
    static JUMP = 'JUMP'
    static NONE = 'NONE'

    /**
     * Parses current input into a normalized value.
     * @param {boolean} leftPress True if LEFT KEY is pressed
     * @param {boolean} rightPress True if RIGHT KEY is pressed
     * @param {boolean} attackPress True if ATTACK KEY is pressed
     * @param {boolean} jumpPress True if JUMP KEY is pressed
     * @returns Parsed input value.
     */
    static parse(leftPress, rightPress, attackPress, jumpPress) {
        return new InputValue(
            rightPress ? this.RIGHT : leftPress ? this.LEFT : this.NONE,
            attackPress ? this.ATTACK : jumpPress ? this.JUMP : this.NONE
        )
    }

    static VOID() {
        return new InputValue('NONE', 'NONE')
    }
}