import AssetLoader from './AssetLoader'

export default class Preloader {
    /**
     * Preloader base de los assets del juego
     * @param {Phaser.Scene} scene Escena del juego
     */
    constructor(scene) {
        this.scene = scene
    }

    init() {
        AssetLoader.loadFor(this.scene, 'IMAGES', () => {
            // load sword hero sprites ; dimensions 350 × 666 ; 7 imgs horizontal & 18 imgs vertical
            this.scene.load.spritesheet('sword_hero', 'assets/sword_hero.png', { frameWidth: 50, frameHeight: 37 })

            this.scene.load.image('star', 'assets/star.png')
            this.scene.load.image('bomb', 'assets/bomb.png')

            this.scene.load.image('background', 'assets/industrial-background.jpeg') // LOOKS GOOD

            this.scene.load.multiatlas('sparkle', 'assets/sparkle.json', 'assets')
            this.scene.load.multiatlas('explosion', 'assets/explosion.json', 'assets')

            // cargamos la imagen de la avispa
            this.scene.load.multiatlas('wasp', 'assets/wasp.json', 'assets')

            // cargamos la imagen de la avispa
            this.scene.load.multiatlas('crab_walk', 'assets/crab_walk.json', 'assets')

            // cargamos los tiles del map
            this.scene.load.image('main_map', 'assets/main_map_tiles.png')
            this.scene.load.tilemapTiledJSON('main_map', 'assets/main_map.json')

            this.scene.load.image('factory_map', 'assets/factory_tiles.png')
            this.scene.load.tilemapTiledJSON('factory_map', 'assets/factory_map.json')

            // cargamos las imagenes de los botones
            this.scene.load.image('left_btn', 'assets/buttons/left.png')
            this.scene.load.image('right_btn', 'assets/buttons/right.png')
            this.scene.load.image('a_btn', 'assets/buttons/a.png')
            this.scene.load.image('b_btn', 'assets/buttons/b.png')
        })
    }
}
