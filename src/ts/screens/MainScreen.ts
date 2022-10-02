import '../../scss/main-screen.scss';
import {GameScreen} from "./GameScreen";
import {PuzzleDifficulty} from "../Puzzle";
import CampaignState, {CAMPAIGN_LEVELS} from "../state/CampaignState";
import AudioPlayer from "../AudioPlayer";

export default class MainScreen implements GameScreen {
    private playCampaignButton: HTMLButtonElement;
    private difficultySelector: HTMLSelectElement;
    private freePlayButton: HTMLButtonElement;

    constructor(
        private element: HTMLDivElement,
        private onCampaignStart: () => void,
        private onFreePlayStart: (difficulty: PuzzleDifficulty) => void,
    ) {}

    public async enter() {
        this.setUpDOM();
    }

    public async exit() {}

    private setUpDOM() {
        this.element.innerHTML = `
        <div class="main-screen">
            <div class="menu-container">
                <header>
                    <h1 class="game-title">
                        <span style="color: yellow">Rate</span> <span style="color: orange">Matcher</span>
                    </h1>
                    <p class="blurb">Match the input and output rates using math!</p>
                </header>
                <div class="play-options">
                    <section>
                        <h2>Campaign</h2>
                        <div>
                            <p class="level-progress"></p>
                            <button class="play-campaign-button">Play Campaign</button>
                        </div>
                    </section>
                    <section>
                        <h2>Free Play</h2>
                        <div>
                            <select class="difficulty-select">
                                <option value="easy" selected>Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <button class="free-play-button">Start Free Play</button>
                    </section>
                </div>
            </div>
        </div>
        `;
        const progressElement = this.element.querySelector('.level-progress');
        const currentLevel = CampaignState.getCurrentLevel();
        progressElement.innerHTML = `${currentLevel} of ${CAMPAIGN_LEVELS.length} levels completed`;

        this.playCampaignButton = this.element.querySelector('.play-campaign-button');
        this.playCampaignButton.addEventListener('click', this.onCampaignStart);

        this.difficultySelector = this.element.querySelector('.difficulty-select');
        this.difficultySelector.addEventListener('change', this.onDifficultyChanged.bind(this));

        this.freePlayButton = this.element.querySelector('.free-play-button');
        this.freePlayButton.addEventListener('click', this.onFreePlay.bind(this));

        if (currentLevel === CAMPAIGN_LEVELS.length) {
            this.playCampaignButton.disabled = true;
            const insaneOption = document.createElement('option');
            insaneOption.value = 'insane';
            insaneOption.innerHTML = 'Insane';
            this.difficultySelector.appendChild(insaneOption);
        }
    }

    private onDifficultyChanged() {
        const newValue = this.difficultySelector.value;
        this.freePlayButton.disabled = !newValue;
    }

    private onFreePlay() {
        const difficulty = this.difficultySelector.value as PuzzleDifficulty;
        this.onFreePlayStart(difficulty);
    }
}
