import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Gallery {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // Resource
        this.resource = this.resources.items.galleryModel

        this.setTextures()
        this.setVerticalImages()
        this.setHorizontalImages()
        this.setMaterial()
        this.setModel()
    }

    setTextures() {
        this.textures = {}
        this.textures.bakedColor = this.resources.items.bakedTexture
        this.textures.bakedColor.flipY = false
        this.textures.bakedColor.encoding = THREE.sRGBEncoding

    }

    setMaterial() {
        this.bakedMaterial = new THREE.MeshBasicMaterial({
            map: this.textures.bakedColor
        })
    }

    setVerticalImages() {
        this.verticalImages = {}
        for (let index = 1; index < 9; index++) {
            this.verticalImages[`v${index}Color`] = this.resources.items[`v${index}ColorTexture`]
            this.verticalImages[`v${index}Color`].flipY = false
            this.verticalImages[`v${index}Color`].encoding = THREE.sRGBEncoding

            this.verticalImages[`v${index}Material`] = new THREE.MeshBasicMaterial({
                map: this.verticalImages[`v${index}Color`]
            })
        }
    }

    setHorizontalImages() {
        this.horizontalImages = {}
        for (let index = 1; index < 8; index++) {
            this.horizontalImages[`h${index}Color`] = this.resources.items[`h${index}ColorTexture`]
            this.horizontalImages[`h${index}Color`].flipY = false
            this.horizontalImages[`h${index}Color`].encoding = THREE.sRGBEncoding

            this.horizontalImages[`h${index}Material`] = new THREE.MeshBasicMaterial({
                map: this.horizontalImages[`h${index}Color`]
            })
        }
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)
        

        this.bakedMesh = this.model.children.find((child) => child.name === 'baked')
        this.bakedMesh.receiveShadow = true
        this.bakedMesh.material = this.bakedMaterial

        for (let index = 1; index < 9; index++) {
            this.model.children.find((child) => child.name === `v${index}`).material = this.verticalImages[`v${index}Material`]
        }

        for (let index = 1; index < 8; index++) {
            this.model.children.find((child) => child.name === `h${index}`).material = this.horizontalImages[`h${index}Material`]
        }

    }
}