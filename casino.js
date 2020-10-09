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

 const gameName = 'casino'

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
                // TODO - add dealer icon to dealer.
                // TODO: Setting up players boards if needed
            }

            // Player hand
            this.playerHand = new ebg.stock()
            this.playerHand.create(this, $('myhand'), this.cardwidth, this.cardheight)
            this.playerHand.image_items_per_row = 13
            this.playerHand.setSelectionMode(1)
            this.playerHand.centerItems = true

            // Table
            this.table = new ebg.stock()
            this.table.create(this, $('table'), this.cardwidth, this.cardheight)
            this.table.image_items_per_row = 13
            this.table.setSelectionMode(2)
            this.table.centerItems = true

            dojo.connect(this.playerHand, 'onChangeSelection', this,
                'onPlayerHandSelectionChanged')
            dojo.connect(this.table, 'onChangeSelection', this,
                'onPlayerHandSelectionChanged')

            // Create cards types:
            for (let suit = 1; suit <= 4; suit++) {
                for (let value = 2; value <= 14; value++) {
                    // Build card type id
                    const cardTypeId = this.getCardUniqueId(suit, value)
                    this.playerHand.addItemType(cardTypeId, 1,
                        `${g_gamethemeurl}img/cards.jpg`, cardTypeId)
                    this.table.addItemType(cardTypeId, 1,
                        `${g_gamethemeurl}img/cards.jpg`, cardTypeId)
                }
            }

            // Cards in player's hand
            Object.values(gamedata.hand).forEach(card => {
                const suit = card.type
                const value = card.type_arg
                this.playerHand.addToStockWithId(
                    this.getCardUniqueId(suit, value), card.id,
                    `overall_player_board_${gamedata.dealerId}`)
            })

            // Cards played on table
            Object.values(gamedata.cardsontable).forEach(card => {
                const suit = card.type
                const value = card.type_arg
                this.table.addToStockWithId(
                    this.getCardUniqueId(suit, value), card.id,
                    `overall_player_board_${gamedata.dealerId}`)
            })

            this.addTooltipToClass("playertablecard",
                _("Card played on the table"), '')

            // Setup game notifications to handle
            // (see "setupNotifications" method below)
            this.setupNotifications();
        },


        ///////////////////////////////////////////////////
        //// Game & client states

        // onEnteringState: this method is called each time we are entering
        //      into a new game state. You can use this method to perform some
        //      user interface changes at this moment.
        //
        onEnteringState: function (stateName, args) {

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

        // onLeavingState: this method is called each time we are leaving a game
        //      state. You can use this method to perform some user interface
        //      changes at this moment.
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
                switch (stateName) {
                    case 'playerTurn':
                        this.addActionButton('capture_button', _('Capture'), 'captureCard')
                        this.addActionButton('trail_button', _('Trail'), 'trailCard')
                        break;
                }
            }
        },

        ///////////////////////////////////////////////////
        //// Utility methods

        /*
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        */

        // Get card unique identifier based on its suit and value
        getCardUniqueId: function (suit, value) {
            return (suit - 1) * 13 + (value - 2)
        },

        // playCardOnTable: function(playerId, suit, value, cardId) {
        //     // player_id => direction
        //     dojo.place(this.format_block( 'jstpl_cardontable', {
        //         x: this.cardwidth*(value-2),
        //         y: this.cardheight*(suit-1),
        //         player_id: playerId
        //     }), 'playertablecard_'+playerId );

        //     if (playerId != this.player_id) {
        //         // Some opponent played a card. Move card from player panel
        //         this.placeOnObject('table', `overall_player_board_${playerId}` );
        //     } else {
        //         // You played a card. If it exists in your hand, move card from
        //         // there and remove corresponding item

        //         if ($('myhand_item_'+card_id))  {
        //             this.placeOnObject('table', 'myhand_item_'+card_id);
        //             this.playerHand.removeFromStockById(card_id);
        //         }
        //     }

        //     // In any case: move it to its final destination
        //     this.slideToObject('cardontable_'+playerId, 'playertablecard_'+playerId).play();

        // },

        dealCardsTo: function(cards, target) {
            dealerId = this.gamedatas.dealerId
            cards.forEach(card => {
                const suit = card.type
                const value = card.type_arg
                const from = `overall_player_board_${dealerId}`
                target.addToStockWithId(this.getCardUniqueId(suit, value), card.id, from)
            })
        },

        takeAction: function (action, data, callback) {
            data = { ...data, lock: true }
            callback = callback || (() => {})
            return new Promise((resolve, reject) => {
                this.ajaxcall(`/${gameName}/${gameName}/${action}.html`,
                    data, this, resp => resolve(resp), error => reject(error))
            })
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


        trailCard: function (e) {
            dojo.stopEvent(e);

            if (!this.checkAction('trail')) return
            selectedCards = this.playerHand.getSelectedItems()
            if (selectedCards.length != 1) {
                 this.showMessage(
                     _('You must select exactly 1 card to trail'), 'error');
                return;
            }

            this.takeAction('trail', { cardId: selectedCards[0].id })
                .then(console.log)
                .catch(console.error)
        },

        captureCard: function (e) {
            dojo.stopEvent(e);

            if (!this.checkAction('capture')) return
            const selectedCards = this.playerHand.getSelectedItems()
            if (selectedCards.length != 1) {
                 this.showMessage(
                     _('You must select exactly 1 card to capture with'), 'error');
                return;
            }
            const capturedCards = this.table.getSelectedItems()
                .map(c => c.id)
            console.log(capturedCards)
            if (capturedCards.length < 1) {
                this.showMessage(
                    _('You must select at least 1 card to capture'), 'error');
                return;
            }

            this.takeAction('capture', { 
                cardId: selectedCards[0].id,
                capturedCards: capturedCards.join(',')
            })
                .then(console.log)
                .catch(console.error)
        },


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
        setupNotifications: function () {
            console.log( 'notifications subscriptions setup' );

            // TODO: here, associate your game notifications with local methods

            // Example 1: standard notification handling
            dojo.subscribe('newCards', this, "notifyNewCards");
            this.notifqueue.setSynchronous('newCards', 1000);
            dojo.subscribe('deal', this, "notifyNewDeal");
            this.notifqueue.setSynchronous('deal', 1000);
            dojo.subscribe('trailCard', this, 'notifyTrailCard');
            dojo.subscribe('captureCards', this, 'notifyCaptureCards')
        },

        notifyNewDeal: function ({args}) {
            const cards = Object.values(args.cards)
            const target = this.table
            this.dealCardsTo(cards, target)
        },

        notifyNewCards: function ({args}) {
            const cards = Object.values(args.cards)
            const target = this.playerHand
            this.dealCardsTo(cards, target)
        },

        notifyTrailCard: function ({ args }) {
            const playerId = args.player_id
            const card = args.card
            const suit = card.type
            const value = card.type_arg
            const from = playerId == this.player_id ?
                `myhand_item_${card.id}` : `overall_player_board_${playerId}`

            // slide card from player or hand to table.
            this.table.addToStockWithId(this.getCardUniqueId(suit, value), card.id, from)
            this.playerHand.removeFromStockById(card.id)
        },

        notifyCaptureCards: function ({ args }) {
            const playerId = args.player_id
            // first, play card to table:
            const card = args.card
            const suit = card.type
            const value = card.type_arg
            const from = playerId == this.player_id ?
                `myhand_item_${card.id}` : `overall_player_board_${playerId}`

            // slide card from player or hand to table.
            let foo = this.table.addToStockWithId(this.getCardUniqueId(suit, value), card.id, from)
            this.playerHand.removeFromStockById(card.id)

            // then: move all the captured and played to the target:
            const to = `overall_player_board_${playerId}`
            setTimeout(() => {
                [card, ...Object.values(args.cards)].forEach(card => {
                    const suit = card.type
                    const value = card.type_arg
                    const cardEl = dojo.place(this.format_block('jstpl_cardontable', {
                        x: this.cardwidth * (value - 2),
                        y: this.cardheight * (suit - 1),
                        player_id: playerId
                    }), to)
                    this.placeOnObject(cardEl, `table_item_${card.id}`);                
                    this.table.removeFromStockById(card.id);
                    this.slideToObjectAndDestroy(cardEl, to, 500, 100)//.play();
                })
            }, 1000)
        },


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



/**
 * 
 * @param {number} card 
 * @param {number[]]} cards 
 * @returns boolean
 */
function matches (card, cards) {
	function attempt(cards, partialSum, unused) {
		let noGood = [...unused]
		let toTry = [...cs]

		for (let next = toTry.pop(); next !== undefined; next = toTry.pop()) {
			if (next === card) {
				continue // cards that are equal are always okay
			} else if (next > card) {
				return false // there is an unmatchable card, fail the whole thing
			} else {
				let sum = partialSum + next
				if (sum === card) {
                    // could be part of a valid solution, we have a capturing 
                    // set that equals the card
					// put all the no-good cards back into the set to try
					if (go([...toTry, ...noGood], 0, [])) {
						return true
					}
				} else if (sum < card) {
					// could be part of a valid solution,  we have a capturing set 
					// that does not yet equal the card
					// keep matching with the current sum & no-good set
					if (go(toTry, sum, noGood)) {
						return true
					}
				}

				// otherwise put it into the no-good set
				// we will try again later
				noGood.push(next)
			}
		}

		// run out of cards to try, we have suceeded if 
		// there's nothing left to check
		return noGood.length === 0 && partialSum === 0
	}

	const cache = new Map();
	function go(cards, partialSum, unused) {
		const key = `${[...cs].sort().join()}|${partialSum}|${[...unused].sort().join()}`;
		const cached = cache.get(key);
		if (cached !== undefined) {
			return cached
		}

		const result = attempt(cs, partialSum, unused)
		cache.set(key, result)
		return result
	}

    return go(cs, 0, []);
    