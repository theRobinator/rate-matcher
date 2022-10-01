import '../scss/index.scss';  // Causes the styles to be loaded on the page
import './utils';
import BoardScreen from "./BoardScreen";
import MainScreen from "./MainScreen";
import {GameScreen} from "./GameScreen";
import CampaignState, {CAMPAIGN_LEVELS} from "./state/CampaignState";
import {PuzzleDifficulty} from "./Puzzle";


function main() {
    const screenDiv = document.getElementById('screen') as HTMLDivElement;
    const mainScreen = new MainScreen(screenDiv, onCampaignStart, onFreePlayStart);
    let currentScreen: GameScreen;

    goToScreen(mainScreen);

    async function goToScreen(screen: GameScreen) {
        if (currentScreen) {
            await currentScreen.exit();
        }
        await screen.enter();
        currentScreen = screen;
    }

    function onCampaignStart() {
        const currentLevel = CampaignState.getCurrentLevel();
        const difficulty = CAMPAIGN_LEVELS[currentLevel];
        goToScreen(new BoardScreen(screenDiv, difficulty, 'campaign', onPlayComplete));
    }

    function onFreePlayStart(difficulty: PuzzleDifficulty) {
        goToScreen(new BoardScreen(screenDiv, difficulty, 'free', onPlayComplete));
    }

    function onPlayComplete() {
        goToScreen(mainScreen);
    }
}


window.addEventListener('load', main);
