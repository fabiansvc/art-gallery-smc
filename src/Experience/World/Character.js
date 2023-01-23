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

        this.resource = this.resources.items.characterModel
        this.status = true

        // Random
        this.setRandoms()

        // Model     
        this.setModel()

        // Animation
        this.setAnimation()

        // Turns
        this.setTurns()
    }

    setModel() {
        this.characters = {}
        for (let index = 0; index < 16; index++) {
            this.characters[`character${index}`] = SkeletonUtils.clone(this.resource.scene)
            this.characters[`character${index}`].position.set(0, 0.05, index + 8)
            this.scene.add(this.characters[`character${index}`])            
        }        
    }

    setRandoms(){
        this.clients = {}

        this.clients["1"] = {
            "arrival": 5,
            "wait": 5,
            "entry": 10,
            "exit": 6
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

    setTurns(){
        this.turns = {}
        this.idle = {}
        this.walking = {}
        this.movement = {}

        for (let index = 0; index < 16; index++) {
            this.turns[`character${index}`] = false
            this.idle[`character${index}`] = false
            this.walking[`character${index}`] = false
            this.movement[`character${index}`] = false
        }  

        this.turns[`character0`] = true
        this.idle[`character0`] = false
        this.walking[`character0`] = true
        this.movement[`character0`] = false
    }

    
    turn(character, posZ){
            if(this.walking[character]){
                this.animation.play(`idle-${character}`, `walking-${character}`)
                this.walking[character] = false    
                this.movement[character] = true            
            } 

            if(this.movement[character]){
                if(this.characters[character].position.z > posZ){                
                    this.characters[character].position.z -= 0.02
                }else{
                    this.idle[character] = true    
                    this.movement[character] = false        
                }      
            }               

            if(this.idle[character]){               
                this.animation.play(`walking-${character}`, `idle-${character}`)
                this.idle[character] = false
                return true
            }                   
    }

    star(){       
            if(this.turns[`character0`]){
                if(this.turn(`character0`, 4)){                     
                    this.turns[`character0`] = false
                    this.turns[`character1`] = true
                    this.idle[`character1`] = false
                    this.walking[`character1`] = true
                    this.movement[`character1`] = false
                    this.status = false
                }
            }   
        
    }

    line(i){
        for (let index = i; index < 16; index++) {            
            if(this.turns[`character${index}`]){
                if(this.turn(`character${index}`, index + 7)){ 
                    this.turns[`character${index}`] = false
                
                    this.turns[`character${index+1}`] = true                
                    this.idle[`character${index+1}`] = false
                    this.walking[`character${index+1}`] = true
                    this.movement[`character${index+1}`] = false
                }
            }               
        }
    }

    update() {
        for (let index = 0; index < 16; index++) {
            this.animation.mixer[`character${index}`].update(this.time.delta * 0.001)
        }

        if(this.status){
            this.star()
        }else{
            this.line(1)
        }

        if(this.time.seconds === this.clients["1"].arrival){
            console.log("ingreso");
        }
    }

}




