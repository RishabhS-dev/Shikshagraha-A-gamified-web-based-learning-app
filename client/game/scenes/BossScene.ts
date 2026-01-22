import * as Phaser from 'phaser'

export class BossScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite
  boss!: Phaser.Physics.Arcade.Sprite
  bullets!: Phaser.Physics.Arcade.Group
  bossBullets!: Phaser.Physics.Arcade.Group

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keys!: any

  bossHP = 300
  bossInvulnerable = false
  bossDefeated = false
  hpText!: Phaser.GameObjects.Text

  constructor() {
    super({ key: 'BossScene' })
  }

  create() {
    /* ---------------- BACKGROUND ---------------- */
    this.cameras.main.setBackgroundColor('#120014')

    /* ---------------- PLAYER ---------------- */
    this.player = this.physics.add.sprite(
      this.scale.width / 2,
      this.scale.height - 100,
      'player'
    )
    this.player.setTint(0x00ffcc)
    this.player.setCollideWorldBounds(true)

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('W,A,S,D')

    /* ---------------- PLAYER BULLETS ---------------- */
    this.bullets = this.physics.add.group({ maxSize: 30 })

    this.input.on('pointerdown', this.shoot)

    /* ---------------- BOSS ---------------- */
    this.boss = this.physics.add.sprite(
      this.scale.width / 2,
      120,
      'enemy'
    )
    this.boss.setScale(2)
    this.boss.setTint(0xff0033)
    this.boss.setImmovable(true)

    /* ---------------- BOSS MOVEMENT (REAL PATTERN) ---------------- */
    this.tweens.add({
      targets: this.boss,
      x: { from: 120, to: this.scale.width - 120 },
      y: { from: 80, to: 220 },
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    /* ---------------- BOSS BULLETS ---------------- */
    this.bossBullets = this.physics.add.group({ maxSize: 50 })

    this.time.addEvent({
      delay: 900,
      loop: true,
      callback: this.fireBossBullets,
      callbackScope: this
    })

    /* ---------------- UI ---------------- */
    this.hpText = this.add.text(
      this.scale.width / 2,
      20,
      'BOSS HP: 300',
      { fontFamily: 'monospace', color: '#ff3366' }
    ).setOrigin(0.5)

    /* ---------------- COLLISIONS ---------------- */
    this.physics.add.overlap(
      this.bullets,
      this.boss,
      this.hitBoss,
      undefined,
      this
    )

    this.physics.add.overlap(
      this.bossBullets,
      this.player,
      this.hitPlayer,
      undefined,
      this
    )
  }

  /* ---------------- PLAYER SHOOT ---------------- */

  shoot = (pointer: Phaser.Input.Pointer) => {
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
        pointer.worldX,
        pointer.worldY
      ),
      550,
      bullet.body!.velocity
    )

    this.sound.play('shoot')
  }

  /* ---------------- BOSS ATTACK ---------------- */

  fireBossBullets() {
    if (this.bossHP <= 0) return

    for (let i = -1; i <= 1; i++) {
      const bullet = this.bossBullets.get(
        this.boss.x,
        this.boss.y
      ) as Phaser.Physics.Arcade.Sprite

      if (!bullet) continue

      bullet.setActive(true)
      bullet.setVisible(true)
      bullet.setScale(0.3)
      bullet.setTint(0xff4444)

      const angle =
        Phaser.Math.Angle.Between(
          this.boss.x,
          this.boss.y,
          this.player.x,
          this.player.y
        ) + i * 0.3

      this.physics.velocityFromRotation(
        angle,
        220,
        bullet.body!.velocity
      )
    }
  }

  /* ---------------- HIT LOGIC ---------------- */

  hitBoss = (bullet: any, boss: any) => {
    bullet.destroy()

    if (this.bossInvulnerable) return
    this.bossInvulnerable = true

    this.bossHP -= 10
    this.hpText.setText(`BOSS HP: ${this.bossHP}`)

    boss.setTint(0xffffff)
    this.cameras.main.shake(60, 0.01)
    this.sound.play('hit')

    this.time.delayedCall(120, () => {
      boss.setTint(0xff0033)
    })

  this.time.delayedCall(250, () => {
    this.bossInvulnerable = false
  })

  if (this.bossHP <= 0 && !this.bossDefeated) {
    this.bossDefeated = true
    boss.disableBody(true, true)

    this.time.delayedCall(500, () => {
      this.scene.start('ChapterCompleteScene')
    })
  }
}

  hitPlayer = (bullet: any) => {
    bullet.destroy()
    this.cameras.main.flash(80)
  }

  /* ---------------- UPDATE ---------------- */
update() {
  // 🔒 SAFETY GUARD (prevents crash during scene transition)
  if (!this.player || !this.player.body) return

  this.player.setVelocity(0)
  const speed = 240

  if (this.cursors.left?.isDown || this.keys.A.isDown)
    this.player.setVelocityX(-speed)
  if (this.cursors.right?.isDown || this.keys.D.isDown)
    this.player.setVelocityX(speed)
  if (this.cursors.up?.isDown || this.keys.W.isDown)
    this.player.setVelocityY(-speed)
  if (this.cursors.down?.isDown || this.keys.S.isDown)
    this.player.setVelocityY(speed)
}
}
