// @ts-check

import GameText from './GameText'
import BaseScene from './BaseScene'


export default class MainMenuScene extends BaseScene {
    /**
     * Crea una escena de juego
     */
    constructor() {
        super('MainMenuScene')
    }


    preload() {
        console.log("PRELOAD")
        super.preload()
    }

    create() {
        console.log("CREATE")
        super.create()

        const { worldWidth, worldHeight, half_worldWidth } = this.worldDims

        const title = new GameText(this)
        title.init(0, 0, 'SWORD HERO', { fontSize: '48px', fill: '#fff', strokeThickness: 1 })
        const titlePos = { x: half_worldWidth - (title.width / 2), y: worldHeight / 2 }
        title.setPosition(titlePos.x, titlePos.y)

        const startBtnText = new GameText(this)
        startBtnText.init(0, 0, 'Start game')
        const startBtnTextPos = { x: half_worldWidth - (startBtnText.width / 2), y: titlePos.y + 100 }
        startBtnText.setPosition(startBtnTextPos.x, startBtnTextPos.y, 1)

        const startBtnDims = { w: startBtnText.width * 1.25, h: startBtnText.height * 1.25 }
        const startBtnPos = { x: startBtnTextPos.x + startBtnText.width / 2, y: startBtnTextPos.y + startBtnText.height / 2 }
        const rectangle = this.add.rectangle(startBtnPos.x, startBtnPos.y, startBtnDims.w, startBtnDims.h, 0xABCDEF, 1)
        rectangle.setInteractive()
        rectangle.on('pointerdown', () => this.startAnotherScene('Scene01'))
    }
}
