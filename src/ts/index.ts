import '../scss/index.scss';  // Causes the styles to be loaded on the page
import './utils';
import BoardScreen from "./BoardScreen";


function main() {
    /*
    Main screen - option to start

     */

    /*
    Board screen - input and output rates displayed on left and right on fixed Cards
    Algorithm generates a way to get to 10
    Cards animate in at the bottom in a "hand" in a random order
    User drags cards onto the board and can drag connectors to make a flow
    When a connection is changed, recalculate the flow from left to right
    Leaf nodes have pulsing animations and labels with their flows
    If the calculation ends on the goal node and the flow is 10, show victory modal
     */
    const gameDiv = document.getElementById('game') as HTMLDivElement;
    const board = new BoardScreen(gameDiv);
    board.enter();
}


window.addEventListener('load', main);
