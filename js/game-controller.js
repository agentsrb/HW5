// Shawn Bond
// 06/24/24
// CONTROLLER FOR GAME MECHANICS

// on page load
$(function() {
    var IS_FIRST_MOVE = true;
    var TOTAL_SCORE = 0;

    // on game start
    // place 7 tiles in rack
    var $rack = createTilesForRack(7);
    $(".rack-container").append($rack);
    enableDrag();


    // buttons and events
    // regenerate tiles on button click
    $("#regenerate-tiles").click(function() {
        returnTilesToBag();
        // clear tiles
        $(".rack-container").empty();
        // generate new tiles
        refillRack();
    });

    // clear game board
    $('#clear-board').click(function() {
        clearBoard();
    });

    // update word score when tile is placed on board
    $(".scrabble-board-tile").on("tilePlaced", getWordScore);

    // calculate word value and apply to total score
    $("#submit-word").click(function() {
        var score = getWordScore();
        TOTAL_SCORE += score;
        $("#total-score").text(TOTAL_SCORE);
        clearBoard();
        refillRack();
    });

    // reset game state to default
    $("#restart-game").click(function() {
        // tiles
        clearBoard();
        $(".rack-container").empty();
        // reset scores
        TOTAL_SCORE = 0;
        $("#word-score").text("0");
        $("#total-score").text(TOTAL_SCORE);
        // reset bag
        resetTileDistribution();
        refillRack();
    });


    // droppable areas
    $(".scrabble-board-tile").droppable({
        accept: ".tile",
        // append self to target on successful drop
        drop: function(event, ui) {
            // check if tile is already in cell
            if ($(this).find(".tile").length === 0) {
                // check if first move or adjacent
                if (IS_FIRST_MOVE || isAdjacent($(this))) {
                    // is valid move
                    ui.draggable.detach().css({
                        top: 0,
                        left: 0,
                    }).appendTo($(this));
                    // trigger update event
                    $(this).trigger("tilePlaced");
                    // lock tile in position
                    ui.draggable.draggable("disable");
                    // any move after a valid move cannot be the first move
                    IS_FIRST_MOVE = false;
                } else {
                    // prevent drag-drop
                    ui.draggable.draggable("option", "revert", true);
                }
            } else {
                // prevent drag-drop
                ui.draggable.draggable("option", "revert", true);
            }
            // reset borders
            $(this).css({
                "border": "solid black",
                "border-width": "6px 4px 6px 4px"
            });
        },


        // on drag-drop hover
        over: function(event, ui) {
            // check if tile is already present and highlight borders
            if ($(this).find(".tile").length > 0) {
                // invalid square
                $(this).css({
                    "border": "solid red",
                    "border-width": "6px 4px 6px 4px"
                });
            } else {
                // if first move or adjacent
                if (IS_FIRST_MOVE || isAdjacent($(this))) {
                    // valid square
                    $(this).css({
                        "border": "solid green",
                        "border-width": "6px 4px 6px 4px"
                    });
                } else {
                    // invalid square
                    $(this).css({
                        "border": "solid red",
                        "border-width": "6px 4px 6px 4px"
                    });
                }
            }
        },


        // on drag-drop hover exit
        out: function(event, ui) {
            $(this).css({
                "border": "solid black",
                "border-width": "6px 4px 6px 4px"
            });
        }
    });


    // calculates the score for all tiles on the board
    function getWordScore() {
        var wordScore = 0;
        var wordMultiplier = 1;
        // for each space on the board
        $(".scrabble-board-tile").each(function() {
            var $tile = $(this).find("img");
            if ($tile.length > 0) {
                // if there is a tile on the space
                // get tile value and space type
                var tileId = $tile.attr("id");
                var tileClass = $(this).attr("class");
                var tileValue = ScrabbleTiles[tileId].value;
                // calculate points for space
                if (tileClass.includes("scrabble-board-blue")) {
                    // double letter score
                    tileValue *= 2;
                }
                if (tileClass.includes("scrabble-board-red")) {
                    // double word score
                    wordMultiplier *= 2;
                }
                // running total for word score
                wordScore += tileValue;
            }
        });
        // apply double word score multiplier and update
        wordScore *= wordMultiplier;
        $("#word-score").text(wordScore);
        return wordScore;
    }

    // checks if pos is adjacent to a tile
    function isAdjacent($tile) {
        // get target position
        var pos = $tile.index();
        var adjacent_tiles = 0;

        // check left
        if (pos > 0 && $tile.parent().children().eq(pos - 1).has("img").length > 0) {
            adjacent_tiles++;
        }

        // check right
        if (pos < $tile.parent().children().length - 1 && $tile.parent().children().eq(pos + 1).has("img").length > 0) {
            adjacent_tiles++;
        }
        return adjacent_tiles > 0;
    }

    // clears game board
    function clearBoard() {
        // select all tiles in the board and remove
        $(".scrabble-board-tile .tile").remove();
        // reset css
        $(".scrabble-board-tile").css({
            "border": "solid black",
            "border-width": "6px 4px 6px 4px"
        });
        // allow free placement
        IS_FIRST_MOVE = true;
        // update score
        getWordScore();
    }

    // updates rack to 7 tiles
    function refillRack() {
        // determine how many tiles are missing from the rack
        var curTiles = $(".rack-container .tile").length;
        var tilesNeeded = 7 - curTiles;
        // if rack is missing tiles AND there are avaliable tiles
        if (tilesNeeded > 0 && getRemainingTiles() > 0) {
            // attempt to generate tiles and place in rack
            var $rack = createTilesForRack(tilesNeeded);
            $(".rack-container").append($rack);
            enableDrag();
        }
    }

});