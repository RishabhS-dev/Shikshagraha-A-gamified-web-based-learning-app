import * as Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Sprites
    this.load.image(
      'player',
      'https://labs.phaser.io/assets/sprites/blue_ball.png'
    )
    this.load.image(
      'enemy',
      'https://labs.phaser.io/assets/sprites/red_ball.png'
    )

    // 🔊 SOUNDS (VERY SMALL, SAFE)
    this.load.audio(
      'shoot',
      'https://labs.phaser.io/assets/audio/SoundEffects/pistol.wav'
    )
    this.load.audio(
      'hit',
      'https://labs.phaser.io/assets/audio/SoundEffects/explosion.mp3'
    )
  }

  create() {
    this.scene.start('GameScene')
  }
}
