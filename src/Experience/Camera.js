import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {     
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.debug = this.experience.debug

         // Debug
         if(this.debug.active)
         {
             this.debugFolder = this.debug.ui.addFolder('camera')
         }
        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(32, 16, 32)
        // this.debugFolder.add(this.instance.position, 'x').name('PosCamX').min(0).max(64).step(8);
        // this.debugFolder.add(this.instance.position, 'y').name('PosCamY').min(0).max(64).step(8);
        // this.debugFolder.add(this.instance.position, 'z').name('PosCamZ').min(0).max(64).step(8);

        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.minDistance = 4
        this.controls.maxDistance = 32
        this.controls.enablePan = true
        this.controls.enableZoom = true 
        this.controls.minPolarAngle = Math.PI * 0.5 - 1
        this.controls.maxPolarAngle = Math.PI * 0.5
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}