{OVERALL_GAME_HEADER}

<!--
--------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel
-- Colin <ecolin@boardgamearena.com>
-- casino implementation : © W Michael Shirk <wmichaelshirk@gmail.com>
--
-- This code has been produced on the BGA studio platform for use on
-- http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-------

    casino_casino.tpl

    This is the HTML template of your game.

    Everything you are writing in this file will be displayed in the HTML page of your game user interface,
    in the "main game zone" of the screen.

    You can use in this template:
    _ variables, with the format {MY_VARIABLE_ELEMENT}.
    _ HTML block, with the BEGIN/END format

    See your "view" PHP file to check how to set variables and control blocks

    Please REMOVE this comment before publishing your game on BGA
-->


<div id="table">
</div>
<div id="myhand">
</div>

<script type="text/javascript">

let jstpl_cardontable = '<div class="cardontable" id="cardontable_${player_id}" style="background-position:-${x}px -${y}px"></div>'
</script>

{OVERALL_GAME_FOOTER}
