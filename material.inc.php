<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel
 * Colin <ecolin@boardgamearena.com>
 * casino implementation : © W Michael Shirk <wmichaelshirk@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on
 * http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * casino game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */


$this->suits = [
  1 => [
    'name' => clienttranslate('Hearts'),
    'nameof' => clienttranslate('of Hearts'),
    'symbol' => '&hearts;'
  ],

  2 => [
    'name' => clienttranslate('Clubs'),
    'nameof' => clienttranslate('of Clubs'),
    'symbol' => '&clubs;',
  ] ,

  3 => [
    'name' => clienttranslate('Diamonds'),
    'nameof' => clienttranslate('of Diamonds'),
    'symbol' => '&diams;'
  ],

  4 => [
    'name' => clienttranslate('Spades'),
    'nameof' => clienttranslate('of Spades'),
    'symbol' => '&spades;'
  ],
];
