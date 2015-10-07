var winW = document.body.offsetWidth;
var winH = document.body.offsetHeight;

var neededScore = 75;

var game = new Phaser.Game(winW, winH, Phaser.AUTO);

var setFullLabel, startGameLabel;
var titleFont = { font: '24px Arial', fill: '#fff' };
var scoreFont = { font: '30px Arial', fill: '#fff' };

var ship, ast, bullet;

var junk, bullets;

var junkReload = 0, shootReload = 0;

var created = 0, destroyed = 0;

var score = 0;
var scoreLabel;

var menuState = {
	preload: function() {
		// Menu preload content
	},
	create: function() {

		// Stretch to fill
    	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		// Create items
		game.stage.backgroundColour = '#000000';
		var titleLabel = game.add.text(game.world.centerX - 75, game.world.centerY - 100, 'Welcome', titleFont);
		setFullLabel = game.add.text(game.world.centerX - 100, game.world.centerY, 'Set FullScreen', titleFont);

		setFullLabel.inputEnabled = true;
		//console.log(setFullLabel.events);
		setFullLabel.events.onInputDown.add(goFull, game);

	},
	update: function() {
		// Listen for events
	}
}

var gameState = {
	preload: function(){
		game.load.image('Ship', 'src/assets/square.png');
		game.load.image('Ast', 'src/assets/badsquare.png');
	},
	create: function() {
		//var testLabel = game.add.text(game.world.centerX, game.world.centerY, 'GAME HERE', titleFont);

		scoreLabel = game.add.text(0,0, score, scoreFont)

		// ship sprite
		ship = game.add.sprite(game.world.centerX, game.world.centerY, 'Ship');
		ship.anchor.set(0.5);
		ship.scale.setTo(0.1,0.1);

		;


		junk = game.add.group();

		// Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.physics.arcade.enable(ship);
		ship.body.enable = true;
		ship.body.friction = {x: 0, y: 0};
		ship.body.maxVelocity = {x: 500, y: 500};
	},
	update: function() {
		if(score >= neededScore) 
		{
			game.state.start('NextLevelState');
		}
		game.physics.arcade.collide(junk, ship, shipCollide, null, this);
		game.physics.arcade.collide(junk, bullets, bulletCollide, null, this);

		//Movement
		if (game.input.keyboard.isDown(Phaser.Keyboard.A))
	    {
	        ship.body.velocity.x -= 20;
	    }
	    if (game.input.keyboard.isDown(Phaser.Keyboard.D))
	    {
	        ship.body.velocity.x += 20;
	    }

	    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
	    {
	        ship.body.velocity.y -= 20;
	    }
	    if (game.input.keyboard.isDown(Phaser.Keyboard.S))
	    {
	        ship.body.velocity.y += 20;
	    }
	    if (shootReload === 30)
	    {
	    	if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
	    	{
	    		bullet = bullets.create(ship.body.x, ship.body.y, 'Ship');
        		bullet.scale.setTo(0.02, 0.05);
        		game.physics.arcade.enable(bullet);
				bullet.body.enable = true;
				bullet.body.friction = {x: 0, y: 0};
				bullet.body.drag = {x: 0, y: 0};
				bullet.body.velocity = {x: 0, y: -500 };
				shootReload = 0;
				addScore(-1);
	    	}
	    	if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
	    	{
	    		bullet = bullets.create(ship.body.x, ship.body.y, 'Ship');
        		bullet.scale.setTo(0.02, 0.05);
        		game.physics.arcade.enable(bullet);
				bullet.body.enable = true;
				bullet.body.friction = {x: 0, y: 0};
				bullet.body.drag = {x: 0, y: 0};
				bullet.body.velocity = {x: 0, y: 500 };
				shootReload = 0;
				addScore(-1);
	    	}
	    	if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    	{
	    		bullet = bullets.create(ship.body.x, ship.body.y, 'Ship');
        		bullet.scale.setTo(0.05, 0.02);
        		game.physics.arcade.enable(bullet);
				bullet.body.enable = true;
				bullet.body.friction = {x: 0, y: 0};
				bullet.body.drag = {x: 0, y: 0};
				bullet.body.velocity = {x: 500, y: 0 };
				shootReload = 0;
				addScore(-1);
	    	}
	    	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    	{
	    		bullet = bullets.create(ship.body.x, ship.body.y, 'Ship');
        		bullet.scale.setTo(0.05, 0.02);
        		game.physics.arcade.enable(bullet);
				bullet.body.enable = true;
				bullet.body.friction = {x: 0, y: 0};
				bullet.body.drag = {x: 0, y: 0};
				bullet.body.velocity = {x: -500, y: 0 };
				shootReload = 0;
				addScore(-1);
	    	}
	    }
	    else
	    {
	    	shootReload++;
	    }

	    // Outer Collision
	    if (ship.body.x < 0 - ship.width )
	    {
	    	ship.body.x = game.world.width - ship.width - 1;
	    }
	    else if (ship.body.x > game.world.width)
	    {
	    	ship.body.x = 0 + 1;
	    }

	    if (ship.body.y < 0 - ship.height)
	    {
	    	ship.body.y = game.world.height - ship.height - 1;
	    }
	    else if (ship.body.y > game.world.height)
	    {
	    	ship.body.y = 0 + 1;
	    }

	    if(junkReload === 70)
	    {
	    	created++;
	    	var velX = (700 * Math.random()) - 350;
	    	var velY = (700 * Math.random()) - 350;
	    	if(velX < 30 && velX > -30)
	    	{
	    		velX = 200;
	    	}
	    	if(velY < 30 && velY > -30)
	    	{
	    		velY = 200;
	    	}
	    	var startX = 0;
	    	var startY = 0;
	    	var choice = Math.round(Math.random());
	    	//console.log("hello");
	    	//console.log(choice);
	    	if(velX > 0 && velY > 0) // left or top
	    	{
	    		//console.log("G G");
	    		if(choice === 0) // left
	    		{
	    			startX = -40;
	    			startY = game.world.height * Math.random() * 1.1;
	    		}
	    		else
	    		{
	    			startX = game.world.width * Math.random() * 1.1;
	    			startY = -40;
	    		}
	    	}
	    	else if (velX > 0 && velY < 0) //left or bottom
	    	{
	    		//console.log("G L");
	    		if(choice === 0)
	    		{
	    			startX = -40;
	    			startY = game.world.height * Math.random() * 1.1;
	    		}
	    		else 
	    		{
	    			startX = game.world.width * Math.random() * 1.1;
	    			startY = game.world.height + 40;
	    		}
	    	}
	    	else if (velX < 0 && velY > 0) // right or top
	    	{
	    		//console.log("L G");
	    		if(choice === 0)
	    		{
	    			startX = game.world.width * Math.random() * 1.1;
	    			startY = -40;
	    		}
	    		else 
	    		{
	    			startX = game.width + 40;
	    			startY = game.world.height * Math.random() * 1.1;
	    		}
	    	}
	    	else // right or bottom
	    	{
	    		//console.log("L L");
	    		if(choice === 0)
	    		{
	    			startX = game.world.width + 40;
	    			startY = game.world.height * Math.random() * 1.1;
	    		}
	    		else 
	    		{
	    			startX = game.world.width * Math.random() * 1.1;
	    			startY = game.world.height + 40;
	    		}
	    	}

	    	ast = junk.create(startX, startY, 'Ast');
        	ast.scale.setTo(0.4 * Math.random() + 0.2, 0.4 * Math.random() + 0.2);
        	game.physics.arcade.enable(ast);
			ast.body.enable = true;
			ast.body.friction = {x: 0, y: 0};
			ast.body.drag = {x: 0, y: 0};
			ast.body.velocity = {x: velX, y: velY };
			//console.log(ast.body);
			ast.seen = false;
        	junkReload = 0;
	    }
	    else 
	    {
	    	junkReload++;
	    }

	    for(var i = 1; i < junk.length; i++) {
            if(junk.children[i].body.x < 0 || junk.children[i].body.x > game.world.width || junk.children[i].body.y < 0 || junk.children[i].body.y > game.world.width)
            {
                if(junk.children[i].seen)
                {
                	junk.children[i].destroy();
           			//console.log("destroyed");
           			destroyed++;
                }
            }
            else
            {
            	if(!junk.children[i].seen)
            	{
            		junk.children[i].seen = true;
            		//console.log("seen");
            	}
            }

        }
        for(var i = 0; i < bullets.length; i++)
        {
        	if(bullets.children[i].body.x < 0 || bullets.children[i].body.x > game.world.width || bullets.children[i].body.y < 0 || bullets.children[i].body.y > game.world.width)
            {
                bullets.children[i].destroy();
            }
        }
	}
}

