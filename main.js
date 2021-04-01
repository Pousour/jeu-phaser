var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 2000 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var counter = 60;
var orientationjoueur;
var player = 0;
var collidingSpikes = false;
var collidingFeu = false;
//var collidingSnake = false;
var collidingEtoile = false;
var overlapBonusJump = false;
var allFire;
//var allSnakes;
var allEtoiles;
var score = 0;
var allArrows;
var posInitFleches = 0;
var posInitSpikes = 0;
var allWalls;
var allSpikes;
var overlapingShop = false;
var triggerMusiqueFin = 0;
var tempsFinal;
var allvaisseauFondDroite;
var allvaisseauFondGauche;

function preload() {
  // CHargements des assets
  this.load.image("background", "images/fondv3.png");
  this.load.image("dude", "images/cyberpunk.png");
  this.load.image("sol", "images/plateforme.jpeg");
  this.load.image("sol2", "images/plateforme2.jpeg");
  this.load.image("mur", "images/wall.jpeg");
  this.load.image("bonusSauts", "images/bonusSauts.png");
  this.load.audio("musique", "sons/musique1.mp3");
  this.load.audio("dash", "sons/whoosh.mp3");
  this.load.audio("saut", "sons/saut.mp3");
  this.load.audio("sonEtoile", "sons/soundEtoile.wav");
  this.load.audio("gameover", "sons/gameover.mp3");
  this.load.audio("victory", "sons/victory.mp3");
  this.load.image("bouleBleu", "images/bouleBleu.png");
  this.load.image("spikes", "images/spikes.png");
  this.load.image("arrow", "images/arrow.png");
  this.load.image("bouton", "images/bouton.png");
  this.load.image("boutonVert", "images/boutonVert.png");
  this.load.image("shop", "images/shop.png");
  this.load.image("vaisseau", "images/vaisseau.png");
  this.load.spritesheet("perso", "images/sprites/cyberpunk1-sheet.png", {
    frameWidth: 38,
    frameHeight: 68,
  });
  this.load.spritesheet("fire", "images/spritesFire/spritesheetFire.png", {
    frameWidth: 203,
    frameHeight: 290,
  });
  /*this.load.spritesheet("snake", "images/ennemies/Snake_walk3.png", {
    frameHeight: 16,
    frameWidth: 32,
  });*/
  this.load.spritesheet("etoiles", "images/etoiles.png", {
    frameHeight: 32,
    frameWidth: 32,
  });
}

