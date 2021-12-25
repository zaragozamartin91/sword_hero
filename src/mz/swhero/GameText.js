
class GameText {
    /**
     * Crea texto ajustable para mostrar estadisticas del juego
     * @param {Phaser.Scene} scene Escena de juego
     */
    constructor(scene) {
        this.scene = scene;
    }

    get width() {
        return this.text.width
    }

    get height() {
        return this.text.height
    }

    /**
     * Initializes game text object
     * @param {number} x PosX
     * @param {number} y PosY
     * @param {string} value Initial text
     * @param {Phaser.Types.GameObjects.Text.TextStyle} cfg Text config
     */
    init(x, y, value, cfg = { fontSize: '28px', fill: '#000' }) {
        this.text = this.scene.add.text(x, y, value, cfg);
        this.text.scrollFactorX = 0;
        this.text.scrollFactorY = 0;
        this.text.setDepth(1)
    }

    setPosition(x, y, z=0) {
        this.text.setPosition(x, y)
    }

    setText(value) { this.text.setText(value); }
}

export default GameText;