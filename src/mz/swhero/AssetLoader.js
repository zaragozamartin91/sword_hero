//@ts-check

/**
 * Keeps track of loaded game assets.
 * Avoid duplicate loading of game assets
 */
export default class AssetLoader {
    static allAssets = {}

    /**
     * Tries to load assets for a game scene (ignores request in case assets were loaded previously)
     * @param {Phaser.Scene} scene Game scene to load assets for.
     * @param {String} itemName Asset key
     * @param {Function} loaderFunction loader function to delegate to in order to load assets
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