//@ts-check

export default class AssetLoader {
    static allAssets = {}

    /**
     * Intenta cargar assets para una escena (en caso que no hayan sido cargados previamente.)
     * @param {Phaser.Scene} scene Objeto Phaser.Scene.
     * @param {String} itemName Clave de assets (ej: 'player')
     * @param {Function} loaderFunction Lambda encargada de cargar los assets.
     */
    static loadFor(scene, itemName, loaderFunction) {
        const sceneKey = scene.scene.key
        
        const sceneIsMissing = AssetLoader.allAssets[sceneKey] === undefined
        if (sceneIsMissing) { AssetLoader.allAssets[sceneKey] = {} }

        const itemIsMissing = AssetLoader.allAssets?.[sceneKey]?.[itemName] === undefined
        if (itemIsMissing) {
            console.log('Loading item ', itemName, ' for scene ', sceneKey)
            loaderFunction()
            AssetLoader.allAssets[sceneKey][itemName] = true
        }
    }
}