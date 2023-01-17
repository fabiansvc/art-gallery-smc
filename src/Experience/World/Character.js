import * as THREE from 'three'
import Experience from '../Experience.js'
import * as CANNON from 'cannon-es'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils'

export default class Character {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.turn = true
        this.idle = false

        // Resource
        this.resource = this.resources.items.characterModel
        this.setModel()

        // Animation
        this.setAnimation()
    }

    setModel() {
        this.characters = {}
        for (let index = 0; index < 16; index++) {
            this.characters[`character${index}`] = SkeletonUtils.clone(this.resource.scene)
            this.characters[`character${index}`].position.set(0, 0.05, index + 8)
            this.scene.add(this.characters[`character${index}`])            
        }        
    }

    setAnimation() {
        this.animation = {}

        this.animation.mixer = {}
        // Mixer
        for (let index = 0; index < 16; index++) {
            this.animation.mixer[`character${index}`] = new THREE.AnimationMixer(this.characters[`character${index}`])                
        }   

        // Actions
        this.animation.actions = {}

        for (let index = 0; index < 16; index++) {
            this.animation.actions[`idle-character${index}`] =  this.animation.mixer[`character${index}`].clipAction(this.resource.animations[2])
            this.animation.actions[`walking-character${index}`] =  this.animation.mixer[`character${index}`].clipAction(this.resource.animations[6])
            this.animation.actions[`idle-character${index}`].play()
        }  

        // Play the action

        this.animation.play = (current, next) => {
            const fadeDuration = 0.2
            const newAction = this.animation.actions[next]
            const oldAction = this.animation.actions[current]

            oldAction.fadeOut(fadeDuration)
            newAction.reset().fadeIn(fadeDuration).play();
        }

       
    }
    
    turns(character){
        if(this.turn)
            this.animation.play(`idle-${character}`, `walking-${character}`)
            this.turn = false        

        if(this.characters[character].position.z > 4){
            console.log(this.characters[character].position.z );
            this.characters[character].position.z -= 0.02
        }else{
           this.idle = true            
        }

        if(this.idle){
            console.log("entro");
            this.animation.play(`walking-${character}`, `idle-${character}`)
            this.idle = false
        }
    }

    update() {
        for (let index = 0; index < 16; index++) {
            this.animation.mixer[`character${index}`].update(this.time.delta * 0.001)
        }

        this.turns(`character0`)      
    }

}




