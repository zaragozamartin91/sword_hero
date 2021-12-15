import Phaser from 'phaser'
import Scene01 from './mz/sanic/Scene01'
import GlobalConfig from './mz/sanic/GlobalConfig'

// set to either landscape
if (!navigator.xr && self.isMobile && screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait-primary')
}


const MAX_WIDTH = 1024
const MAX_HEIGHT = 768
const GRAVITY_VAL = 1200


document.onreadystatechange = function () {
    console.log("onreadystatechange CALLED!")
    if (document.readyState === 'complete') {
        console.log('DOM is ready.')

        console.log('Fetching configuration')

        httpGetAsync('/config', responseText => {
            const config = JSON.parse(responseText)
            console.log('Configuration is ', config)
            GlobalConfig.setProfile(config.profile)
            startGame()
        })
    }
};

function httpGetAsync(theUrl, callback) {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) callback(xmlHttp.responseText)
    }
    xmlHttp.open("GET", theUrl, true) // true for asynchronous 
    xmlHttp.send(null)
}


function startGame() {
    const worldWidth = Math.min(window.innerWidth, MAX_WIDTH);
    const worldHeight = Math.min(window.innerHeight, MAX_HEIGHT);

    Scene01.setWorldDimensions(worldWidth, worldHeight)

    const physicsDebug = GlobalConfig.devProfile()

    let config = {
        type: Phaser.AUTO,
        width: worldWidth,
        height: worldHeight,
        parent: 'main',
        scene: [Scene01],
        physics: {
            default: 'arcade',
            arcade: { gravity: { y: GRAVITY_VAL }, debug: physicsDebug }
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
