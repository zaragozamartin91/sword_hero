export default class CollectableGroup {
    /** @type{Phaser.Scene} scene */            scene
    /** @type{Phaser.Physics.Arcade.Group} */   group
    /** @type{string} */                        spriteKey

    /**
     * @param {Phaser.Scene} scene Phaser game scene
     */
    constructor(scene) {
        this.scene = scene
    }

    /**
     * Initializes collectable group
     * @param {string} spriteKey Sprite key
     * @returns this
     */
    init(spriteKey) {
        this.spriteKey = spriteKey
        this.group = this.scene.physics.add.group()
        return this
    }

    addItem({ x, y }) {
        const item = this.scene.physics.add.sprite(x, y, this.spriteKey)
        this.group.add(item)
        return this
    }

    /**
     * Creates a bunch of collectables
     * @param {Array<{x:number,y:number}} itemPositions collectable positions
     */
    addItems(itemPositions) {
        itemPositions.forEach(it => this.addItem(it))
        return this
    }

    /**
     * Inserts a bunch of items on repeat configuration
     * @param {string} spriteKey Sprite key
     * @param {number} repeatCount Times to repeat
     * @param {number} x X start position
     * @param {number} y Y start position
     * @param {number} stepX X axis step config
     * @returns this
     */
    addItemsOnRepeat(spriteKey, repeatCount, x, y, stepX) {
        this.group = this.scene.physics.add.group({
            key: spriteKey, //texture key to be the star image by default
            repeat: repeatCount, //Because it creates 1 child automatically, repeating 11 times means we'll get 12 in total
            setXY: { x, y, stepX } //this is used to set the position of the 12 children the Group creates. Each child will be placed starting at x: 12, y: 0 and with an x step of 70
        })
        return this
    }

    get children() {
        return this.group.children
    }

    get spriteGroup() {
        return this.group
    }

    /**
     * 
     * @param {(item: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => void} consumer collectable consumer
     */
    iterate(consumer) {
        this.children.iterate(it => consumer(it))
    }

    /**
     * Configures collect / overlap logic
     * @param {Phaser.GameObjects.GameObject} sprite Other sprite
     * @param {(item: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => void} consumer Collectable consumer function
     * @param {Boolean} disableItem True to automatically disable / consume the collectable on overlap
     */
    onCollect(sprite, consumer, disableItem = true) {
        this.scene.physics.add.overlap(sprite, this.spriteGroup, (_, star) => {
            /** @type{Phaser.Types.Physics.Arcade.SpriteWithDynamicBody} */ const s = star
            if (disableItem) s.disableBody(true, true)

            consumer(s)
        })
    }

    /**
     * Counts active or inactive members of the collectable group
     * @param {boolean} active True = count active members ; false = count inactive members
     */
    countActive(active = true) {
        return this.spriteGroup.countActive(active)
    }

    /**
     * Adds collider config to the collectable group
     * @param {Phaser.GameObjects.GameObject} obj Other game object
     */
    collideWith(obj) {
        this.scene.physics.add.collider(this.spriteGroup, obj)
    }
}