<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel
 * Colin <ecolin@boardgamearena.com>
 * casino implementation : © W Michael Shirk <wmichaelshirk@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on
 * http://boardgamearena.com.  See http://en.boardgamearena.com/#!doc/Studio
 * for more information.
 * -----
 *
 * casino.game.php
 */

require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );

class casino extends Table {

	function __construct() {
        parent::__construct();

        self::initGameStateLabels([
            "dealer_id" => 10,
            "eldest_player_id" => 11,
            "deal_round" => 12,
            "rounds_per_hand" => 13,
        ]);
        $this->cards = self::getNew("module.common.deck");
        $this->cards->init("card");
	}

    protected function getGameName() {
        return "casino";
    }

    /*
        setupNewGame:

        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame($players, $options = []) {
        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (" .
            "player_id, player_color, player_canal, player_name, player_avatar" .
            ") VALUES ";
        $values = [];
        foreach ($players as $player_id => $player) {
            $color = array_shift($default_colors);
            $values[] = "('" . $player_id . "','$color','" .
                $player['player_canal'] . "','" .
                addslashes($player['player_name']) . "','" .
                addslashes($player['player_avatar']) . "')";
        }
        $sql .= implode($values, ',');
        self::DbQuery($sql);
        self::reattributeColorsBasedOnPreferences($players, $gameinfos['player_colors']);
        self::reloadPlayersBasicInfos();

        /************ Start the game initialization *****/

        // Init global values with their initial values
        self::setGameStateInitialValue('dealer_id', 0);
        self::setGameStateInitialValue('eldest_player_id', 0);
        self::setGameStateInitialValue('deal_round', 0);
        self::setGameStateInitialValue("rounds_per_hand", 0);

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // TODO: setup the initial game situation here
        // Create cards
        $cards = [];
        foreach ($this->suits as $suit_id => $suit) {
            for ($value=2; $value<=14; $value++) {
                $cards[] = ['type' => $suit_id, 'type_arg' => $value, 'nbr' => 1];
            }
        }

        $this->cards->createCards($cards, 'deck');

        // Activate first player (which is in general a good idea :) )
        $dealer_id = $this->activeNextPlayer();
        $eldest_player_id = self::getPlayerAfter($dealer_id);
        $numberOfPlayers = self::getPlayersNumber();
        $rounds = (count($cards) - 4) / ($numberOfPlayers * 4);
        self::setGameStateValue('dealer_id', $dealer_id);
        self::setGameStateValue('eldest_player_id', $eldest_player_id);
        self::setGameStateValue("rounds_per_hand", $rounds);