var endState = {
	preload: function(){

	},
	create: function(){
		var gameOverLabel = game.add.text(game.world.centerX - 75, game.world.centerY - 100, 'End Game', titleFont);
		startGameLabel = game.add.text(game.world.centerX - 90, game.world.centerY, 'Start Game', titleFont);
		startGameLabel.inputEnabled = true;
		startGameLabel.events.onInputDown.add(startGame, game);
	},
	update: function(){

	}
}

var nextLevelState = {
	preload: function() {

	},
	create: function() {
		neededScore *= 2;
		var completeLabel = game.add.text(game.world.centerX - 75, game.world.centerY - 100, 'End Game', titleFont);
		var continueGameLabel = game.add.text(game.world.centerX - 90, game.world.centerY, 'Next Level', titleFont);
		continueGameLabel.inputEnabled = true;
		continueGameLabel.events.onInputDown.add(startGame, game);
	},
	update: function() {

	}
}

function goFull() {
	//game.scale.startFullScreen(false);
	game.world.remove(setFullLabel);
	startGameLabel = game.add.text(game.world.centerX - 90, game.world.centerY, 'Start Game', titleFont);
	startGameLabel.inputEnabled = true;
	startGameLabel.events.onInputDown.add(startGame, game);
}

function startGame() {
	game.state.start('GameState');
}

function shipCollide() {
	console.log("created: " + created + " Destroyed: " + destroyed);
	game.state.start('EndState');
}

function bulletCollide(as, bu) {
	bullets.remove(bu);
	junk.remove(as);
	as.destroy();
	bu.destroy();
	destroyed++;
	addScore(10);
}

function addScore(pts){
	score += pts;
	scoreLabel.setText(score);
}

game.state.add('NextLevelState', nextLevelState);
game.state.add('MenuState', menuState);
game.state.add('GameState', gameState);
game.state.add('EndState', endState);
game.state.start('MenuState');


