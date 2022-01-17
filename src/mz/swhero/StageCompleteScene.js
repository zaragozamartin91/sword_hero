// @ts-check

import GameText from './GameText'
import BaseScene from './BaseScene'


export default class StageCompleteScene extends BaseScene {
    constructor() {
        super('StageCompleteScene')
    }

    /**
     * @param {{ score: number, maxScore: number }} [data] Stage completion information
     */
    create(data) {
        console.log("CREATE")
        super.create()

        const { half_worldHeight, half_worldWidth } = this.worldDims

        const title = new GameText(this)
        title.init(0, 0, 'STAGE COMPLETE!', { fontSize: '48px', fill: '#fff', strokeThickness: 1 })
        const titlePos = { x: half_worldWidth - (title.width / 2), y: half_worldHeight }
        title.setPosition(titlePos.x, titlePos.y)

        // add stage completion % info

        const {score, maxScore} = data

        const scoreText = new GameText(this)
        scoreText.init(0, 0, `Total Score: ${score}`, { fontSize: '32px', fill: '#fff', strokeThickness: 1 })
        const scoreTextPos = { x: titlePos.x, y: titlePos.y + title.height }
        scoreText.setPosition(scoreTextPos.x, scoreTextPos.y)

        const perc = Math.round(100 * score / maxScore)
        const completionText = new GameText(this)
        completionText.init(0, 0, `Completion %: ${perc}`, { fontSize: '32px', fill: '#fff', strokeThickness: 1 })
        const completionTextPos = { x: scoreTextPos.x, y: scoreTextPos.y + scoreText.height }
        completionText.setPosition(completionTextPos.x, completionTextPos.y)
    }
}
