import * as Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { BossScene } from './scenes/BossScene'
import { ChapterCompleteScene } from './scenes/ChapterCompleteScene'

scene: [
  BootScene,
  GameScene,
  BossScene,
  ChapterCompleteScene
]

export function startGame() {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    },
    scene: [BootScene, GameScene, BossScene],
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  }

  return new Phaser.Game(config)
}
