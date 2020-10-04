<?php
/*
    From this file, you can edit the various meta-information of your game.

    Once you modified the file, don't forget to click on "Reload game
    informations" from the Control Panel in order in can be taken into account.

    See documentation about this file here:
    http://en.doc.boardgamearena.com/Game_meta-information:_gameinfos.inc.php
*/

$gameinfos = [

'game_name' => "Casino",
'designer' => '(Uncredited)',
'artist' => '(Uncredited)',
'year' => 1792,
'publisher' => '(Public Domain)',
'publisher_website' => '',
'publisher_bgg_id' => 171,
'bgg_id' => 18121,
'players' => [2, 3, 4],
'suggest_player_number' => null,
'not_recommend_player_number' => null,
'estimated_duration' => 10,
'fast_additional_time' => 30,
'medium_additional_time' => 40,
'slow_additional_time' => 50,
'tie_breaker_description' => "",
'losers_not_ranked' => false,
'solo_mode_ranked' => false,
'is_beta' => 1,
'is_coop' => 0,
'complexity' => 2,
'luck' => 3,
'strategy' => 3,
'diplomacy' => 3,
'player_colors' => ["ff0000", "008000", "0000ff", "ffa500", "773300"],
'favorite_colors_support' => true,
'disable_player_order_swap_on_rematch' => false,
'game_interface_width' => [
    'min' => 320,
    'max' => null
],

// Game presentation
// Short game presentation text that will appear on the game description page, structured as an array of paragraphs.
// Each paragraph must be wrapped with totranslate() for translation and should not contain html (plain text without formatting).
// A good length for this text is between 100 and 150 words (about 6 to 9 lines on a standard display)
'presentation' => array(
//    totranslate("This wonderful game is about geometric shapes!"),
//    totranslate("It was awarded best triangle game of the year in 2005 and nominated for the Spiel des Jahres."),
//    ...
),

// Games categories
//  You can attribute a maximum of FIVE "tags" for your game.
//  Each tag has a specific ID (ex: 22 for the category "Prototype", 101 for the tag "Science-fiction theme game")
//  Please see the "Game meta information" entry in the BGA Studio documentation for a full list of available tags:
//  http://en.doc.boardgamearena.com/Game_meta-information:_gameinfos.inc.php
//  IMPORTANT: this list should be ORDERED, with the most important tag first.
//  IMPORTANT: it is mandatory that the FIRST tag is 1, 2, 3 and 4 (= game category)
'tags' => [2, 10, 23, 200],


//////// BGA SANDBOX ONLY PARAMETERS (DO NOT MODIFY)

// simple : A plays, B plays, C plays, A plays, B plays, ...
// circuit : A plays and choose the next player C, C plays and choose the next player D, ...
// complex : A+B+C plays and says that the next player is A+B
'is_sandbox' => false,
'turnControl' => 'simple'

////////
];
