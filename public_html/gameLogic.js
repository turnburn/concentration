	var person = prompt("Please enter your name");
	var score = 0;
	var attempts = 0;
	var scoreLabel = $("<h2>Score: <span id=\"scorePrompt\"></span></h2>");
	$("#scorePrompt").append(scoreLabel);


	function playGame(){

		$.ajax({
		  method:"GET",
		  url:'/memory/intro',
		  data: {username:person},
		  success: displayGame,
		  dataType:'json'
		});

		//Check to see how many tiles have flipped
		var flippedTiles = [];

		function displayGame(data){

			console.log(data);

			$("#gameboard").empty();

			var indexIncrement = 0;
			
			//Nested for loop to create the 4x4 gameboard
			for (var i = 0; i < 4; i++){

				var tileObject = $("<tr id=\"row"+i+"\"  > </tr>");

				//Create 4 divs within the row
				for(var r=0; r < 4; r++){
				 	var object  = $("<div class='tile' id=\"tileId"+i+r+"\" data-rowindex='"+i+"' data-columnindex='"+r+"'></div> ");
				 	object.click(chooseTile);
				 	tileObject.append(object);
				}
				//Add the row to the board
			 	$("#gameboard").append(tileObject);
			 	

			}
			//Add the username to the screen
			$("#userPrompt").append(person);
		}


		function chooseTile(){
			$.ajax({
			  method:"GET",
			  url:'/memory/card',
			  data: {username : person, rowindex : $(this).data('rowindex'), columnindex : $(this).data('columnindex') },
			  success: checkTile,
			  dataType:'json'
			});

			//Use this function to check which tile it was
			function checkTile(data){
				
				var rowString="#row"+data.row;
				var tileString="#tileId"+data.row+data.column;

				//find the tile Class
				var tileClass = $($("#gameboard > "+rowString+" > "+tileString)).attr('class');
				
				//Change the tile to the flippedtile class with a changed background
				$("#gameboard > "+rowString+" > "+tileString).toggleClass("flippedtile");
				//Remove the click handler while flipped
				$("#gameboard > "+rowString+" > "+tileString).off();
				//Find the value and add it as a div in the tile element
				var valueObject = $("<div> <span>"+data.value+" </span> </div> ");
				$("#gameboard > "+rowString+" > "+tileString).append(valueObject);	

				//Push this tile info as an array to a list
				flippedTiles.push([data.row, data.column, data.value]);

				compareTiles();
				console.log(flippedTiles);





			}


		}

		function compareTiles(){

			//If more than 2 tiles have been flipped
			if(flippedTiles.length === 3){

				//Increment attempts
				attempts++;

				//Find the values associated with the tiles
				var value1 = flippedTiles[0][2];
				var value2 = flippedTiles[1][2];

				//If they are the same
				if(value1 === value2){
					//Remove their click functionality
					$("#gameboard > #row"+flippedTiles[0][0]+" > #tileId"+flippedTiles[0][0]+flippedTiles[0][1]).off();
					$("#gameboard > #row"+flippedTiles[1][0]+" > #tileId"+flippedTiles[1][0]+flippedTiles[1][1]).off();

					//Remove them from the list
					flippedTiles.splice(0, 1);
					flippedTiles.splice(0, 1);
					//Increment the score
					score++;
					//Update the score label
					$("#scorePrompt").empty();
					$("#scorePrompt").append(score);			
				}
				//If they are not the same
				else{
					//Add the click listener back
					$("#gameboard > #row"+flippedTiles[0][0]+" > #tileId"+flippedTiles[0][0]+flippedTiles[0][1]).click(chooseTile);
					$("#gameboard > #row"+flippedTiles[1][0]+" > #tileId"+flippedTiles[1][0]+flippedTiles[1][1]).click(chooseTile);
					//Toggle the class back to tile
					$("#gameboard > #row"+flippedTiles[0][0]+" > #tileId"+flippedTiles[0][0]+flippedTiles[0][1]).toggleClass("flippedtile");
					$("#gameboard > #row"+flippedTiles[1][0]+" > #tileId"+flippedTiles[1][0]+flippedTiles[1][1]).toggleClass("flippedtile");
					//Remove the value from the tile
					$("#gameboard > #row"+flippedTiles[0][0]+" > #tileId"+flippedTiles[0][0]+flippedTiles[0][1]).empty();
					$("#gameboard > #row"+flippedTiles[1][0]+" > #tileId"+flippedTiles[1][0]+flippedTiles[1][1]).empty();		
					
					//Remove them from the list
					flippedTiles.splice(0, 1);
					flippedTiles.splice(0, 1);
				}
			}
			//If the score is 7 and there is only two flipped, the game is over..
			if(score === 7 && flippedTiles.length === 2){
				//Alert the player they won
				alert("You Won! Attempts : "+attempts);
				//Set the labels back to initial to start new game
				$("#userPrompt").empty();
				$("#scorePrompt").empty();
				$("#scorePrompt").append(0);
				score = 0;
				//Rerun the whole function
				playGame();
			}

		}
	}

	//Start the game
	playGame()
