// @ts-check

import GameText from "./GameText"

export default class Healthbar {
    /** @type{Phaser.Scene} Game scene */   scene = null
    /** @type{GameText} game text */        text = null
    /** @type{number} */                    maxHealth = 0

    /**
     * Crea un objeto de tipo jugador
     * @param {Phaser.Scene} scene Escena del juego
     */
    constructor(scene) {
        this.scene = scene
        this.text = new GameText(scene)
    }

    /**
     * Sets player max health
     * @param {number} mh Max health
     * @returns {Healthbar} this
     */
    setMaxHealth(mh) {
        this.maxHealth = mh
        return this
    }

    /**
     * Initializes health bar
     * @param {number} x PosX
     * @param {number} y PosY
     * @returns {Healthbar} this
     */
    init(x, y) {
        this.text.init(x, y, 'Health:')
        return this
    }

    /**
     * Updates healthbar view
     * @param {number} damage Current damage
     */
    update(damage) {
        const remainingHealth = Math.max(this.maxHealth - damage, 0)
        const suffix = ' ♥ '.repeat(remainingHealth)
        this.text.setText(`Health:${suffix}`)
    }
}