var domReady = require('domready')
var numberOfSquares = 200;
var explosionCount = 50;
var maxSpeed = 333;
var minSpeed = 200;
var blueEmitter, greenEmitter, explosionEmitter;

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
    }

    function create () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.input.onDown.add(gofull, this);

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

    function collision(square1, square2) {
        explode(square1);
        explode(square2);
    }

    function explode(square) {
        explosionEmitter.x = square.x;
        explosionEmitter.y = square.y;
        explosionEmitter.explode(1000, explosionCount);
        square.kill();
    }

    function update () {
        game.physics.arcade.collide(blueEmitter, greenEmitter, collision);
        game.physics.arcade.collide(blueEmitter);
        game.physics.arcade.collide(greenEmitter);
    }
})

