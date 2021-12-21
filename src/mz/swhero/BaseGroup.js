// @ts-check

/**
 * staticGroup de elementos.
 */
class BaseGroup {
    /**
     * Crea un grupo de componentes
     * @param {Phaser.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;
    }

    get physics() { return this.scene.physics; }

    /**
     * Obtiene el grupo de plataformas. group y sprite son sinonimos
     */
    get group() { return this.legroup; }

    /**
     * Obtiene el grupo de plataformas. group y sprite son sinonimos
     */
    get sprite() { return this.legroup; }

    /**
     * Inicializa el grupo de plataformas.
     */
    init() {
        /* creo un grupo de cuerpos estaticos con iguales propiedades */
        this.legroup = this.physics.add.staticGroup();
        return this;
    }

    /**
     * Crea sprite y la agrega al grupo de plataformas existentes.
     * @param {string} spriteKey Nombre del sprite del grupo
     * @param {Number} x Posicion x
     * @param {Number} y Posicion y
     * @param {{scaleX:number,scaleY:number}} scale Escala en los ejes x e y.
     * @returns {BaseGroup} this.
     */
    create(spriteKey, x, y, { scaleX, scaleY } = { scaleX: 1, scaleY: 1 }) {
        /* we scale this platform x2 with the function setScale(2) */
        /* The call to refreshBody() is required because we have scaled a static physics body, so we have to tell the physics world about the changes we made */
        const vsx = scaleX || 1;
        const vsy = scaleY || 1;
        this.legroup.create(x, y, spriteKey).setScale(vsx, vsy).refreshBody();
        return this;
    }
}

export default BaseGroup;