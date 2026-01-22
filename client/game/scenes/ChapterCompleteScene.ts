import * as Phaser from 'phaser'

export class ChapterCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterCompleteScene' })
  }

  create() {
    // Background
    this.cameras.main.setBackgroundColor('#05070c')

    // Retro scanline effect
    const scanlines = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.15
    )

    this.tweens.add({
      targets: scanlines,
      alpha: { from: 0.1, to: 0.25 },
      duration: 120,
      yoyo: true,
      repeat: -1
    })

    // Title
    const title = this.add.text(
      this.scale.width / 2,
      120,
      'CHAPTER COMPLETE',
      {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#00ffcc'
      }
    ).setOrigin(0.5)

    // Flicker animation
    this.tweens.add({
      targets: title,
      alpha: { from: 0.7, to: 1 },
      duration: 200,
      yoyo: true,
      repeat: -1
    })

    // Stats (mock for now – backend later)
    const stats = [
      'WAVES CLEARED: 3',
      'BOSS DEFEATED',
      'ACCURACY: CALCULATING...',
      'TIME: CALCULATING...'
    ]

    stats.forEach((text, i) => {
      const t = this.add.text(
        this.scale.width / 2,
        220 + i * 40,
        text,
        {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#ffffff'
        }
      ).setOrigin(0.5)

      this.tweens.add({
        targets: t,
        alpha: { from: 0, to: 1 },
        delay: i * 300,
        duration: 400
      })
    })

    // Continue prompt
    const prompt = this.add.text(
      this.scale.width / 2,
      this.scale.height - 120,
      'CLICK TO CONTINUE',
      {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffaa00'
      }
    ).setOrigin(0.5)

    this.tweens.add({
      targets: prompt,
      alpha: { from: 0.3, to: 1 },
      duration: 600,
      yoyo: true,
      repeat: -1
    })

    // Input
    this.input.once('pointerdown', () => {
      // Return control to React (roadmap / dashboard)
      window.dispatchEvent(new Event('CHAPTER_COMPLETE'))
    })
  }
}
