import * as Phaser from 'phaser'

enum GamePhase {
  PLAYING,
  MCQ,
  BOSS
}

export class GameScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite
  enemies!: Phaser.Physics.Arcade.Group
  bullets!: Phaser.Physics.Arcade.Group
  powerUps!: Phaser.Physics.Arcade.Group

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keys!: any

  phase: GamePhase = GamePhase.PLAYING
  wave = 1
  enemiesPerWave = 5
  waveCleared = false
  MAX_WAVES = 3

  health = 100
  healthBar!: Phaser.GameObjects.Graphics
  waveText!: Phaser.GameObjects.Text
  feedback!: Phaser.GameObjects.Text

  stars!: Phaser.GameObjects.Group

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    /** BACKGROUND **/
    this.cameras.main.setBackgroundColor('#0b0f14')
    this.createStars()

    /** PLAYER **/
    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height / 2,
      'player'
    )
    this.player.setTint(0x00ffcc)
    this.player.setCollideWorldBounds(true)

    /** INPUT **/
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('W,A,S,D')

    /** GROUPS **/
    this.enemies = this.physics.add.group()
    this.bullets = this.physics.add.group({ maxSize: 50 })
    this.powerUps = this.physics.add.group()

    /** UI **/
    this.healthBar = this.add.graphics()
    this.waveText = this.add.text(20, 48, '', {
      fontFamily: 'monospace',
      color: '#00ffcc'
    })

    this.feedback = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      '',
      { fontFamily: 'monospace', fontSize: '22px' }
    ).setOrigin(0.5).setAlpha(0)

    this.drawHealth()
    this.updateWaveText()

    /** COLLISIONS **/
    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, undefined, this)
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer, undefined, this)
    this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, undefined, this)

    /** SHOOT **/
    this.input.on('pointerdown', this.shoot)

    /** MCQ RESULT (ONLY ONCE) **/
    window.addEventListener('MCQ_RESULT', (e: any) => {
      this.afterMCQ(e.detail)
    })

    /** START **/
    this.spawnWave()
  }

  /* ---------------- WAVE LOGIC ---------------- */

  spawnWave() {
    this.phase = GamePhase.PLAYING
    this.waveCleared = false
    this.updateWaveText()

    const count = this.enemiesPerWave + this.wave
    for (let i = 0; i < count; i++) {
      const enemy = this.enemies.create(
        Phaser.Math.Between(40, this.scale.width - 40),
        Phaser.Math.Between(40, this.scale.height - 40),
        'enemy'
      ) as Phaser.Physics.Arcade.Sprite

      enemy.setTint(0xff3366)
      enemy.setData('speed', 70 + this.wave * 10)
      enemy.setAlpha(0)

      this.tweens.add({
        targets: enemy,
        alpha: 1,
        scale: { from: 0.5, to: 1 },
        duration: 300
      })
    }
  }

  handleWaveEnd() {
    this.phase = GamePhase.MCQ
    this.showFeedback('QUIZ TIME', '#ffaa00')

    if (this.wave % 2 === 0) {
      const p = this.powerUps.create(
        Phaser.Math.Between(80, this.scale.width - 80),
        Phaser.Math.Between(80, this.scale.height - 80),
        'player'
      )
      p.setTint(0x00ffff)
      p.setScale(0.5)
    }

    window.dispatchEvent(new Event('SHOW_MCQ'))
  }

  afterMCQ(correct: boolean) {
    this.wave++
    this.showFeedback(correct ? 'CORRECT!' : 'WRONG!', correct ? '#00ff00' : '#ff4444')

    if (this.wave > this.MAX_WAVES) {
      this.scene.start('BossScene')
      return
    }

    this.time.delayedCall(800, () => this.spawnWave())
  }

  /* ---------------- COMBAT ---------------- */

  shoot = (p: Phaser.Input.Pointer) => {
    const bullet = this.bullets.get(
      this.player.x,
      this.player.y
    ) as Phaser.Physics.Arcade.Sprite

    if (!bullet) return

    bullet.setActive(true)
    bullet.setVisible(true)
    bullet.setScale(0.25)
    bullet.setTint(0xffff00)

    this.physics.velocityFromRotation(
      Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        p.worldX,
        p.worldY
      ),
      500,
      bullet.body!.velocity
    )

    this.sound.play('shoot')
  }

  hitEnemy = (b: any, e: any) => {
    b.destroy()
    e.destroy()
    this.cameras.main.shake(40, 0.01)
    this.sound.play('hit')
  }

  hitPlayer = (_: any, e: any) => {
    e.destroy()
    this.health -= 10
    this.drawHealth()
    this.cameras.main.flash(60)
  }

  collectPowerUp = (_: any, p: any) => {
    p.destroy()
    this.showFeedback('POWER UP!', '#00ffff')
  }

  /* ---------------- UPDATE ---------------- */

  update() {
    this.updateStars()
    if (this.phase !== GamePhase.PLAYING) return

    this.player.setVelocity(0)
    const speed = 220

    if (this.cursors.left?.isDown || this.keys.A.isDown) this.player.setVelocityX(-speed)
    if (this.cursors.right?.isDown || this.keys.D.isDown) this.player.setVelocityX(speed)
    if (this.cursors.up?.isDown || this.keys.W.isDown) this.player.setVelocityY(-speed)
    if (this.cursors.down?.isDown || this.keys.S.isDown) this.player.setVelocityY(speed)

    this.enemies.children.iterate((e: any) => {
      if (e) this.physics.moveToObject(e, this.player, e.getData('speed'))
    })

    if (!this.waveCleared && this.enemies.countActive() === 0) {
      this.waveCleared = true
      this.handleWaveEnd()
    }
  }

  /* ---------------- UI HELPERS ---------------- */

  drawHealth() {
    this.healthBar.clear()
    this.healthBar.fillStyle(0x00ff00)
    this.healthBar.fillRect(20, 20, this.health * 2, 12)
    this.healthBar.lineStyle(1, 0xffffff)
    this.healthBar.strokeRect(20, 20, 200, 12)
  }

  updateWaveText() {
    this.waveText.setText(`WAVE ${this.wave}`)
  }

  showFeedback(text: string, color: string) {
    this.feedback.setText(text)
    this.feedback.setColor(color)
    this.feedback.setAlpha(1)
    this.feedback.setScale(0.8)

    this.tweens.add({
      targets: this.feedback,
      alpha: 0,
      scale: 1.2,
      duration: 900
    })
  }

  /* ---------------- STARS ---------------- */

  createStars() {
    this.stars = this.add.group()
    for (let i = 0; i < 80; i++) {
      this.stars.add(
        this.add.circle(
          Phaser.Math.Between(0, this.scale.width),
          Phaser.Math.Between(0, this.scale.height),
          Phaser.Math.Between(1, 2),
          0xffffff,
          Phaser.Math.FloatBetween(0.2, 0.6)
        )
      )
    }
  }

  updateStars() {
    this.stars.children.iterate((s: any) => {
      s.y += 0.3
      if (s.y > this.scale.height) s.y = 0
    })
  }
}
