// Shawn Bond
// 06/24/24
// CONTROLLER FOR GAME PIECES

// returns a count of tiles remaining in the 'bag' (ScrabbleTiles array)
function getRemainingTiles() {
    var numTiles = 0;
    // sum all tiles in bag
    $.each(ScrabbleTiles, function(key, tile) {
        numTiles += tile["number-remaining"];
    });
    return numTiles;
}

// returns a quantity of tile objects to the rack
function createTilesForRack(quantity) {
    var $rack = $();

    // count how many tiles are avaliable to chose from
    var numTiles = getRemainingTiles();
    // update avaliable tiles table
    getTileDistribution();

    // for each request
    for (var i = 0; i < quantity; i++) {
        // check if bag is empty
        if (numTiles === 0) {
            // bag is empty, update counter and return
            console.log("Out of tiles in bag");
            $("#tiles-remaining").text(numTiles);
            break;
        } else {
            // bag is not empty, get random tile
            randTile = getRandomTile();
            // update bag
            if (ScrabbleTiles[randTile]["number-remaining"] > 0) {
                var $img = $("<img>", {
                    "class": "tile",
                    "id": randTile,
                    "src": "images/tiles/Scrabble_Tile_" + randTile + ".jpg"
                });
                // decrement remaining quantity
                ScrabbleTiles[randTile]["number-remaining"]--;
                // add to rack
                $rack = $rack.add($img);
            }
        }
    }
    // update totals
    $("#tiles-remaining").text(getRemainingTiles());
    return $rack;
}

// gets a pseudorandom tile from all avaliable tiles
function getRandomTile() {
    // count how many tiles are avaliable to chose from
    var numTiles = getRemainingTiles();
    // generate pseudorandom number
    var rand = Math.floor(Math.random() * numTiles);
    var sum = 0;
    // tile object
    var randTile = null;

    // for each tile in the 'bag'
    // itterate until we reach the random index
    // return the tile at the random index
    $.each(ScrabbleTiles, function(key, tile) {
        sum += tile["number-remaining"];
        if (rand < sum) {
            randTile = key;
            // break loop
            return false;
        }
    });
    return randTile;
}

// function to return tiles to ScrabbleTiles array
function returnTilesToBag() {
    // for each tile on the rack
    $(".rack-container img").each(function() {
        // get tile name and update bag
        var tile = $(this).attr("id");
        if (ScrabbleTiles[tile]) {
            ScrabbleTiles[tile]["number-remaining"]++;
        }
    });
}

// resets the quantity of tiles back to the default distribution
function resetTileDistribution() {
    // for each tile in the bag
    // set remaining quantity to original quantity
    for (var index in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(index)) {
            ScrabbleTiles[index]["number-remaining"] = ScrabbleTiles[index]["original-distribution"];
        }
    }
}

// updates table with current distribution of tiles
function getTileDistribution() {
    // get DOM elements
    var table = document.getElementById("bag-table");
    var tbody = table.getElementsByTagName("tbody")[0];
    // wipe table contents
    tbody.innerHTML = '';
    var row, cell, tileId;
    var index = 0;
    // for each tile in the bag
    for (tileId in ScrabbleTiles) {
        if (ScrabbleTiles.hasOwnProperty(tileId)) {
            // limit row to 4 columns
            if (index % 4 === 0) {
                row = tbody.insertRow();
            }
            // update table content
            cell = row.insertCell();
            cell.innerHTML = tileId + ": " + ScrabbleTiles[tileId]["number-remaining"];
            // goto next index in bag
            index++;
        }
    }
}

// allow tiles to be dragged
function enableDrag() {
    $(".tile").draggable({
        // rules
        cursor: "grabbing",
        opacity: 0.75,
        revert: "invalid",
        start: function(event, ui) {
            // get starting position and save
            $(this).data("startingPosition", ui.position);
        }
    });
}