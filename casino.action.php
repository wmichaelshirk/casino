<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel
 * Colin <ecolin@boardgamearena.com>
 * casino implementation : © W Michael Shirk <wmichaelshirk@gmail.com>
 *
 * This code has been produced on the BGA studio platform for use on
 * https://boardgamearena.com. See http://en.doc.boardgamearena.com/Studio for
 * more information.
 * -----
 *
 * casino.action.php
 *
 * casino main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/casino/casino/myAction.html", ...)
 *
 */


  class action_casino extends APP_GameAction {

    // Constructor: please do not modify
   	public function __default() {
  	    if (self::isArg('notifwindow')) {
            $this->view = "common_notifwindow";
  	        $this->viewArgs['table'] = self::getArg( "table", AT_posint, true );
  	    } else {
            $this->view = "casino_casino";
            self::trace( "Complete reinitialization of board game" );
        }
  	}

    public function trail() {
        self::setAjaxMode();
        $cardId = self::getArg("cardId", AT_posint, true);
        $this->game->trailCard($cardId);
        self::ajaxResponse();
    }

    /*

    Example:

    public function myAction()
    {
        self::setAjaxMode();

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = self::getArg( "myArgument1", AT_posint, true );
        $arg2 = self::getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
        $this->game->myAction( $arg1, $arg2 );

        self::ajaxResponse( );
    }

    */

  }


