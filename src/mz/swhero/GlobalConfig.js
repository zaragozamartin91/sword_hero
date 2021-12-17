// @ts-check

const gconfig = { profile: 'development' }

class GlobalConfig {

    /**
     * Establece el perfil del juego
     * @param {string} profile Perfil del juego ; ej: development
     */
    static setProfile(profile) {
        gconfig.profile = profile
    }

    /**
     * Determina si el perfil de desarrollo esta activado
     * @returns {boolean} True si el perfil es dev, false en caso contrario
     */
    static devProfile() {
        const p = gconfig.profile.toLowerCase()
        return p == 'dev' || p == 'development'
    }

        /**
     * Determina si el perfil de produccion esta activado
     * @returns {boolean} True si el perfil es prod, false en caso contrario
     */
    static prodProfile() {
        const p = gconfig.profile.toLowerCase()
        return p == 'prod' || p == 'production'
    }
}

export default GlobalConfig