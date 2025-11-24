const CONFIG = {
    player: {
        width: 75,
        height: 75,

        startX: 100,
        startY: 500,

        acceleration: 0.2,
        maxSpeed: 8,
        friction: 0.95,

        gravity: 0.4,
        jumpStrength: -15,

        spindashSpeed: 15,
        spindashChargeFrames: 30
    },

    ground: {
        height: 50,
        color: "blue"
    },

    game: {
        zoneDisplayTimer: 3000  // Increased from 2005 to 3000ms for better visibility
    },

    enemy: {
        width: 35,
        height: 35,
        speed: 2,
        patrolDistance: 200
    },

    ring: {
        width: 20,
        height: 20,
        value: 1
    },

    playerSettings: {
        startLives: 3,
        invincibilityFrames: 120,  // 2 seconds at 60fps
        knockbackForce: 10
    },

    platform: {
        width: 100,
        height: 20,
        color: 'brown'

    },

    spring: {
        width: 40,
        height: 20,
        bounceStrength: -20,
        color: 'yellow'
    },

    goal: {
        width: 50,
        height: 100,
        color: 'purple'
    },

    checkpoint: {
        width: 40,
        height: 80,
        color: 'yellow'
    },

    level: {
        width: 4000,
        completeMessage: "ZONE CLEARED!"
    },

    assets: {
        images: {
            titleScreen: 'images/TitleScreen.png',
            background: 'images/green_hill.gif',
            sonicIdle: 'images/sonic.png',
            sonicWalk: 'images/sonic_walk.gif',
            sonicRun: 'images/sonic_run.gif',
            sonicJump: 'images/sonic_jump.gif',
            sonicCrouch: 'images/sonic_crouch.gif',
            sonicSpindash: 'images/sonic_spindash.gif',
            sonicSpringUse: 'images/sonic_springuse.png',
            sonicDeath: 'images/sonic_dead.png',
            sonicHurt: 'images/sonic_hurt.png',
            sonic1GoalSign: 'images/sonic1_goal_sign.png',
            hellBossSprite: 'images/2011X_Groovin.gif',
            ringSprite: 'images/ring.gif',  // Add ring sprite (use a GIF for animation if desired)
            testZoneBossSprite: 'images/eggman_sprite.gif',  // Add Test Zone boss sprite
            invincibilityPowerUp: 'images/invincibilitybox.jpg',
            speedPowerUp: 'images/speedshoesbox.jpg',
            lifePowerUp: 'images/extralifebox.png',
            hill_sonicexe: 'images/hill_sonicexe.jpg',
        },
        audio: {
            titleMusic: 'audio/title.mp3',
            bgMusic: 'audio/green_hill.ogg',
            act1Music: 'audio/act1Music.ogg',
            act2Music: 'audio/act2Music.ogg',
            act3Music: 'audio/act3Music.ogg',
            bossMusic: 'audio/bossMusic.ogg',
            victoryMusic: 'audio/victoryMusic.ogg',
            gameCompleteMusic: 'audio/game_complete.ogg',
            gameOverMusic: 'audio/gameOverMusic.ogg', // Game over music (placeholder)
            jumpSound: 'audio/jump.wav',
            spindashSound: 'audio/spindash.wav',
            springSound: 'audio/spring.wav',
            hellAct1Music: 'audio/hillACT1.ogg',
            hellAct2Music: 'audio/hillACT2.ogg',
            invincibilityMusic: 'audio/invincibility.ogg',
            extraLifeSound: 'audio/ExtraLife.ogg',
            hellAct3Music: 'audio/hillACT3.ogg',
            hellBossMusic: 'audio/hillBOSS.wav'
        }
    },

    levels: {
        'Test Zone Act 1': {
            next: 'Test Zone Act 2',
            enemies: [
                { x: 400, y: 425 },
                { x: 700, y: 425 },
                { x: 1200, y: 425 },
                { x: 1600, y: 425 }
            ],
            rings: [
                { x: 150, y: 400 }, { x: 180, y: 400 }, { x: 210, y: 400 }, // Rings at start
                { x: 250, y: 400 }, { x: 300, y: 400 }, { x: 350, y: 400 },
                { x: 500, y: 450 }, { x: 550, y: 450 },
                { x: 600, y: 350 }, { x: 1000, y: 420 }, { x: 1100, y: 380 },
                { x: 1500, y: 440 }, { x: 1600, y: 400 }
            ],
            platforms: [
                { x: 800, y: 450, width: 150 },
                { x: 1100, y: 400, width: 100 },
                { x: 1400, y: 350, width: 120 },
                { x: 1800, y: 300, width: 200 },
                { x: 2200, y: 400, width: 150 },
                { x: 2500, y: 350, width: 100 },
                { x: 2800, y: 450, width: 120 },
                { x: 3200, y: 300, width: 180 }
            ],
            springs: [
                { x: 850, y: 430 },
                { x: 1450, y: 330 },
                { x: 2850, y: 430 }
            ],
            goal: { x: 3800, y: 425 },
            powerUps: [
                { x: 1000, y: 400, type: 'speed' },
                { x: 2400, y: 400, type: 'invincibility' },
                { x: 3600, y: 400, type: 'life' }
            ],
            checkpoints: [
                { x: 600, y: 425 },
                { x: 1800, y: 425 },
                { x: 3000, y: 425 }
            ],
            pits: [
                { x: 1200, width: 100 },
                { x: 2200, width: 120 },
                { x: 3400, width: 150 }
            ]
        },
        'Test Zone Act 2': {
            next: 'Test Zone Act 3',
            enemies: [
                { x: 500, y: 425 }, { x: 800, y: 425 }, { x: 1100, y: 425 },
                { x: 1400, y: 425 }, { x: 1700, y: 425 }, { x: 2000, y: 425 }
            ],
            rings: [
                { x: 300, y: 400 }, { x: 350, y: 400 }, { x: 400, y: 400 },
                { x: 600, y: 450 }, { x: 650, y: 450 }, { x: 700, y: 350 },
                { x: 900, y: 420 }, { x: 1000, y: 380 }, { x: 1200, y: 440 },
                { x: 1300, y: 400 }, { x: 1500, y: 360 }, { x: 1700, y: 420 },
                { x: 1900, y: 380 }, { x: 2100, y: 440 }, { x: 2300, y: 400 },
                { x: 2500, y: 360 }, { x: 2700, y: 420 }, { x: 2900, y: 380 },
                { x: 3100, y: 440 }, { x: 3300, y: 400 }, { x: 3500, y: 360 }
            ],
            platforms: [
                { x: 400, y: 450, width: 100 }, { x: 600, y: 400, width: 80 },
                { x: 800, y: 350, width: 120 }, { x: 1000, y: 300, width: 150 },
                { x: 1200, y: 400, width: 100 }, { x: 1400, y: 350, width: 80 },
                { x: 1600, y: 300, width: 120 }, { x: 1800, y: 400, width: 150 },
                { x: 2000, y: 350, width: 100 }, { x: 2200, y: 300, width: 80 },
                { x: 2400, y: 400, width: 120 }, { x: 2600, y: 350, width: 150 },
                { x: 2800, y: 300, width: 100 }, { x: 3000, y: 400, width: 80 },
                { x: 3200, y: 350, width: 120 }, { x: 3400, y: 300, width: 150 }
            ],
            springs: [
                { x: 450, y: 430 }, { x: 850, y: 330 }, { x: 1250, y: 380 },
                { x: 1650, y: 280 }, { x: 2050, y: 330 }, { x: 2450, y: 380 },
                { x: 2850, y: 280 }, { x: 3250, y: 330 }
            ],
            goal: { x: 3800, y: 425 },
            powerUps: [
                { x: 1500, y: 400, type: 'speed' },
                { x: 2500, y: 400, type: 'invincibility' },
                { x: 3500, y: 400, type: 'life' }
            ],
            checkpoints: [
                { x: 1000, y: 425 },
                { x: 2000, y: 425 },
                { x: 3000, y: 425 }
            ],
            pits: [
                { x: 500, width: 80 },
                { x: 1500, width: 100 },
                { x: 2500, width: 120 },
                { x: 3500, width: 150 }
            ]
        },
        'Test Zone Act 3': {
            next: 'Hell Zone Act 1',
            enemies: [
                { x: 300, y: 425 }, { x: 600, y: 425 }, { x: 900, y: 425 },
                { x: 1200, y: 425 }, { x: 1500, y: 425 }, { x: 1800, y: 425 },
                { x: 2100, y: 425 }, { x: 2400, y: 425 }, { x: 2700, y: 425 }
            ],
            rings: [
                { x: 200, y: 400 }, { x: 250, y: 400 }, { x: 300, y: 400 },
                { x: 400, y: 450 }, { x: 450, y: 450 }, { x: 500, y: 350 },
                { x: 600, y: 420 }, { x: 650, y: 380 }, { x: 700, y: 440 },
                { x: 750, y: 400 }, { x: 800, y: 360 }, { x: 850, y: 420 },
                { x: 900, y: 380 }, { x: 950, y: 440 }, { x: 1000, y: 400 },
                { x: 1100, y: 360 }, { x: 1150, y: 420 }, { x: 1200, y: 380 },
                { x: 1250, y: 440 }, { x: 1300, y: 400 }, { x: 1350, y: 360 },
                { x: 1400, y: 420 }, { x: 1450, y: 380 }, { x: 1500, y: 440 },
                { x: 1550, y: 400 }, { x: 1600, y: 360 }, { x: 1650, y: 420 },
                { x: 1700, y: 380 }, { x: 1750, y: 440 }, { x: 1800, y: 400 },
                { x: 1850, y: 360 }, { x: 1900, y: 420 }, { x: 1950, y: 380 },
                { x: 2000, y: 440 }, { x: 2050, y: 400 }, { x: 2100, y: 360 },
                { x: 2150, y: 420 }, { x: 2200, y: 380 }, { x: 2250, y: 440 },
                { x: 2300, y: 400 }, { x: 2350, y: 360 }, { x: 2400, y: 420 },
                { x: 2450, y: 380 }, { x: 2500, y: 440 }, { x: 2550, y: 400 },
                { x: 2600, y: 360 }, { x: 2650, y: 420 }, { x: 2700, y: 380 },
                { x: 2750, y: 440 }, { x: 2800, y: 400 }, { x: 2850, y: 360 },
                { x: 2900, y: 420 }, { x: 2950, y: 380 }, { x: 3000, y: 440 },
                { x: 3050, y: 400 }, { x: 3100, y: 360 }, { x: 3150, y: 420 },
                { x: 3200, y: 380 }, { x: 3250, y: 440 }, { x: 3300, y: 400 },
                { x: 3350, y: 360 }, { x: 3400, y: 420 }, { x: 3450, y: 380 },
                { x: 3500, y: 440 }, { x: 3550, y: 400 }, { x: 3600, y: 360 },
                { x: 3650, y: 420 }, { x: 3700, y: 380 }, { x: 3750, y: 440 }
            ],
            platforms: [
                { x: 200, y: 450, width: 80 }, { x: 400, y: 400, width: 60 },
                { x: 600, y: 350, width: 100 }, { x: 800, y: 300, width: 120 },
                { x: 1000, y: 400, width: 80 }, { x: 1200, y: 350, width: 60 },
                { x: 1400, y: 300, width: 100 }, { x: 1600, y: 400, width: 120 },
                { x: 1800, y: 350, width: 80 }, { x: 2000, y: 300, width: 60 },
                { x: 2200, y: 400, width: 100 }, { x: 2400, y: 350, width: 120 },
                { x: 2600, y: 300, width: 80 }, { x: 2800, y: 400, width: 60 },
                { x: 3000, y: 350, width: 100 }, { x: 3200, y: 300, width: 120 },
                { x: 3400, y: 400, width: 80 }, { x: 3600, y: 350, width: 60 }
            ],
            springs: [
                { x: 250, y: 430 }, { x: 650, y: 330 }, { x: 1050, y: 380 },
                { x: 1450, y: 280 }, { x: 1850, y: 330 }, { x: 2250, y: 380 },
                { x: 2650, y: 280 }, { x: 3050, y: 330 }, { x: 3450, y: 380 }
            ],
            boss: { x: 2900, y: 350, sprite: 'testZoneBossSprite', health: 10, music: 'bossMusic' }
        },
        'Hell Zone Act 1': {
            theme: {
                background: 'hill_sonicexe',
                music: 'hellAct1Music'
            },
            next: 'Hell Zone Act 2',
            enemies: [
                { x: 400, y: 425 },
                { x: 800, y: 425 },
                { x: 1200, y: 425 },
                { x: 1600, y: 425 },
                { x: 2000, y: 425 }
            ],
            rings: [
                { x: 150, y: 400 }, { x: 180, y: 400 }, { x: 210, y: 400 },
                { x: 250, y: 400 }, { x: 300, y: 400 }, { x: 350, y: 400 },
                { x: 500, y: 450 }, { x: 550, y: 450 }, { x: 600, y: 350 },
                { x: 800, y: 420 }, { x: 850, y: 380 }, { x: 900, y: 440 },
                { x: 950, y: 400 }, { x: 1000, y: 360 }, { x: 1050, y: 420 },
                { x: 1100, y: 380 }, { x: 1150, y: 440 }, { x: 1200, y: 400 },
                { x: 1250, y: 360 }, { x: 1300, y: 420 }, { x: 1350, y: 380 },
                { x: 1400, y: 440 }, { x: 1450, y: 400 }, { x: 1500, y: 360 },
                { x: 1550, y: 420 }, { x: 1600, y: 380 }, { x: 1650, y: 440 },
                { x: 1700, y: 400 }, { x: 1750, y: 360 }, { x: 1800, y: 420 },
                { x: 1850, y: 380 }, { x: 1900, y: 440 }, { x: 1950, y: 400 }
            ],
            platforms: [
                { x: 600, y: 450, width: 150 },
                { x: 900, y: 400, width: 100 },
                { x: 1200, y: 350, width: 120 },
                { x: 1500, y: 300, width: 200 },
                { x: 1800, y: 400, width: 150 }
            ],
            springs: [
                { x: 650, y: 430 },
                { x: 1250, y: 330 },
                { x: 1550, y: 280 }
            ],
            goal: { x: 3800, y: 425 },
            powerUps: [
                { x: 1000, y: 400, type: 'speed' },
                { x: 2000, y: 400, type: 'invincibility' }
            ],
            checkpoints: [
                { x: 800, y: 425 },
                { x: 1600, y: 425 },
                { x: 2400, y: 425 }
            ],
            pits: [
                { x: 1000, width: 100 },
                { x: 2000, width: 120 },
                { x: 3000, width: 150 }
            ]
        },
        'Hell Zone Act 2': {
            theme: {
                background: 'hill_sonicexe',
                music: 'hellAct2Music'
            },
            next: 'Hell Zone Act 3',
            enemies: [
                { x: 500, y: 425 }, { x: 800, y: 425 }, { x: 1100, y: 425 },
                { x: 1400, y: 425 }, { x: 1700, y: 425 }, { x: 2000, y: 425 },
                { x: 2300, y: 425 }, { x: 2600, y: 425 }
            ],
            rings: [
                { x: 300, y: 400 }, { x: 350, y: 400 }, { x: 400, y: 400 },
                { x: 600, y: 450 }, { x: 650, y: 450 }, { x: 700, y: 350 },
                { x: 900, y: 420 }, { x: 1000, y: 380 }, { x: 1200, y: 440 },
                { x: 1300, y: 400 }, { x: 1500, y: 360 }, { x: 1700, y: 420 },
                { x: 1900, y: 380 }, { x: 2100, y: 440 }, { x: 2300, y: 400 },
                { x: 2500, y: 360 }, { x: 2700, y: 420 }, { x: 2900, y: 380 }
            ],
            platforms: [
                { x: 400, y: 450, width: 100 }, { x: 600, y: 400, width: 80 },
                { x: 800, y: 350, width: 120 }, { x: 1000, y: 300, width: 150 },
                { x: 1200, y: 400, width: 100 }, { x: 1400, y: 350, width: 80 },
                { x: 1600, y: 300, width: 120 }, { x: 1800, y: 400, width: 150 },
                { x: 2000, y: 350, width: 100 }, { x: 2200, y: 300, width: 80 },
                { x: 2400, y: 400, width: 120 }, { x: 2600, y: 350, width: 150 },
                { x: 2800, y: 300, width: 100 }
            ],
            springs: [
                { x: 450, y: 430 }, { x: 850, y: 330 }, { x: 1250, y: 380 },
                { x: 1650, y: 280 }, { x: 2050, y: 330 }, { x: 2450, y: 380 }
            ],
            goal: { x: 3800, y: 425 },
            powerUps: [
                { x: 1500, y: 400, type: 'speed' },
                { x: 2500, y: 400, type: 'invincibility' }
            ],
            checkpoints: [
                { x: 1000, y: 425 },
                { x: 2000, y: 425 },
                { x: 3000, y: 425 }
            ],
            pits: [
                { x: 500, width: 80 },
                { x: 1500, width: 100 },
                { x: 2500, width: 120 }
            ]
        },
        'Hell Zone Act 3': {
            theme: {
                background: 'hill_sonicexe',
                music: 'hellAct3Music'
            },
            next: null,
            enemies: [
                { x: 300, y: 425 }, { x: 600, y: 425 }, { x: 900, y: 425 },
                { x: 1200, y: 425 }, { x: 1500, y: 425 }, { x: 1800, y: 425 },
                { x: 2100, y: 425 }, { x: 2400, y: 425 }, { x: 2700, y: 425 },
                { x: 3000, y: 425 }
            ],
            rings: [
                { x: 200, y: 400 }, { x: 250, y: 400 }, { x: 300, y: 400 },
                { x: 400, y: 450 }, { x: 450, y: 450 }, { x: 500, y: 350 },
                { x: 600, y: 420 }, { x: 650, y: 380 }, { x: 700, y: 440 },
                { x: 750, y: 400 }, { x: 800, y: 360 }, { x: 850, y: 420 },
                { x: 900, y: 380 }, { x: 950, y: 440 }, { x: 1000, y: 400 },
                { x: 1100, y: 360 }, { x: 1150, y: 420 }, { x: 1200, y: 380 },
                { x: 1250, y: 440 }, { x: 1300, y: 400 }, { x: 1350, y: 360 },
                { x: 1400, y: 420 }, { x: 1450, y: 380 }, { x: 1500, y: 440 },
                { x: 1550, y: 400 }, { x: 1600, y: 360 }, { x: 1650, y: 420 },
                { x: 1700, y: 380 }, { x: 1750, y: 440 }, { x: 1800, y: 400 },
                { x: 1850, y: 360 }, { x: 1900, y: 420 }, { x: 1950, y: 380 },
                { x: 2000, y: 440 }, { x: 2050, y: 400 }, { x: 2100, y: 360 },
                { x: 2150, y: 420 }, { x: 2200, y: 380 }, { x: 2250, y: 440 },
                { x: 2300, y: 400 }, { x: 2350, y: 360 }, { x: 2400, y: 420 },
                { x: 2450, y: 380 }, { x: 2500, y: 440 }, { x: 2550, y: 400 },
                { x: 2600, y: 360 }, { x: 2650, y: 420 }, { x: 2700, y: 380 },
                { x: 2750, y: 440 }, { x: 2800, y: 400 }, { x: 2850, y: 360 },
                { x: 2900, y: 420 }, { x: 2950, y: 380 }, { x: 3000, y: 440 },
                { x: 3050, y: 400 }, { x: 3100, y: 360 }, { x: 3150, y: 420 },
                { x: 3200, y: 380 }, { x: 3250, y: 440 }, { x: 3300, y: 400 },
                { x: 3350, y: 360 }, { x: 3400, y: 420 }, { x: 3450, y: 380 },
                { x: 3500, y: 440 }, { x: 3550, y: 400 }, { x: 3600, y: 360 },
                { x: 3650, y: 420 }, { x: 3700, y: 380 }, { x: 3750, y: 440 }
            ],
            platforms: [
                { x: 200, y: 450, width: 80 }, { x: 400, y: 400, width: 60 },
                { x: 600, y: 350, width: 100 }, { x: 800, y: 300, width: 120 },
                { x: 1000, y: 400, width: 80 }, { x: 1200, y: 350, width: 60 },
                { x: 1400, y: 300, width: 100 }, { x: 1600, y: 400, width: 120 },
                { x: 1800, y: 350, width: 80 }, { x: 2000, y: 300, width: 60 },
                { x: 2200, y: 400, width: 100 }, { x: 2400, y: 350, width: 120 },
                { x: 2600, y: 300, width: 80 }, { x: 2800, y: 400, width: 60 },
                { x: 3000, y: 350, width: 100 }, { x: 3200, y: 300, width: 120 },
                { x: 3400, y: 400, width: 80 }, { x: 3600, y: 350, width: 60 }
            ],
            springs: [
                { x: 250, y: 430 }, { x: 650, y: 330 }, { x: 1050, y: 380 },
                { x: 1450, y: 280 }, { x: 1850, y: 330 }, { x: 2250, y: 380 },
                { x: 2650, y: 280 }, { x: 3050, y: 330 }, { x: 3450, y: 380 }
            ],
            boss: { x: 3200, y: 350, sprite: 'hellBossSprite', health: 12, music: 'hellBossMusic' }
        }
    }
};