function create() {
  // Musique victoire
  victoire = this.sound.add("victory");
  victoire.setVolume(0.5);

  // Saut Sound Effect
  saut = this.sound.add("saut");
  saut.setVolume(0.4);

  // Son game over
  gameover = this.sound.add("gameover");
  gameover.setVolume(0.3);

  // Background
  background = this.add.sprite(0, 0, "background").setOrigin(0, 0);
  background.setScale(1.2);
  background.setScrollFactor(0);

  // Spikes
  groupSpikes = this.physics.add.group();
  groupSpikes
    .create(1000, 829, "spikes")
    .setOrigin(0, 0)
    .setScale(0.4)
    .refreshBody();
  groupSpikes
    .create(4600, 530, "spikes")
    .setOrigin(0, 0)
    .setScale(0.4)
    .refreshBody();
  groupSpikes
    .create(12200, 530, "spikes")
    .setOrigin(0, 0)
    .setScale(0.4)
    .refreshBody();
  groupSpikes
    .create(18700, 840, "spikes")
    .setOrigin(0, 0)
    .setScale(0.4)
    .refreshBody();
  groupSpikes
    .create(19100, 840, "spikes")
    .setOrigin(0, 0)
    .setScale(0.4)
    .refreshBody();

  allSpikes = groupSpikes.getChildren();
  allSpikes[3].body.allowGravity = false;
  allSpikes[4].body.allowGravity = false;

  // Fleches directionelles
  arrowsGroup = this.physics.add.staticGroup();
  arrowsGroup
    .create(800, 300, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(2300, 400, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(5200, 600, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(6700, 700, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(7700, 600, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(13400, 750, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(16200, 350, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(17000, 750, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(18200, 450, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();
  arrowsGroup
    .create(20500, 650, "arrow")
    .setOrigin(0, 0)
    .setScale(4)
    .refreshBody();

  allArrows = arrowsGroup.getChildren();

  allArrows[0].angle = 45;
  allArrows[2].angle = -45;
  allArrows[3].angle = -135;
  allArrows[4].angle = -30;
  allArrows[5].angle = -30;
  allArrows[6].angle = 30;
  allArrows[7].angle = -30;
  allArrows[8].angle = 70;
  allArrows[9].angle = -30;

  // Plateformes jaunes
  platforms = this.physics.add.staticGroup();
  platforms.create(200, 600, "sol").setOrigin(0, 0).setScale(2.1).refreshBody();
  platforms
    .create(1200, 400, "sol")
    .setOrigin(0, 0)
    .setScale(2.1)
    .refreshBody();
  platforms
    .create(600, 900, "sol")
    .setOrigin(0, 0)
    .setScale(4, 1.5)
    .refreshBody();
  platforms
    .create(3500, 900, "sol")
    .setOrigin(0, 0)
    .setScale(4, 2)
    .refreshBody();
  platforms
    .create(4400, 600, "sol")
    .setOrigin(0, 0)
    .setScale(3, 3)
    .refreshBody();
  platforms
    .create(5400, 300, "sol")
    .setOrigin(0, 0)
    .setScale(3, 1.8)
    .refreshBody();
  platforms
    .create(7100, 900, "sol")
    .setOrigin(0, 0)
    .setScale(6, 2)
    .refreshBody();
  platforms
    .create(8500, 900, "sol")
    .setOrigin(0, 0)
    .setScale(2, 2)
    .refreshBody();
  platforms
    .create(9200, 900, "sol")
    .setOrigin(0, 0)
    .setScale(2, 2)
    .refreshBody();
  platforms
    .create(9900, 900, "sol")
    .setOrigin(0, 0)
    .setScale(2, 2)
    .refreshBody();
  platforms
    .create(10600, 900, "sol")
    .setOrigin(0, 0)
    .setScale(3, 2)
    .refreshBody();
  platforms
    .create(11300, 700, "sol")
    .setOrigin(0, 0)
    .setScale(2, 1.8)
    .refreshBody();
  platforms
    .create(12100, 400, "sol")
    .setOrigin(0, 0)
    .setScale(2, 1.8)
    .refreshBody();
  platforms
    .create(3500, 390, "sol")
    .setOrigin(0, 0)
    .setScale(2, 1.8)
    .refreshBody();
  platforms
    .create(5700, 700, "sol")
    .setOrigin(0, 0)
    .setScale(0.8, 1.8)
    .refreshBody();
  platforms
    .create(5700, 1050, "sol")
    .setOrigin(0, 0)
    .setScale(6, 1.8)
    .refreshBody();
  platforms
    .create(6200, 800, "sol")
    .setOrigin(0, 0)
    .setScale(1.5, 1.8)
    .refreshBody();
  platforms
    .create(6200, 500, "sol")
    .setOrigin(0, 0)
    .setScale(0.8, 1.8)
    .refreshBody();
  platforms
    .create(6600, 300, "sol")
    .setOrigin(0, 0)
    .setScale(1.5, 1.8)
    .refreshBody();
  platforms
    .create(7500, 300, "sol")
    .setOrigin(0, 0)
    .setScale(1.5, 1.8)
    .refreshBody();
  platforms
    .create(13800, 500, "sol")
    .setOrigin(0, 0)
    .setScale(2, 3)
    .refreshBody();
  platforms
    .create(14600, 800, "sol")
    .setOrigin(0, 0)
    .setScale(3, 1.5)
    .refreshBody();
  platforms
    .create(15500, 600, "sol")
    .setOrigin(0, 0)
    .setScale(2.5, 1.8)
    .refreshBody();
  platforms
    .create(16560, 900, "sol")
    .setOrigin(0, 0)
    .setScale(1, 1.8)
    .refreshBody();
  platforms
    .create(17400, 600, "sol")
    .setOrigin(0, 0)
    .setScale(1.2, 1.8)
    .refreshBody();
  platforms
    .create(18300, 900, "sol")
    .setOrigin(0, 0)
    .setScale(6.5, 3)
    .refreshBody();
  platforms
    .create(18540, 650, "sol")
    .setOrigin(0, 0)
    .setScale(4, 1.5)
    .refreshBody();
  platforms
    .create(18700, 435, "sol")
    .setOrigin(0, 0)
    .setScale(3, 1.5)
    .refreshBody();
  platforms
    .create(21700, 600, "sol")
    .setOrigin(0, 0)
    .setScale(3, 1.5)
    .refreshBody();

  // Murs verticaux
  walls = this.physics.add.staticGroup();
  walls
    .create(8300, 350, "mur")
    .setOrigin(0, 0)
    .setScale(2, 3.05)
    .refreshBody();
  walls
    .create(9020, -200, "mur")
    .setOrigin(0, 0)
    .setScale(2, 3.05)
    .refreshBody();
  walls
    .create(9020, 700, "mur")
    .setOrigin(0, 0)
    .setScale(2, 3.05)
    .refreshBody();
  walls.create(9720, 0, "mur").setOrigin(0, 0).setScale(2, 3.05).refreshBody();
  walls
    .create(9720, 900, "mur")
    .setOrigin(0, 0)
    .setScale(2, 3.05)
    .refreshBody();
  walls
    .create(10420, -500, "mur")
    .setOrigin(0, 0)
    .setScale(2, 3.05)
    .refreshBody();
  walls.create(10420, 400, "mur").setOrigin(0, 0).setScale(2, 5).refreshBody();
  walls.create(5700, 300, "mur").setOrigin(0, 0).setScale(2, 2).refreshBody();
  walls.create(6200, 0, "mur").setOrigin(0, 0).setScale(2, 4).refreshBody();
  walls
    .create(6900, 300, "mur")
    .setOrigin(0, 0)
    .setScale(2, 4.02)
    .refreshBody();
  walls.create(7500, 0, "mur").setOrigin(0, 0).setScale(2, 1.75).refreshBody();
  walls
    .create(14150, 500, "mur")
    .setOrigin(0, 0)
    .setScale(2, 1.75)
    .refreshBody();
  walls.create(14900, -200, "mur").setOrigin(0, 0).setScale(2, 5).refreshBody();
  walls
    .create(14900, 800, "mur")
    .setOrigin(0, 0)
    .setScale(2, 1.75)
    .refreshBody();
  walls
    .create(17900, 300, "mur")
    .setOrigin(0, 0)
    .setScale(1.5, 6)
    .refreshBody();
  walls
    .create(18500, -305, "mur")
    .setOrigin(0, 0)
    .setScale(1.5, 5)
    .refreshBody();
  walls
    .create(18700, 435, "mur")
    .setOrigin(0, 0)
    .setScale(1.5, 1.3)
    .refreshBody();
  walls
    .create(19300, 435, "mur")
    .setOrigin(0, 0)
    .setScale(1.5, 1.3)
    .refreshBody();

  allWalls = walls.getChildren();

  // Porte
  groupePorte = this.physics.add.group({ allowGravity: false });
  groupePorte
    .create(14900, -200, "mur")
    .setOrigin(0, 0)
    .setScale(2, 5)
    .refreshBody();
  var allPortes = groupePorte.getChildren();

  // Plateformes vertes
  platformsVertes = this.physics.add.staticGroup();
  platformsVertes
    .create(2100, 700, "sol2")
    .setOrigin(0, 0)
    .setScale(3)
    .refreshBody();
  platformsVertes
    .create(12100, 900, "sol2")
    .setOrigin(0, 0)
    .setScale(5, 1.8)
    .refreshBody();
  platformsVertes
    .create(19600, 900, "sol2")
    .setOrigin(0, 0)
    .setScale(4, 3)
    .refreshBody();

  //Bonus sauts
  bonusJump = this.physics.add.staticGroup();
  bonusJump
    .create(7900, 890, "bonusSauts")
    .setOrigin(0, 0)
    .setScale(2, 2)
    .refreshBody();
  bonusJump
    .create(9900, 890, "bonusSauts")
    .setOrigin(0, 0)
    .setScale(2, 2)
    .refreshBody();
  bonusJump
    .create(12700, 890, "bonusSauts")
    .setOrigin(0, 0)
    .setScale(2, 1.8)
    .refreshBody();
  bonusJump
    .create(16550, 890, "bonusSauts")
    .setOrigin(0, 0)
    .setScale(1.2, 1.8)
    .refreshBody();
  bonusJump
    .create(20020, 885, "bonusSauts")
    .setOrigin(0, 0)
    .setScale(2, 3)
    .refreshBody();

  // Animations Courir et idle
  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("perso", {
      frames: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    }),
    frameRate: 20,
    repeat: true,
  });
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("perso", { frames: [0] }),
    frameRate: 20,
    repeat: true,
  });

  // Animation feu
  this.anims.create({
    key: "bruler",
    frames: this.anims.generateFrameNumbers("fire", { frames: [0, 1, 2, 3] }),
    frameRate: 6,
    repeat: true,
  });

  // Animation snake
  /*this.anims.create({
    key: "snakeMarcher",
    frames: this.anims.generateFrameNumbers("snake", { frames: [0, 1, 2, 3] }),
    frameRate: 6,
    repeat: true,
  });*/

  // Animation etoiles
  this.anims.create({
    key: "etoiles",
    frames: this.anims.generateFrameNumbers("etoiles", {
      frames: [0, 1, 2, 3],
    }),
    frameRate: 6,
    repeat: true,
  });

  // Ennemies
  /*snakesGroup = this.physics.add.group();
  snake1 = this.physics.add.sprite(3700, 500, "snake").setScale(2.5);
  snakesGroup.add(snake1);
  snake2 = this.physics.add.sprite(10700, 500, "snake").setScale(2.5);
  snakesGroup.add(snake2);
  allSnakes = snakesGroup.getChildren();*/

  // Feu
  fireGroup = this.physics.add.group();
  fire1 = this.physics.add.sprite(1400, 360, "fire").setScale(0.3);
  fireGroup.add(fire1);
  //fire2 = this.physics.add.sprite(6100, 320, "fire").setScale(0.3);
  //fireGroup.add(fire2);
  allFire = fireGroup.getChildren();

  // Etoiles
  etoilesGroup = this.physics.add.group();
  etoile1 = this.physics.add.sprite(1300, 800, "etoiles").setScale(2.5);
  etoilesGroup.add(etoile1);
  etoile2 = this.physics.add.sprite(3750, 300, "etoiles").setScale(2.5);
  etoilesGroup.add(etoile2);
  etoile3 = this.physics.add.sprite(5800, 600, "etoiles").setScale(2.5);
  etoilesGroup.add(etoile3);
  etoile4 = this.physics.add.sprite(7650, 200, "etoiles").setScale(2.5);
  etoilesGroup.add(etoile4);
  etoilesGroup.add(etoile3);
  etoile4 = this.physics.add.sprite(18600, 500, "etoiles").setScale(2.5);
  etoilesGroup.add(etoile4);

  allEtoiles = etoilesGroup.getChildren();

  boutonsGroup = this.add.group({ immovable: true, allowGravity: false });
  bouton1 = this.physics.add.sprite(14225, 695, "bouton").setScale(2.5);
  bouton1.body.allowGravity = false;
  bouton1.body.immovable = true;
  bouton2Vert = this.physics.add.sprite(14225, 695, "boutonVert").setScale(2.5);
  bouton2Vert.body.allowGravity = false;
  bouton2Vert.setVisible(false);

  boutonsGroup.add(bouton1);
  boutonsGroup.add(bouton2Vert);

  // Shop de fin
  shop = this.physics.add.sprite(22000, 300, "shop").setScale(0.8);

  // Joueur
  player = this.physics.add.sprite(400, 520, "dude").setScale(2.5);

  // Vaisseaux
  vaisseauFondGroupDroite = this.physics.add.group({ allowGravity: false });
  allvaisseauFondDroite = vaisseauFondGroupDroite.getChildren();
  vaisseauFondGroupGauche = this.physics.add.group({ allowGravity: false });
  allvaisseauFondGauche = vaisseauFondGroupGauche.getChildren();

  // Actions avec clavier
  var dateDernierE = new Date().getTime();

  // Groupe boules bleu
  boulesBleu = this.physics.add.group();

  cursors = this.input.keyboard.createCursorKeys();

  this.cameras.main.setBounds(0, 0, 50000, background.displayHeight);
  this.cameras.main.startFollow(player);

  // Musique
  musique = this.sound.add("musique");
  musique.setVolume(0.1);
  musique.setLoop(true);
  musique.play();

  this.physics.add.collider(player, platforms, changeVitesse1);
  function changeVitesse1(player, platforms) {
    overlapBonusJump = false;
    vitesseJoueur = 500;
  }

  // Collisions plateformes
  this.physics.add.collider(player, platformsVertes, changeVitesse2);
  this.physics.add.collider(player, walls);
  this.physics.add.overlap(player, bonusJump, overlapBonusJumpCheck);
  this.physics.add.collider(platforms, allFire);
  this.physics.add.collider(platformsVertes, allFire);
  this.physics.add.collider(platforms, groupSpikes);
  this.physics.add.collider(platformsVertes, groupSpikes);
  //this.physics.add.collider(platforms, allSnakes);
  this.physics.add.collider(platforms, allEtoiles);
  this.physics.add.overlap(allEtoiles, player, collectStar, null, this);
  this.physics.add.collider(
    boulesBleu,
    boutonsGroup,
    changerCouleurBouton,
    null,
    this,
    this
  );
  this.physics.add.collider(platforms, shop);
  this.physics.add.overlap(player, shop, overlapShop);

  function overlapShop() {
    overlapingShop = true;
  }

  // Son etoile
  sonEtoile = this.sound.add("sonEtoile");
  sonEtoile.setVolume(0.2);

  function collectStar(star) {
    star.disableBody(true, true);
    score++;
    sonEtoile.play();
  }

  function changerCouleurBouton(ya, boule) {
    bouton2Vert.setVisible(true);
    boule.setVisible(false);
    allWalls[12].destroy();
    var a = setInterval(function () {
      allPortes[0].y -= 1;
      if (allPortes[0].y < -400) {
        clearInterval(a);
      }
    }, 10);
  }

  function changeVitesse2(player, platformsVertes) {
    overlapBonusJump = false;
    vitesseJoueur = 1000;
  }

  function overlapBonusJumpCheck() {
    overlapBonusJump = true;
  }

  this.physics.add.collider(player, groupSpikes, collidingSpikesCheck);
  function collidingSpikesCheck(player, spikes) {
    collidingSpikes = true;
  }

  this.physics.add.overlap(player, fireGroup, collidingFireCheck);
  function collidingFireCheck(player, fire) {
    collidingFeu = true;
  }

  /*this.physics.add.overlap(player, snakesGroup, collidingSnakeCheck);
  function collidingSnakeCheck(player, fire) {
    collidingSnake = true;
  }*/

  this.physics.add.overlap(player, etoilesGroup, collidingEtoileCheck);
  function collidingEtoileCheck(player, fire) {
    collidingEtoile = true;
  }

  window.document.onkeydown = function (touche) {
    // Dash
    /*if (touche.keyCode === 32) {
      dateSpace = new Date().getTime();
      if (dateSpace >= dateDernierDash + 2000) {
        dateDernierDash = dateSpace;
        dash.play();
        if (orientationjoueur === 1) {
          player.x += 200;
        } else {
          player.x -= 200;
        }
      }
    }*/

    // Projectiles
    if (touche.keyCode === 69) {
      dateE = new Date().getTime();
      if (dateE >= dateDernierE + 500) {
        dateDernierE = dateE;
        if (orientationjoueur === 1) {
          boulesBleu
            .create(player.x, player.y - 60, "bouleBleu")
            .setOrigin(0, 0)
            .setScale(3).flipX = false;
          boulesBleu.setVelocityX(3000);
        } else {
          boulesBleu
            .create(player.x, player.y - 60, "bouleBleu")
            .setOrigin(0, 0)
            .setScale(3).flipX = true;
          boulesBleu.setVelocityX(-3000);
        }
      }
    }
    // Restart
    if (touche.keyCode === 13) {
      window.location.reload(true);
    }
  };
}

setInterval(function () {
  var chanceDeSpawn = Math.floor(Math.random() * 5 + 1);
  if (chanceDeSpawn === 1) {
    var posX = Math.floor(Math.random() * 24000 + 1);
    var posY = Math.floor(Math.random() * 1000 + 1);
    var taille = Math.floor(Math.random() * 2.5 + 0.5);
    var orientation = Math.random() < 0.5;
    if (orientation < 0.5) {
      vaisseauFondGroupGauche
        .create(posX, posY, "vaisseau")
        .setOrigin(0, 0)
        .setScale(taille)
        .refreshBody()
        .setDepth(-1).flipX = true;
      allvaisseauFondGauche[allvaisseauFondGauche.length - 1].setVelocityX(1);
    } else {
      vaisseauFondGroupDroite
        .create(posX, posY, "vaisseau")
        .setOrigin(0, 0)
        .setScale(taille)
        .refreshBody()
        .setDepth(-1).flipX = false;
    }
  }
}, 15);

// Compteur
var intervalCompteur = setInterval(function () {
  counter--;
  document.getElementById("compteur").innerHTML = "temps restant: " + counter;
  document.getElementById("etoiles").innerHTML = "bonus: " + score;
}, 1000);

var ya = setInterval(function () {
  if (counter === 0 && overlapingShop == true) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "600px";
    div.style.height = "110px";
    div.style.left = "50%";
    div.style.top = "30%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.color = "#5fcde4";
    div.style.fontFamily = "cyber";
    div.style.fontSize = "3rem";
    div.style.textAlign = "center";
    div.innerHTML =
      "vous avez fini, bravo! votre temps est: " + tempsFinal + " secondes";

    var button = document.createElement("button");
    button.innerHTML = "restart";
    button.style.backgroundColor = "#ffde4a";
    button.style.border = "6px solid #5fcde4";
    button.style.cursor = "pointer";
    button.style.color = "black";
    button.style.fontFamily = "cyber";
    button.style.fontSize = "2rem";
    button.style.padding = "3px 11px 6px 11px";
    button.onclick = function () {
      window.location.reload(true);
    };
    button.className = "test";
    div.appendChild(button);
    document.body.prepend(div);

    document.getElementById("restart1").remove();
    clearInterval(intervalCompteur);
    clearInterval(ya);
  } else if (
    counter === 0 ||
    player.y > 2000 ||
    collidingSpikes == true ||
    collidingFeu == true //||
    //collidingSnake == true
  ) {
    var div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "600px";
    div.style.height = "110px";
    div.style.left = "50%";
    div.style.top = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.color = "#5fcde4";
    div.style.fontFamily = "cyber";
    div.style.fontSize = "5rem";
    div.style.textAlign = "center";
    div.innerHTML = "game over";

    var button = document.createElement("button");
    button.innerHTML = "restart";
    button.style.backgroundColor = "#ffde4a";
    button.style.border = "6px solid #5fcde4";
    button.style.cursor = "pointer";
    button.style.color = "black";
    button.style.fontFamily = "cyber";
    button.style.fontSize = "2rem";
    button.style.padding = "3px 11px 6px 11px";
    button.onclick = function () {
      window.location.reload(true);
    };
    button.className = "test";
    div.appendChild(button);
    document.body.prepend(div);

    document.getElementById("restart1").remove();
    cursors = 0;
    clearInterval(intervalCompteur);
    clearInterval(ya);
  }
}, 1);

var boutonvolume = document.getElementById("musiqueoff");
var musiqueOff = false;
boutonvolume.onclick = function () {
  if (musiqueOff == false) {
    boutonvolume.style.backgroundColor = "#5fcde4";
    musique.pause();
    musiqueOff = true;
  } else {
    boutonvolume.style.backgroundColor = "#ffde4a";
    musique.resume();
    musiqueOff = false;
  }
};

var dateDebut = new Date().getTime();
var dateSaut;
var jumpCount = 1;
var vitesseJoueur;
var compteur = 0;
var monte = true;

function update(time, delta) {

  // Bouger vaisseaux

  for (let i = 0; i < allvaisseauFondGauche.length; i++) {
    var vitesse = Math.floor((Math.random() * 4) + 0.5)
    allvaisseauFondGauche[i].x -= vitesse;
  }
  for (let i = 0; i < allvaisseauFondDroite.length; i++) {
    var vitesse = Math.floor((Math.random() * 4) + 0.5)
    allvaisseauFondDroite[i].x += vitesse;
  }


  // Jouer la musique de victoire
  if (overlapingShop == true && triggerMusiqueFin === 0) {
    victoire.play();
    triggerMusiqueFin++;
    musique.stop();
    tempsFinal = 60 - counter;
    counter = 0;
  }

  // Bouger les flèches
  moveSpikes();
  function moveSpikes() {
    for (let i = 0; i < allSpikes.length; i++) {
      if (posInitSpikes < 800) {
        allSpikes[3].y += 0.1;
        allSpikes[4].y += 0.1;
        posInitSpikes += 1;
      } else {
        posInitSpikes = 0;
        allSpikes[3].y -= 80;
        allSpikes[4].y -= 80;
      }
    }
  }

  //Arreter la musique si game over
  if (
    counter === 120 ||
    player.y > 2000 ||
    collidingSpikes == true ||
    collidingFeu == true //||
    //collidingSnake == true
  ) {
    musique.stop();
    gameover.play();
  }

  // Bouger les flèches
  moveArrows();
  function moveArrows() {
    for (let i = 0; i < allArrows.length; i++) {
      if (posInitFleches < 100) {
        allArrows[i].x += 0.5;
        posInitFleches += 1;
      } else {
        posInitFleches = 0;
        allArrows[i].x -= 50;
      }
    }
  }

  // Bouger les serpents
  /*moveSnake();
  if (monte) {
    for (let i = 0; i < allSnakes.length; i++) {
      allSnakes[i].flipX = true;
    }
  } else {
    for (let i = 0; i < allSnakes.length; i++) {
      allSnakes[i].flipX = false;
    }
  }

  function moveSnake() {
    if (compteur < 500 && monte == true) {
      compteur++;
      for (let i = 0; i < allSnakes.length; i++) {
        allSnakes[i].body.position.x += 1;
      }
    } else if (compteur >= 500 && monte == true) {
      monte = false;
      for (let i = 0; i < allSnakes.length; i++) {
        allSnakes[i].body.position.x -= 1;
      }
    } else if (compteur > 0 && monte == false) {
      compteur--;
      for (let i = 0; i < allSnakes.length; i++) {
        allSnakes[i].body.position.x -= 1;
      }
    } else if (compteur <= 0 && monte == false) {
      monte = true;
      for (let i = 0; i < allSnakes.length; i++) {
        allSnakes[i].body.position.x += 1;
      }
    }
  }*/

  // Mouvements Joueurs
  if (cursors.left.isDown) {
    player.setVelocityX(-vitesseJoueur);
    player.flipX = true;
    orientationjoueur = -1;
    player.play("run", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(vitesseJoueur);
    player.flipX = false;
    orientationjoueur = 1;
    player.play("run", true);
  } else {
    player.setVelocityX(0);
    player.play("idle", true);
  }

  //Anims
  for (let i = 0; i < allFire.length; i++) {
    allFire[i].play("bruler", true);
  }
  /*for (let i = 0; i < allSnakes.length; i++) {
    allSnakes[i].play("snakeMarcher", true);
  }*/
  for (let i = 0; i < allEtoiles.length; i++) {
    allEtoiles[i].play("etoiles", true);
  }

  // Double Jump
  if (cursors.up.isDown && overlapingShop == true) {
    player.setVelocityY(-830);
    jumpCount++;
    saut.play();
  } else if (overlapBonusJump == true) {
    if (cursors.up.isDown && jumpCount === 1) {
      player.setVelocityY(-1500);
      jumpCount++;
      saut.play();
    }
  } else {
    if (cursors.up.isDown && (jumpCount === 0 || jumpCount === 1)) {
      dateSaut = new Date().getTime();
      if (dateSaut >= dateDebut + 300) {
        jumpCount++;
        dateDebut = dateSaut;
        player.setVelocityY(-830);
        saut.play();
      }
    }
  }

  // Reset compteur saut
  if (player.body.touching.down == true) {
    jumpCount = 1;
  }
}
