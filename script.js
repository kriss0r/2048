var Game = {
	board: [],
	cols: 4,
	rows: 4,
	init: function(){
		var board = jQuery("#game");
		var data = jQuery.extend({
			cols: Game.cols,
			rows: Game.rows,
		}, board.data());
		Game.cols = data['cols'];
		Game.rows = data['rows'];
		for(y=0; y<Game.rows; y++){
			Game.board.push([]);
			for(x=0; x<Game.cols; x++)
				Game.board[y].push(0);
		}
		Game._render();
		Game._addPiece();
		jQuery(document).keydown(function(e){
			if(e.which == 37)
				Game._moveLeft();
			else if(e.which == 38)
				Game._moveUp();
			else if(e.which == 39)
				Game._moveRight();
			else if(e.which == 40)
				Game._moveDown();
		});
	},
	_addPiece: function(){
		var emptyFields = Game._getEmptyFields();
		if(!emptyFields.length){
			Game._over();
			return false;
		}
		var item = emptyFields[Math.floor(Math.random() * emptyFields.length)];
		Game.board[item.y][item.x] = 2;
		var cell = jQuery("<div></div>").addClass("game-board-cell");
		cell.css({left: item.x*100, top: item.y*100});
		cell.prop({id: 'cell-'+item.y+'-'+item.x});
		cell.html(Game.board[item.y][item.x]);
		cell.addClass("cell-value-2");
		jQuery("#game").append(cell);
		window.setTimeout(function(){
			cell.css({opacity: 1});
		}, 10);
	},
	_getEmptyFields: function(){
		var x,y;
		var fields = [];
		for(y=0; y<Game.rows; y++)
			for(x=0; x<Game.cols; x++)
				if(Game.board[y][x] == 0)
					fields.push({x: x, y: y});
		return fields;
	},
	_moveLeft: function(){
		var x, y, z, value;
		var moved = false;
		for(y=0; y<Game.rows; y++){
			for(x=0; x<Game.cols; x++){
				if(Game.board[y][x] == 0){
					for(z=x+1; z<Game.cols; z++){
						if(Game.board[y][z] > 0){
							moved = Game._movePiece(z, y, x, y);
							break;
						}
					}
				}
				if(Game.board[y][x] > 0){
					value = Game.board[y][x];
					for(z=x+1; z<Game.cols; z++){
						if(Game.board[y][z] == value){
							moved = Game._combinePieces(z, y, x, y);
							true;
							break;
						}
						else if(Game.board[y][z] != 0)
							break;
					}
				}
			}
		}
		if(moved)
			Game._addPiece();
	},
	_moveUp: function(){
		var x, y, z, value;
		var moved = false;
		for(x=0; x<Game.cols; x++){
			for(y=0; y<Game.rows; y++){
				if(Game.board[y][x] == 0){
					for(z=y+1; z<Game.rows; z++){
						if(Game.board[z][x] > 0){
							moved = Game._movePiece(x, z, x, y);
							break;
						}
					}
				}
				if(Game.board[y][x] > 0){
					value = Game.board[y][x];
					for(z=y+1; z<Game.rows; z++){
						if(Game.board[z][x] == value){
							moved = Game._combinePieces(x, z, x, y);
							break;
						}
						else if(Game.board[z][x] != 0)
							break;
					}
				}
			}
		}
		if(moved)
			Game._addPiece();
	},
	_moveDown: function(){
		var x, y, z, value;
		var moved = false;
		for(x=Game.cols-1; x>=0; x--){
			for(y=Game.rows-1; y>=0; y--){
				if(Game.board[y][x] == 0){
					for(z=y-1; z>=0; z--){
						if(Game.board[z][x] > 0){
							moved = Game._movePiece(x, z, x, y);
							break;
						}
					}
				}
				if(Game.board[y][x] > 0){
					value = Game.board[y][x];
					for(z=y-1; z>=0; z--){
						if(Game.board[z][x] == value){
							moved = Game._combinePieces(x, z, x, y);
							break;
						}
						else if(Game.board[z][x] != 0)
							break;
					}
				}
			}
		}
		if(moved)
			Game._addPiece();
	},
	_moveRight: function(){
		var x, y, z, value;
		var moved = false;
		for(x=Game.cols-1; x>=0; x--){
			for(y=Game.rows-1; y>=0; y--){
				if(Game.board[y][x] == 0){
					for(z=x-1; z>=0; z--){
						if(Game.board[y][z] > 0){
							moved = Game._movePiece(z, y, x, y);
							break;
						}
					}
				}
				if(Game.board[y][x] > 0){
					value = Game.board[y][x];
					for(z=x-1; z>=0; z--){
							continue;
						if(Game.board[y][z] == value){
							moved = Game._combinePieces(z, y, x, y);
							break;
						}
						else if(Game.board[y][z] != 0)
							break;
					}
				}
			}
		}
		if(moved)
			Game._addPiece();
	},
	_combinePieces: function(fromX, fromY, toX, toY){
		var cellTo = jQuery("#game #cell-"+toY+"-"+toX);
		var cellFrom = jQuery("#game #cell-"+fromY+"-"+fromX);
		cellTo.css({zIndex: 1000});
		cellFrom.prop({id: "cell-"+toY+"-"+toX});
		cellFrom.css({zIndex: 1001, left: toX*100, top: toY*100});
		Game.board[toY][toX] += Game.board[fromY][fromX];
		cellFrom.html(Game.board[toY][toX]);
		cellFrom.addClass("cell-value-"+Game.board[toY][toX]);
		cellFrom.removeClass("cell-value-"+Game.board[fromY][fromX]);
		Game.board[fromY][fromX] = 0;
		window.setTimeout(function(){
			cellTo.remove();
		}, 150);
		return true;
	},
	_movePiece: function(fromX, fromY, toX, toY){
		Game.board[toY][toX] = Game.board[fromY][fromX];
		var cell = jQuery("#game #cell-"+fromY+"-"+fromX);
		cell.prop({id: "cell-"+toY+"-"+toX});
		cell.css({left: toX*100, top: toY*100});
		Game.board[fromY][fromX] = 0;
		return true;
	},
	_over: function(){
		alert( "Game over!" );
	},
	_render: function(){
		var border;
		var board = jQuery("#game").addClass('game-board');
		board.css({width: Game.cols*100, height: Game.rows*100});
		for(y=1; y<Game.rows; y++){
			border	= jQuery("<div></div>").addClass('game-board-border');
			border.css({left: 0, top: y*100, width: Game.cols*100});
			board.append(border);
		}
		for(x=1; x<Game.cols; x++){
			border	= jQuery("<div></div>").addClass('game-board-border');
			border.css({left: x*100, top: 0, height: Game.rows*100});
			board.append(border);
		}
	}
};
