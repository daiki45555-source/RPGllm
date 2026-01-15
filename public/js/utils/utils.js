export class Utils {
    /**
     * Wait for a specified number of milliseconds
     * @param {number} ms 
     * @returns {Promise<void>}
     */
    static wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get a random integer between min and max (inclusive)
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Pick a random element from an array
     * @param {Array} arr 
     * @returns {*}
     */
    static randomChoice(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Linear interpolation
     * @param {number} start 
     * @param {number} end 
     * @param {number} amt 
     * @returns {number}
     */
    static lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
}
