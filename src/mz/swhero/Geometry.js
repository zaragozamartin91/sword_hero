export default class Geometry {

    /**
     * Creates a rectangle using sprite coordinates
     * @param {number} centerX Sprite center X coordinate
     * @param {number} centerY Sprite center Y coordinate
     * @param {number} width Sprite OR body width
     * @param {number} height Sprite OR body height
     * @returns New Phaser rectangle
     */
    static rectangle(centerX, centerY, width, height) {
        return new Phaser.Geom.Rectangle(
            centerX - width / 2, centerY - height / 2, width, height
        )
    }
}