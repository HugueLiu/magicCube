var alpha = 1;
		var isSpining = false;

		// 小立方体
		function Cube(opts) {
			this.box = null;
			this.parent = opts.parent;
			this.sideLength = opts.cubeSideLength;
			this.margin = opts.margin;
			this.init();
			this.box.setAttribute("class","innerbox");
		}
		Cube.prototype.init = function() {
			this.box = this.createface();
			this.box.front = this.createFront();	
			this.box.back = this.createBack();	
			this.box.left = this.createLeft();
			this.box.right = this.createRight();
			this.box.top = this.createTop();
			this.box.bottom = this.createBottom();
			// this.box.style["backface-visibility"] = "hidden";
			this.box.style["transform-style"] = "preserve-3d";
			this.parent.appendChild(this.box);
		};
		Cube.prototype.createface = function() {
			var face = document.createElement("div");
			face.style.width = this.sideLength + 'px';
			face.style.height = this.sideLength + 'px';
			face.style.position = "absolute";
			return face;
		};
		Cube.prototype.createFront = function() {
			var face = this.createface();
			face.style.transform = "translateZ("+(this.sideLength/2)+"px)";
			face.style.background = "rgba(255,0,0," + alpha + ")";
			this.box.appendChild(face);
			return face;
		};
		Cube.prototype.createBack = function() {
			var face = this.createface();
			face.style.transform = "translateZ(-"+(this.sideLength/2)+"px)";
			face.style.background = "rgba(0,255,0," + alpha + ")";
			this.box.appendChild(face);
			return face;
		};
		Cube.prototype.createLeft = function() {
			var face = this.createface();
			face.style.transform = "translateX(-"+(this.sideLength/2)+"px) rotateY(90deg)";
			face.style.background = "rgba(0,0,255," + alpha + ")";
			this.box.appendChild(face);
			return face;
		};
		Cube.prototype.createRight = function() {
			var face = this.createface();
			face.style.transform = "translateX("+(this.sideLength/2)+"px) rotateY(90deg)";
			face.style.background = "rgba(255,255,0," + alpha + ")";
			this.box.appendChild(face);
			return face;
		};
		Cube.prototype.createTop = function() {
			var face = this.createface();
			face.style.transform = "translateY(-"+(this.sideLength/2)+"px) rotateX(90deg)";
			face.style.background = "rgba(0,255,255," + alpha + ")";
			this.box.appendChild(face);
			return face;
		};
		Cube.prototype.createBottom = function() {
			var face = this.createface();
			face.style.transform = "translateY("+(this.sideLength/2)+"px) rotateX(90deg)";
			face.style.background = "rgba(255,255,255," + alpha + ")";
			this.box.appendChild(face);
			return face;
		};

		// 魔方
		function MagicCube(opts) {
			this.countCube = 0;//为每一块方块编号
			this.cubeBox = [[[],[],[]],[[],[],[]],[[],[],[]]]; //every cube
			this.box = null;
			this.parent = opts.parent;
			this.cubeSideLength = opts.cubeSideLength;
			this.margin = opts.margin;
			this.sideLength = this.cubeSideLength * 3 + this.margin * 2;
			this.init();
			this.spinRound();

		}

		MagicCube.prototype.init = function() {
			this.box = document.createElement("div");
			this.box.style.width = this.sideLength + 'px';
			this.box.style.height = this.sideLength + 'px';
			this.box.style.position = "relative";
			this.box.style["transform-style"] = "preserve-3d";
			// this.box.style["perspective-origin"] = "-200% -200%";
			// this.box.style.perspective = "1500px";
			this.box.setAttribute("class","outerbox");
			this.createFront();
			this.createMiddle();
			this.createBack();
			this.parent.appendChild(this.box);
			this.spinStyle = document.createElement("style");
			document.head.appendChild(this.spinStyle);		
		};
		
		// 一层旋转
		MagicCube.prototype.spinLevel = function(dir,countLevel,spinDir) {
			if(isSpining){
				return;
			}
			isSpining = true;

			// spinDir 旋转方向，顺时针为正
			var level = document.createElement("div");
			level.style.width = this.sideLength + 'px';
			level.style.height = this.sideLength + 'px';
			level.style.position = "absolute";
			level.style["transform-style"] = "preserve-3d";

			var newX;
			var newY;
			var newZ;
			var newCube;
			var thisCube;
			var copyLevel =[[],[],[]];

			for(var i = 0; i < 3; i++){
				for(var j = 0; j < 3; j++){
					copyLevel[i][j] = {left:"",right:"",top:"",bottom:"",front:"",back:""};
				}
			}

			var moveCube;
			var that = this;
			if(dir === "x"){
				this.spinStyle.innerHTML = "@keyframes spin1{from{transform:rotateY(90deg) translateZ("+(countLevel-1)*(this.cubeSideLength+this.margin)+"px)} to{transform:rotateY(90deg) translateZ("+(countLevel-1)*(this.cubeSideLength+this.margin)+"px) rotateZ("+(spinDir>0?90:-90)+"deg)}}";

				for(var i = 0; i < 3; i++){
					for(var j = 0; j < 3; j++){
						copyLevel[i][j].left = this.cubeBox[countLevel][i][j].left.style.background;
						copyLevel[i][j].right = this.cubeBox[countLevel][i][j].right.style.background;
						copyLevel[i][j].top = this.cubeBox[countLevel][i][j].top.style.background;
						copyLevel[i][j].bottom = this.cubeBox[countLevel][i][j].bottom.style.background;
						copyLevel[i][j].front = this.cubeBox[countLevel][i][j].front.style.background;
						copyLevel[i][j].back = this.cubeBox[countLevel][i][j].back.style.background;
						
						moveCube = this.cubeBox[countLevel][i][j].cloneNode(true);
						moveCube.style.left = this.sideLength - this.cubeSideLength -  j * (this.cubeSideLength + this.margin) + "px";
						moveCube.style.top = i * (this.cubeSideLength + this.margin) + "px";
						moveCube.style.transform = "rotateY(-90deg)";
						level.appendChild(moveCube);
						this.cubeBox[countLevel][i][j].style.display = "none";
					}
				}
				this.box.appendChild(level);
				level.style.animation = "spin1 1s forwards";
				
				setTimeout(function() {
					level.remove();
					for(var z = 0; z < 3; z++){
						for(var y = 0; y < 3; y++){
							thisCube = copyLevel[y][z];
							
							//得到转动后小方块新位置
							newZ = y-1;
							newY = -z+1;

							if(spinDir * ((y-1) * newZ - (z-1) * newY) <= 0){
								newZ = - newZ;
								newY = - newY;
							}
							newZ += 1;
							newY += 1;
							newCube = that.cubeBox[countLevel][newY][newZ];
							newCube.style.display = "block";
							if(spinDir < 0){
								newCube.left.style.background = thisCube.left;
								newCube.right.style.background = thisCube.right;
								newCube.front.style.background = thisCube.top;
								newCube.top.style.background = thisCube.back;
								newCube.back.style.background = thisCube.bottom;
								newCube.bottom.style.background = thisCube.front;
							}else if(spinDir > 0){
								newCube.left.style.background = thisCube.left;
								newCube.right.style.background = thisCube.right;
								newCube.front.style.background = thisCube.bottom;
								newCube.top.style.background = thisCube.front;
								newCube.back.style.background = thisCube.top;
								newCube.bottom.style.background = thisCube.back;
							}
						}
					}
					isSpining = false;

				},1000);
			}else if(dir === "y"){
				this.spinStyle.innerHTML = "@keyframes spin1{from{transform:rotateX(-90deg) translateZ("+(countLevel-1)*(this.cubeSideLength+this.margin)+"px)} to{transform:rotateX(-90deg) translateZ("+(countLevel-1)*(this.cubeSideLength+this.margin)+"px) rotateZ("+(spinDir>0?90:-90)+"deg)}}";

				for(var i = 0; i < 3; i++){
					for(var j = 0; j < 3; j++){
						copyLevel[i][j].left = this.cubeBox[i][countLevel][j].left.style.background;
						copyLevel[i][j].right = this.cubeBox[i][countLevel][j].right.style.background;
						copyLevel[i][j].top = this.cubeBox[i][countLevel][j].top.style.background;
						copyLevel[i][j].bottom = this.cubeBox[i][countLevel][j].bottom.style.background;
						copyLevel[i][j].front = this.cubeBox[i][countLevel][j].front.style.background;
						copyLevel[i][j].back = this.cubeBox[i][countLevel][j].back.style.background;
						
						moveCube = this.cubeBox[i][countLevel][j].cloneNode(true);
						moveCube.style.left = i * (this.cubeSideLength + this.margin) + "px";
						moveCube.style.top = this.sideLength - this.cubeSideLength - j * (this.cubeSideLength + this.margin) + "px";
						moveCube.style.transform = "rotateX(90deg)";
						level.appendChild(moveCube);
						this.cubeBox[i][countLevel][j].style.display = "none";
					}
				}

				this.box.appendChild(level);
				level.style.animation = "spin1 1s forwards";

				setTimeout(function() {
					level.remove();
					for(var z = 0; z < 3; z++){
						for(var x = 0; x < 3; x++){
							thisCube = copyLevel[x][z];
							newZ = x-1;
							newX = -z+1;

							if(spinDir * ((x-1) * newZ - (z-1) * newX) > 0){
								newZ = - newZ;
								newX = - newX;
							}
							newZ += 1;
							newX += 1;
							newCube = that.cubeBox[newX][countLevel][newZ];
							newCube.style.display = "block";
							if(spinDir > 0){
								newCube.top.style.background = thisCube.top;
								newCube.bottom.style.background = thisCube.bottom;
								newCube.front.style.background = thisCube.left;
								newCube.back.style.background = thisCube.right;
								newCube.left.style.background = thisCube.back;
								newCube.right.style.background = thisCube.front;
							}else if(spinDir < 0){
								newCube.top.style.background = thisCube.top;
								newCube.bottom.style.background = thisCube.bottom;
								newCube.front.style.background = thisCube.right;
								newCube.back.style.background = thisCube.left;
								newCube.left.style.background = thisCube.front;
								newCube.right.style.background = thisCube.back;
							}
						}
					}
					isSpining = false;
				},1000);
			}else if(dir === "z"){
				this.spinStyle.innerHTML = "@keyframes spin1{from{transform:translateZ("+(countLevel-1)*(this.cubeSideLength+this.margin)+"px)} to{transform:translateZ("+(countLevel-1)*(this.cubeSideLength+this.margin)+"px) rotateZ("+(spinDir>0?90:-90)+"deg)}}";

				for(var i = 0; i < 3; i++){
					for(var j = 0; j < 3; j++){
						copyLevel[i][j].left = this.cubeBox[i][j][countLevel].left.style.background;
						copyLevel[i][j].right = this.cubeBox[i][j][countLevel].right.style.background;
						copyLevel[i][j].top = this.cubeBox[i][j][countLevel].top.style.background;
						copyLevel[i][j].bottom = this.cubeBox[i][j][countLevel].bottom.style.background;
						copyLevel[i][j].front = this.cubeBox[i][j][countLevel].front.style.background;
						copyLevel[i][j].back = this.cubeBox[i][j][countLevel].back.style.background;
						
						moveCube = this.cubeBox[i][j][countLevel].cloneNode(true);
						moveCube.style.left =i * (this.cubeSideLength + this.margin) + "px";
						moveCube.style.top = j * (this.cubeSideLength + this.margin) + "px";
						level.appendChild(moveCube);
						this.cubeBox[i][j][countLevel].style.display = "none";
					}
				}

				this.box.appendChild(level);
				level.style.animation = "spin1 1s forwards";

				setTimeout(function() {
					level.remove();
					for(var y = 0; y < 3; y++){
						for(var x = 0; x < 3; x++){
							thisCube = copyLevel[x][y];
							newY = x-1;
							newX = -y+1;

							if(spinDir * ((x-1) * newY - (y-1) * newX) <= 0){
								newY = - newY;
								newX = - newX;
							}
							newY += 1;
							newX += 1;
							newCube = that.cubeBox[newX][newY][countLevel];
							newCube.style.display = "block";
							if(spinDir > 0){
								newCube.front.style.background = thisCube.front;
								newCube.back.style.background = thisCube.back;
								newCube.top.style.background = thisCube.left;
								newCube.bottom.style.background = thisCube.right;
								newCube.left.style.background = thisCube.bottom;
								newCube.right.style.background = thisCube.top;
							}else if(spinDir < 0){
								newCube.front.style.background = thisCube.front;
								newCube.back.style.background = thisCube.back;
								newCube.top.style.background = thisCube.right;
								newCube.bottom.style.background = thisCube.left;
								newCube.left.style.background = thisCube.top;
								newCube.right.style.background = thisCube.bottom;
							}
						}
					}
				isSpining = false;
				},1000);
			}
		};
		// 整体旋转
		MagicCube.prototype.spinRound = function() {
			this.box.style.animation = "spin linear 5s infinite";
		};
		MagicCube.prototype.createface = function(level) {
			var face = document.createElement("div");
			face.style.width = this.sideLength + 'px';
			face.style.height = this.sideLength + 'px';
			face.style.position = "absolute";
			face.style["transform-style"] = "preserve-3d";
			if(level === null){
				for(var i = 0; i < 3; i++){
					for(var j = 0; j < 3; j++){
						console.log(opts.cubeSideLength);
						var cube = new Cube({parent:face,cubeSideLength:this.cubeSideLength,margin:this.margin});
						cube.box.style.left = j * (cube.sideLength + this.margin) + "px";
						cube.box.style.top = i * (cube.sideLength + this.margin) + "px";
						face.appendChild(cube.box);
					}
				}
			}else{
				for(var i = 0; i < 3; i++){
					for(var j = 0; j < 3; j++){
						var cube = new Cube({parent:face,cubeSideLength:this.cubeSideLength,margin:this.margin});
						cube.box.style.left = j * (cube.sideLength + this.margin) + "px";
						cube.box.style.top = i * (cube.sideLength + this.margin) + "px";
						this.cubeBox[j][i][level] = cube.box;
						face.appendChild(cube.box);
					}
				}

			}
			return face;
		};
		MagicCube.prototype.createFront = function() {
			var face = this.createface(2);
			face.setAttribute("class","front");

			face.style.transform = "translateZ("+(this.cubeSideLength+this.margin)+"px)";
			this.box.appendChild(face);
		};
		MagicCube.prototype.createMiddle = function() {
			var face = this.createface(1);
			face.setAttribute("class","middle");
			this.box.appendChild(face);
		};
		MagicCube.prototype.createBack = function() {
			var face = this.createface(0);
			face.setAttribute("class","back");
			face.style.transform = "translateZ(-"+(this.cubeSideLength+this.margin)+"px)";
			this.box.appendChild(face);
		};


		var MC = document.getElementsByClassName("MC")[0];
		var mc = new MagicCube({parent:MC,cubeSideLength:80,margin:10});
		
		var count = 0;
		var dirc = ["x","y","z"];
		var timer = setInterval(function() {
			if (count < 10){
				count++;
				var dirnum = Math.floor(Math.random() * 3);
				var countLevel = Math.floor(Math.random() * 3);
				var countSpin = Math.floor(Math.random() * 2 - 1 );
				mc.spinLevel(dirc[dirnum],countLevel,1);

			}else{
				clearInterval(timer);
			}
		},2000);