        /************ End of the game initialization *****/
    }

    /*
        getAllDatas:

        Gather all informations about current game situation (visible by the current player).

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas() {
        $result = array();

        // !! We must only return informations visible by this player !!
        $currentPlayerId = self::getCurrentPlayerId();

        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table
        // in "dbmodel.sql" if you need it.
        $sql = "SELECT player_id id, player_name name, player_avatar avatar, player_color color, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb($sql);

        // TODO: Gather all information about current game situation
        // (visible by player $current_player_id).

        // Cards in player hand
        $result['hand'] = $this->cards->getCardsInLocation('hand', $currentPlayerId);

        // Cards played on the table
        $result['cardsontable'] = $this->cards->getCardsInLocation('cardsontable');

        $result['dealerId'] = self::getGameStateValue('dealer_id');

        return $result;
    }

    /*
        getGameProgression:

        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).

        This method is called each time we are in a game state with the "updateGameProgression" property set to true
        (see states.inc.php)
    */
    function getGameProgression() {
        // TODO: compute and return the game progression

        return 0;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////


    function getPlayerName ($player_id) {
        $players = self::loadPlayersBasicInfos();
        return $players[$player_id]['player_name'];
    }

    function assertCardPlay($cardId) {
        $playerId = self::getActivePlayerId();
        $playerHand = $this->cards->getCardsInLocation('hand', $playerId);

        $isInHand = false;
        $card = null;

        foreach($playerHand as $currentCard) {
            if ($currentCard['id'] == $cardId) {
                $isInHand = true;
                $card = $currentCard;
            }
        }

        if (!$isInHand) {
            throw new BgaUserException(self::_("This card is not in your hand"));
        }
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
////////////

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in casino.action.php)
    */

    function trailCard($cardId) {
        self::checkAction('trail');
        $this->assertCardPlay($cardId);
        $this->cards->moveCard($cardId, 'cardsontable');

        $card = $this->cards->getCard($cardId);

        self::notifyAllPlayers('trailCard',
            clienttranslate('${player_name} trails ${card_name}'), [
            'player_name' => $this->getActivePlayerName(),
            'player_id' => $this->getActivePlayerId(),
            'card' => $card,
            'card_name' => '',
        ]);
        $this->gamestate->nextState();
    }



//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*

    Example for game state "MyGameState":

    function argMyGameState()
    {
        // Get some values from the current game situation in database...

        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see
        "action" property in states.inc.php).
        The action method of state X is called everytime the current game
        state is set to X.
    */


    /*
     * 10 - Start a new hand -
     * Take back all cards (from any location) to deck.
     */
    function stNewHand() {
        $this->cards->moveAllCardsInLocation(null, 'deck');
        $this->cards->shuffle('deck');
        self::setGameStateValue('deal_round', 0);

        // TODO _advance_ dealer and eldest
        $eldest = self::getGameStateValue('eldest_player_id');
        $dealer = self::getGameStateValue('dealer_id');

        self::notifyAllPlayers('newDeal',
            clienttranslate('<hr/>${player_name} is the next dealer<hr/>'), [
            'dealer_id' => $dealer,
            'player_name' => self::getPlayerName($dealer),
            'eldest' => $eldest
        ]);

        $this->gamestate->changeActivePlayer($dealer);
        $this->gamestate->nextState();
    }


    /*
     * 11 - Deal out a round of cards
     */
    function stDeal () {
        $players = self::loadPlayersBasicInfos();
        $deal = self::incGameStateValue('deal_round', 1);
        $dealer = self::getGameStateValue('dealer_id');

        foreach (range(1, 2) as $_) {
            foreach ($players as $playerId => $player) {
                $cards = $this->cards->pickCards(2, 'deck', $playerId);
                $this->notifyPlayer($playerId, 'newCards', '', [
                    'cards' => $cards,
                    'dealerId' => $dealer
                ]);
            }
            if ($deal === 1) {
                $cards = $this->cards->pickCardsForLocation(2, 'deck', 'cardsontable');
                self::notifyAllPlayers('deal', '', [
                    'dealerId' => $dealer,
                    'cards' => $cards
                ]);
            }
        }

        if (self::getGameStateValue('rounds_per_hand') == $deal) {
            self::notifyAllPlayers('say', '', [
                'player_id' => $dealer,
                'msg' => 'last'
            ]);
        }

        self::activeNextPlayer();
        $this->gamestate->nextState();
    }

    /*
     * 11 - Deal out a round of cards
     */
    function stNextPlayer () {
        $round = self::getGameStateValue('deal_round');
        $lastRound = self::getGameStateValue('rounds_per_hand') == $round;
        $endOfRound = $this->cards->countCardInLocation('hand') == 0;

        if ($endOfRound) {
            if ($lastRound) {
                $this->gamestate->nextState("endHand");
            } else {
                $this->gamestate->nextState("nextDeal");
            }
            return;
        }
        self::activeNextPlayer();
        $this->gamestate->nextState("nextPlayer");
    }



//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:

        This method is called each time it is the turn of a player who has quit
        the game (= "zombie" player). You can do whatever you want in order to
        make sure the turn of this player ends appropriately (ex: pass).

        Important: your zombie code will be called when the player leaves the
        game. This action is triggered from the main site and propagated to the
        gameserver from a server, not from a browser. As a consequence, there
        is no current player associated to this action. In your zombieTurn
        function, you must _never_ use getCurrentPlayerId() or
        getCurrentPlayerName(), otherwise it will fail with a "Not logged"
        error message.
    */

    function zombieTurn ($state, $active_player) {
    	$statename = $state['name'];

        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );

            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }

///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:

        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.

    */

    function upgradeTableDb ($from_version) {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345

        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//
    }
}
