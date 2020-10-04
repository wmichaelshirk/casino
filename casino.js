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
 * casino.js
 *
 * casino user interface script
 *
 * In this file, you are describing the logic of your user interface, in
 * Javascript language.
 *
 */

define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
],
function (dojo, declare) {
    return declare("bgagame.casino", ebg.core.gamegui, {

        constructor: function() {
            this.playerHand = null
            this.cardwidth = 72
            this.cardheight = 96
        },

        /*
            setup:

            This method must set up the game user interface according to current
            game situation specified in parameters.

            The method is called each time the game interface is displayed to a
            player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)

            "gamedata" argument contains all datas retrieved by your
            "getAllDatas" PHP method.
        */
        setup: function(gamedata) {

            // Setting up player boards
            for (let player_id in gamedata.players) {
                let player = gamedata.players[player_id]

                // TODO: Setting up players boards if needed
            }

            // Player hand
            this.playerHand = new ebg.stock()
            this.playerHand.create(this, $('myhand'),
                this.cardwidth, this.cardheight)
            this.playerHand.image_items_per_row = 13
            dojo.connect( this.playerHand, 'onChangeSelection', this,
                'onPlayerHandSelectionChanged')

            // Create cards types:
            for (let suit = 1; suit <= 4; suit++) {
                for (let value = 2; value <= 14; value++) {
                    // Build card type id
                    const card_type_id = this.getCardUniqueId(suit, value)
                    this.playerHand.addItemType(card_type_id, card_type_id,
                        `${g_gamethemeurl}img/cards.jpg`,
                        card_type_id );
                }
            }

            // Cards in player's hand
            // for (let i in this.gamedata.hand) {
            //     const card = this.gamedata.hand[i];
            //     const color = card.type;
            //     const value = card.type_arg;
            //     this.playerHand.addToStockWithId(
            //         this.getCardUniqueId(color, value), card.id);
            // }

            // Cards played on table
            // for (let i in this.gamedata.cardsontable) {
            //     const card = this.gamedata.cardsontable[i];
            //     const color = card.type;
            //     const value = card.type_arg;
            //     const player_id = card.location_arg;
            //     this.playCardOnTable( player_id, suit, value, card.id );
            // }

            this.addTooltipToClass("playertablecard",
                _("Card played on the table"), '')

            // Setup game notifications to handle
            // (see "setupNotifications" method below)
            this.setupNotifications();
        },


        ///////////////////////////////////////////////////
        //// Game & client states

        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function(stateName, args) {

            switch (stateName) {

            /* Example:

            case 'myGameState':

                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );

                break;
           */


            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function (stateName) {

            switch (stateName) {

            /* Example:

            case 'myGameState':

                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );

                break;
           */


            case 'dummmy':
                break;
            }
        },

        // onUpdateActionButtons: in this method you can manage "action buttons" 
        // that are displayed in the action status bar (ie: the HTML links in 
        // the status bar).
        //
        onUpdateActionButtons: function (stateName, args) {

            if (this.isCurrentPlayerActive()) {
                
                switch( stateName ) {
/*
                 Example:

                 case 'myGameState':

                    // Add 3 action buttons in the action status bar:

                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
                    break;
*/
                }
            }
        },

        ///////////////////////////////////////////////////
        //// Utility methods

        /*

            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.

        */
        // Get card unique identifier based on its color and value
        getCardUniqueId: function (suit, value) {
            return (suit - 1) * 13 + (value - 2)
        },


        ///////////////////////////////////////////////////
        //// Player's action

        /*

            Here, you are defining methods to handle player's action (ex: results of mouse click on
            game objects).

            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server

        */

        /* Example:

        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );

            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/casino/casino/myAction.html", {
                                                                    lock: true,
                                                                    myArgument1: arg1,
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 },
                         this, function( result ) {

                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)

                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );
        },

        */

       onPlayerHandSelectionChanged: function() {
           const items = this.playerHand.getSelectedItems();
            // here and on table select change, call
            // function to see what buttons to set up.
       },

        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:

            In this method, you associate each of your game notifications with your local method to handle it.

            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your casino.game.php file.

        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );

            // TODO: here, associate your game notifications with local methods

            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            //
        },

        // TODO: from this point and below, you can write your game notifications handling methods

        /*
        Example:

        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );

            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

            // TODO: play the card in the user interface.
        },

        */
   });
});
