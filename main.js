var domReady = require('domready')
var numberOfSquares = 10;
var explosionCount = 50;
var maxSpeed = 333;
var minSpeed = 200;
var playerSpeed = 200;
var blueEmitter, greenEmitter, explosionEmitter;
var player, facing = "idle";
var cursors;
var jumpButton, jumpTimer = 0;

domReady(function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update
    });

    function preload () {
        game.load.image('blue-pixel', 'assets/blue-pixel.png');
        game.load.image('green-pixel', 'assets/green-pixel.png');
        game.load.image('red-small-pixel', 'assets/red-small-pixel.png');
        game.load.image('orange-small-pixel', 'assets/orange-small-pixel.png');
        game.load.image('yellow-small-pixel', 'assets/yellow-small-pixel.png');
        game.load.spritesheet('player', 'assets/player.png', 72, 97);
    }

    function create () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.input.onDown.add(gofull, this);
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        jumpButton.onUp.add(function() {
            player.body.velocity.y = 0;
            jumpTimer = 0;
        });

        player = game.add.sprite(game.world.width / 2, game.world.height, "player", 11);
        game.physics.arcade.enable(player);
        player.body.gravity.y = 1000;
        player.body.maxVelocity.y = 500;
        player.anchor.setTo(0.5, 0.5);
        player.body.friction = 0.5 ;
        player.body.collideWorldBounds = true;

        player.animations.add("walk", [8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7], playerSpeed/10, true);
        var hurtAnimation = player.animations.add("hurt", [13], 1, false);
        hurtAnimation.onComplete.add(function () {
            facing = "hurt";
            player.isHurt = false;
        });

        player.animations.add("jump", [14], 1, false);

        explosionEmitter = game.add.emitter(0,0);
        explosionEmitter.maxParticles = numberOfSquares*explosionCount;
        explosionEmitter.makeParticles([
            'red-small-pixel',
            'orange-small-pixel',
            'yellow-small-pixel']);

        blueEmitter = game.add.emitter(0, game.world.height);
        blueEmitter.setXSpeed(minSpeed/1.5, maxSpeed/1.5);
        blueEmitter.setYSpeed(-minSpeed, -maxSpeed);
        blueEmitter.bounce.setTo(0.5, 0.5);
        blueEmitter.makeParticles("blue-pixel", 0, numberOfSquares/2, true, true);

        greenEmitter = game.add.emitter(game.world.width, game.world.height);
        greenEmitter.setXSpeed(-minSpeed/1.5, -maxSpeed/1.5);
        greenEmitter.setYSpeed(-minSpeed, -maxSpeed);
        greenEmitter.bounce.setTo(0.5, 0.5);
        greenEmitter.makeParticles("green-pixel", 0, numberOfSquares/2, true, true);

        blueEmitter.start(false, 10000, 100)
        greenEmitter.start(false, 10000, 100)
    }

    function gofull() {
        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
    }

    function squareCollision(square1, square2) {
        explode(square1);
        explode(square2);
    }

    function playerCollision(playerSprite, square) {
        explode(square);
        playerSprite.animations.play('hurt');
        playerSprite.isHurt = true;
    }

    function explode(square) {
        explosionEmitter.x = square.x;
        explosionEmitter.y = square.y;
        explosionEmitter.explode(1000, explosionCount);
        square.kill();
    }

    function update () {
        game.physics.arcade.collide(blueEmitter, greenEmitter, squareCollision);
        game.physics.arcade.collide(blueEmitter, player, playerCollision);
        game.physics.arcade.collide(greenEmitter, player, playerCollision);

        if (player.isHurt) return;

        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -playerSpeed;
            player.scale.x = -1;

            if (facing != 'left' && player.body.onFloor())
            {
                player.animations.play('walk');
                facing = 'left';
            }
        } else if (cursors.right.isDown) {

            player.body.velocity.x = playerSpeed;
            player.scale.x = 1;

            if (facing != 'right' && player.body.onFloor())
            {
                player.animations.play('walk');
                facing = 'right';
            }
        } else {
            if (facing != 'idle' && player.body.onFloor())
            {
                player.animations.stop();

                player.frame = 12;

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -500;
            jumpTimer = game.time.now + 750;
            player.animations.play("jump");
            facing = "jump";
        }
    }
})

