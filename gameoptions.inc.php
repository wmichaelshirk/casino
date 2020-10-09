<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel
 * Colin <ecolin@boardgamearena.com>
 * casino implementation : © W Michael Shirk <wmichaelshirk@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on
 * http://boardgamearena.com. See http://en.boardgamearena.com/#!doc/Studio for
 * more information.
 * -----
 *
 * gameoptions.inc.php
 *
 * casino game options description
 *
 * In this file, you can define your game options (= game variants).
 *
 * Note: If your game has no variant, you don't have to modify this file.
 *
 * Note²: All options defined in this file should have a corresponding "game 
 *      state labels" with the same ID (see "initGameStateLabels" in 
 *      casino.game.php)
 *
 * !! It is not a good idea to modify this file when a game is running !!
 *
 */

$game_options = [

    100 => [
        'name' => 'Game length',
        'values' => [
            11 => [
                'name' => totranslate('11 – very short'),
            ],
            16 => [
                'name' => totranslate('16 – short'),
                'description' => totranslate('Default in Scandanavia'),
            ],
            21 => [
                'name' => totranslate('21 – medium'),
                'description' => totranslate('Default in America')
            ],
            50 => [
                'name' => totranslate('50 – long'),
            ],
        ]
    ]

];
