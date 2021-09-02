class Player
{
	constructor(imgSrc, x, y)
	{
		this.imgSrc = imgSrc;
		this.srcX = 0;
		this.srcY = 0;
		this.x = x;
		this.y = y;
		this.imgSheetHeight = 576;
		this.imgSheetWidth = 256;
		this.rows = 4;
		this.cols = 9;
		this.playerHeight = this.imgSheetHeight / this.cols;
		this.playerWidth = this.imgSheetWidth / this.rows;
		this.curFrame = 0;
		this.frameCount = 9;
		this.speedX = 7;
		this.speedY = 7;
	}

	render()
	{
		cxt.drawImage(this.imgSrc, this.srcX, this.srcY, this.playerWidth, this.playerHeight,
		camera.offset[0] + this.x, camera.offset[1] + this.y, this.playerWidth, this.playerHeight);
	}
	
	updateFrame()
	{
		this.curFrame = ++this.curFrame % this.frameCount;
		this.srcX = this.curFrame * this.playerWidth;
		cxt.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	draw()
	{
		this.updateFrame();
		cxt.drawImage(this.imgSrc, this.srcX, this.srcY, this.playerWidth, this.playerHeight,
		camera.offset[0] + this.x, camera.offset[1] + this.y, this.playerWidth, this.playerHeight);
	}
	
	idle()
	{
		cxt.clearRect(0, 0, canvas.width, canvas.height);
		this.curFrame = 0;
		this.srcX = 0;
		cxt.drawImage(this.imgSrc, this.srcX, this.srcY, this.playerWidth, this.playerHeight, this.x, this.y,
		this.playerWidth, this.playerHeight);
	}
	
	checkMove(x, y)
	{
		if(gameMap.gMap[Math.floor(y / gameMap.tileH)][Math.floor(x / gameMap.tileW)] != 0 && 
		gameMap.gMap[Math.floor(y / gameMap.tileH)][Math.floor(x / gameMap.tileW)] != 1) return false;
		
		//console.log(gameMap.gMap[Math.floor(y / gameMap.tileH)][Math.floor(x / gameMap.tileW)]);
		return true;
	}
	
	walk(code)
	{
		switch(code)
		{
			case 65:
				if(this.checkMove(this.x + 14, this.y + 14))
				{
					this.srcY = this.playerHeight;
					this.x -= this.speedX;
					this.draw();
				}
				break;
			case 87:
				if(this.checkMove(this.x + 24, this.y + 8))
				{
					this.srcY = 0;
					this.y -= this.speedY;
					this.draw();
				}
				break;
			case 68:
				if(this.checkMove(this.x + this.playerWidth - 18, this.y + 14))
				{
					this.srcY = this.playerHeight * 3;
					this.x += this.speedX;
					this.draw();
				}
				break;
			case 83:
				if(this.checkMove(this.x + 24, this.y + this.playerHeight))
				{
					this.srcY = this.playerHeight * 2;
					this.y += this.speedY;
					this.draw();
				}
		}
	}
}

class GameMap
{	
	constructor(gMap)
	{
		this.tileW = 64;
		this.tileH = 64;
		this.gMap = gMap;
		this.grass = new Image();
		this.ground = new Image();
		this.sign = new Image();
		this.tree = new Image();
		this.wall_top = new Image();
		this.wall_top.src = 'wall_top.png';
		this.tree.src = 'tree.png';
		this.sign.src = 'sign.png';
		this.grass.src = 'grass.png';
		this.ground.src = 'ground.png';
		this.srcX = 0;
		this.srcY = 0;
	}
	
	render()
	{
		for(let i = camera.startTile[1]; i < camera.endTile[1]; i++)
		{
			for(let j = camera.startTile[0]; j < camera.endTile[0]; j++)
			{
				cxt.fillRect(camera.offset[0] + this.tileH * j, camera.offset[1] + this.tileW * i, this.tileH, this.tileW);
				
				switch(this.gMap[i][j])
				{
				case 0:
					cxt.drawImage(this.ground, this.srcX, this.srcY, this.tileH, this.tileW,
					camera.offset[0] + this.tileH * j, camera.offset[1] + this.tileW * i, this.tileH, this.tileW);
					break;
				case 1:
					cxt.drawImage(this.grass, this.srcX, this.srcY + this.tileH, this.tileH, this.tileW,
					camera.offset[0] + this.tileH * j, camera.offset[1] + this.tileW * i, this.tileH, this.tileW);
					break;
				case 2:
					cxt.drawImage(this.sign, this.srcX, this.srcY, this.tileH, this.tileW,
					camera.offset[0] + this.tileH * j, camera.offset[1] + this.tileW * i, this.tileH, this.tileW);
					break;
				case 3:
					cxt.drawImage(this.tree, this.srcX, this.srcY, this.tileH, this.tileW,
					camera.offset[0] + this.tileH * j, camera.offset[1] + this.tileW * i, this.tileH, this.tileW);
					break;
				case 4:
					cxt.drawImage(this.wall_top, this.srcX, this.srcY, this.tileH, this.tileW,
					camera.offset[0] + this.tileH * j, camera.offset[1] + this.tileW * i, this.tileH, this.tileW);
				}
			}
			if(camera.endTile[1] >= this.gMap.length)
				camera.endTile[1] = this.gMap.length;
		}
	}
}

class Camera
{
	constructor()
	{
		this.screen = [600, 600];
		this.startTile = [0, 0];
		this.endTile = [0, 0];
		this.offset = [0, 0];
		this.tileHeight = 64;
		this.tileWidth = 64;
	}

	update(px, py)
	{
		this.offset[0] = Math.floor((this.screen[0] / 2) - px);
		this.offset[1] = Math.floor((this.screen[1] / 2) - py);
		
		var tile = [
			Math.floor(px / this.tileWidth),
			Math.floor(py / this.tileHeight)
		];
		
		this.startTile[0] = tile[0] - 1 -
			Math.ceil((this.screen[0] / 2) / this.tileWidth);
		this.startTile[1] = tile[1] - 1 -
			Math.ceil((this.screen[1] / 2) / this.tileHeight);
		
		if(this.startTile[0] < 0)
			this.startTile[0] = 0;
		
		if(this.startTile[1] < 0)
			this.startTile[1] = 0;
		
		this.endTile[0] = tile[0] + 6
			Math.ceil((this.screen[0] / 2) / this.tileWidth);
		this.endTile[1] = tile[1] + 6 +
			Math.ceil((this.screen[1] / 2) / this.tileHeight);
		
		if(this.endTile[0] >= GameMap.tileW)
			this.endTile[0] = GameMap.tileW;
		
		if(this.endTile[1] >= GameMap.tileH)
			this.endTile[1] = GameMap.tileH;
	}
}

//light green- #8ad64a