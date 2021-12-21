// @ts-check

class Tileset {
    /**
     * Crea un tileset
     * @param {Phaser.Scene} scene Escena de juego
     */
    constructor(scene) {
        this.scene = scene
        this.layers = {}
    }

    /**
     * Inicializa el tileset
     * @param {string} mapKey Clave del mapa
     * @param {string} tilesetName Nombre del tileset
     * @param {string} tilesetKey Clave del tileset [OPCIONAL]
     */
    init(mapKey, tilesetName, tilesetKey = mapKey) {
        this.map = this.scene.make.tilemap({ key: mapKey })
        this.tileset = this.map.addTilesetImage(tilesetName, tilesetKey)
        return this
    }

    /**
     * Crea una capa de tiles para el juego
     * @param {string} layerName Nombre de la capa
     * @param {{x:number, y:number}} offset Offset de posicion
     */
    createLayer(layerName, offset = {x: 0, y: 0}) {
        const layer = this.map.createLayer(layerName, this.tileset, offset.x, offset.y)
        this.layers[layerName] = layer
        return this
    }

    /**
     * Marca ciertos tiles como 'colisionables'
     * @param {string} layerName Nombre de capa
     * @param {any} config Propiedades de colision
     */
    setCollisionByProperty(layerName, config = {}) {
        this.getLayer(layerName).setCollisionByProperty(config)
        return this
    }

    renderDebug(layerName, collideConfig = {red: 255, green: 255, blue: 50, alpha: 255}) {
        const debugGraphics = this.scene.add.graphics().setAlpha(0.5)
        const cc = collideConfig
        this.getLayer(layerName).renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(cc.red, cc.green, cc.blue, cc.alpha),
            faceColor: new Phaser.Display.Color(0, 255, 0, 255)
        })
        return this
    }

    /**
     * @param {string} layerName
     * @returns {Phaser.Tilemaps.TilemapLayer}
     */
    getLayer(layerName) {
        return this.layers[layerName]
    }
}

export default Tileset
