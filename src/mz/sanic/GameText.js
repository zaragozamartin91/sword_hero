
class GameText {
    /**
     * Crea texto ajustable para mostrar estadisticas del juego
     * @param {Phaser.Scene} scene Escena de juego
     */
    constructor(scene) {
        this.scene = scene;
    }

    init(x, y, value, cfg = { fontSize: '28px', fill: '#000' }) {
        this.text = this.scene.add.text(x, y, value, cfg);
        this.text.scrollFactorX = 0;
        this.text.scrollFactorY = 0;
        this.text.setDepth(1)
    }

    setText(value) { this.text.setText(value); }
}

export default GameText;