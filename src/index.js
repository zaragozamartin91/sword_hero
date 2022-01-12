import Phaser from 'phaser'
import Scene01 from './mz/swhero/Scene01'
import MainMenuScene from './mz/swhero/MainMenuScene'
import BaseScene from './mz/swhero/BaseScene'
import StageCompleteScene from './mz/swhero/StageCompleteScene'

// set to either landscape
if (!navigator.xr && self.isMobile && screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait-primary')
}


const MAX_WIDTH = 1366
const MAX_HEIGHT = 768
const GRAVITY_VAL = 1200


document.onreadystatechange = function () {
    console.log("onreadystatechange CALLED!")
    const profile = BaseScene.getQueryParam('profile', 'production')
    BaseScene.setProfile(profile)
    if (document.readyState === 'complete') {
        document.body.style.overflow = 'hidden' // hiding the scroll bar
        startGame()
    }
}

function startGame() {
    const worldWidth = Math.min(window.innerWidth, MAX_WIDTH);
    const worldHeight = Math.min(window.innerHeight, MAX_HEIGHT);

    BaseScene.setWorldDimensions(worldWidth, worldHeight)
    const physicsDebugEnabled = BaseScene.devProfileEnabled()

    let config = {
        type: Phaser.AUTO,
        width: worldWidth,
        height: worldHeight,
        parent: 'main',
        fullscreenTarget: 'main',
        scene: [MainMenuScene, StageCompleteScene, Scene01],
        physics: {
            default: 'arcade',
            arcade: { gravity: { y: GRAVITY_VAL }, debug: physicsDebugEnabled }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "main"
        },
        input: {
            activePointers: 4
        },
        pixelArt: true
    };

    let game = new Phaser.Game(config);
    console.log("pointers: ", game.input.pointers.length); // 2

}
