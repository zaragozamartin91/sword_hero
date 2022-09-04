// @ts-check

const TEMP = { seconds: 0, minutes: 0 }

export default class Stopwatch {
    /** @type{number} */ currTime
    /** @type{number} */ startTime

    /**
     * Creates a new stopwatch instance
     * @param {number} startTime Start time in milliseconds
     */
    constructor(startTime) {
        this.startTime = startTime
        this.currTime = startTime
    }

    /**
     * @param {number} currTime Current time in milliseconds
     */
    update(currTime) {
        this.currTime = currTime
        return this
    }

    toString() {
        TEMP.seconds = Math.round((this.currTime - this.startTime) / 1000) // round seconds
        TEMP.minutes = Math.floor(TEMP.seconds / 60) // compute minutes
        TEMP.seconds = TEMP.seconds - (TEMP.minutes * 60) // reduce seconds

        return `Time: ${TEMP.minutes.toString().padStart(2, '0')}:${TEMP.seconds.toString().padStart(2, '0')}`
    }
}