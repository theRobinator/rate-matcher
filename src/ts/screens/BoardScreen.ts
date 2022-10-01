import '../../scss/board-screen.scss';
import generatePuzzle from "../PuzzleGenerator";
import {
    BINARY_OPERATOR_FUNCTIONS,
    BinaryOperation,
    PRECISION_FACTOR,
    Puzzle,
    PuzzleDifficulty,
    PuzzleStep
} from "../Puzzle";
import {shuffle, wait} from "../utils";
import {GameScreen} from "./GameScreen";
import CampaignState, {CAMPAIGN_LEVELS} from "../state/CampaignState";

export default class BoardScreen implements GameScreen {
    // Permanent elements
    private handContainer: HTMLElement;
    private cardSlotContainer: HTMLElement;
    private sourceCard: HTMLElement;
    private goalLight: Element;
    private goalCard: HTMLElement;
    private goalPulse: HTMLElement;
    private lineIn: HTMLElement;
    private lineOut: HTMLElement;
    private gameModeDiv: HTMLDivElement;
    private backButton: HTMLButtonElement;

    // Once-per-puzzle elements
    private resultLight: HTMLDivElement;
    private resultDiv: HTMLDivElement;
    private resultPulse: HTMLElement;

    // Interaction state
    private cardBeingDragged: HTMLElement | null;
    private slotBeingHovered: HTMLElement | null;
    private originalDragPosition: [number, number] | null;

    // Puzzle state
    private puzzle: Puzzle;
    private currentFlow: PuzzleStep[] = [];
    private isResetting = true;

    constructor(
        private element: HTMLDivElement,
        private difficulty: PuzzleDifficulty,
        private gameMode: 'campaign' | 'free',
        private onBack: () => void,
    ) {}

    public async enter() {
        this.setUpDOM();
        await this.startNewPuzzle();
    }

    public async exit() {}

    public async startNewPuzzle() {
        let puzzle: Puzzle;
        if (this.gameMode === 'campaign') {
            const level = CAMPAIGN_LEVELS[CampaignState.getCurrentLevel()];
            this.difficulty = level.difficulty;
            puzzle = level.puzzle;
        } else {
            puzzle = generatePuzzle(this.difficulty);
            console.log(JSON.stringify(puzzle, undefined, 2));
        }
        this.puzzle = puzzle;
        this.evaluateFlow(puzzle.start, puzzle.steps, true);

        this.updateNav();
        this.addStartAndGoal(puzzle);
        this.addCardSlots(puzzle);
        await wait(200);
        this.animateLineIn();
        await wait(300);
        await this.animateCardSlots();
        this.updateResult();
        this.animateLineOut();
        await wait(800);
        await this.addCards(puzzle);
        this.isResetting = false;
    }

    private setUpDOM() {
        this.element.innerHTML = `
            <div class="board">
                <div class="nav">
                    <div class="game-mode"></div>
                    <button class="regenerate-button" style="display: none">Regenerate</button>
                    <button class="back-button">Back</button>
                </div>
                <div class="draggable-background">
                    <div class="background-broken-line"></div>
                    <div class="background-line"></div>
                    <div class="source-card"></div>
                    <div class="card-slot-container"></div>
                    <div class="goal-light">
                        <div class="pulse-circle"></div>
                        <div class="goal-card"></div>
                    </div>
                </div>
                <div class="hand-container"></div>
            </div>
        `;
        this.handContainer = this.element.querySelector('.hand-container');
        this.sourceCard = this.element.querySelector('.source-card');
        this.cardSlotContainer = this.element.querySelector('.card-slot-container');
        this.goalCard = this.element.querySelector('.goal-card');
        this.goalLight = this.element.querySelector('.goal-light');
        this.goalPulse = this.element.querySelector('.goal-light .pulse-circle');
        this.lineIn = this.element.querySelector('.background-line');
        this.lineOut = this.element.querySelector('.background-broken-line');
        this.gameModeDiv = this.element.querySelector('.game-mode');
        this.backButton = this.element.querySelector('.back-button');

        this.element.addEventListener('mousemove', this.onDragMove.bind(this));
        this.element.addEventListener('mouseup', this.onDragEnd.bind(this));
        this.element.addEventListener('mouseleave', this.onDragEnd.bind(this));
        this.backButton.addEventListener('click', this.onBack);

        this.element.querySelector('.regenerate-button').addEventListener('click', this.resetBoard.bind(this));
    }

    private updateNav() {
        if (this.gameMode === 'free') {
            this.gameModeDiv.innerHTML = `Free Play: ${this.difficulty}`;
        } else {
            const currentLevel = CampaignState.getCurrentLevel();
            this.gameModeDiv.innerHTML = `Campaign level ${currentLevel + 1} of ${CAMPAIGN_LEVELS.length} (${this.difficulty})`;
        }
    }

    private addStartAndGoal(puzzle: Puzzle) {
        this.sourceCard.innerHTML = this.getNumberDisplay(puzzle.start) + '';
        this.goalCard.innerHTML = puzzle.answer + '';
        this.goalPulse.style.animationDuration = puzzle.answer + 's';
    }

    private animateLineIn() {
        this.lineIn.style.width = '50%';
    }
    private animateLineOut() {
        this.lineOut.style.width = 'calc(50% - 6.94vw)';
    }

    private async animateCardSlots() {
        for (const child of Array.from(this.cardSlotContainer.children) as HTMLElement[]) {
            child.style.animationPlayState = 'running';
            await wait(150);
        }
    }

    private async addCards(puzzle: Puzzle) {
        const shuffledSteps = puzzle.steps.slice();
        shuffle(shuffledSteps);
        for (const step of shuffledSteps) {
            const cardElement = document.createElement('div');
            cardElement.dataset.scalar = step.scalar + '';
            cardElement.dataset.operation = step.operation;
            cardElement.classList.add('card');
            cardElement.innerText = `${this.getOperationDisplay(step.operation)} ${step.scalar}`;

            cardElement.addEventListener('mousedown', this.onDragStart.bind(this));

            this.handContainer.appendChild(cardElement);
            await wait(100);
        }
    }

    private addCardSlots(puzzle: Puzzle) {
        puzzle.steps.forEach((step, index) =>  {
            const slot = document.createElement('div');
            slot.classList.add('card-slot');
            slot.dataset.index = index + '';

            slot.addEventListener('mouseenter', this.onSlotHoverStart.bind(this));
            slot.addEventListener('mouseleave', this.onSlotHoverEnd.bind(this));

            this.cardSlotContainer.appendChild(slot);
        });

        const resultLight = document.createElement('div');
        resultLight.innerHTML = `
            <div class="pulse-circle"></div>
            <div class="result-display"></div>
        `;
        resultLight.classList.add('result-light');
        this.resultLight = resultLight;
        this.resultDiv = resultLight.querySelector('.result-display');
        this.resultPulse = resultLight.querySelector('.pulse-circle');
        this.cardSlotContainer.appendChild(resultLight);
    }

    private async playVictoryAnimation() {
        this.isResetting = true;

        this.resultPulse.classList.remove('pulse-circle');
        await wait(10);
        this.resultLight.classList.add('green-light');
        this.resultPulse.classList.add('pulse-circle');
        await wait(200);

        this.lineIn.style.transitionDuration = '2000ms';
        this.lineIn.style.width = 'calc(100% - 2.1vw)';
        await wait(1100);

        this.goalPulse.classList.remove('pulse-circle');
        await wait(10);
        this.goalLight.classList.add('green-light');
        this.goalPulse.classList.add('pulse-circle');

        await wait(5000);

        if (this.gameMode === 'campaign') {
            const nextLevel = CampaignState.getCurrentLevel() + 1;
            CampaignState.setCurrentLevel(nextLevel);
            if (nextLevel >= CAMPAIGN_LEVELS.length) {
                this.showCampaignVictory();
            } else {
                this.resetBoard();
            }
        } else {
            this.resetBoard();
        }
    }

    private resetBoard() {
        this.cardSlotContainer.innerHTML = '';
        this.handContainer.innerHTML = '';
        this.goalLight.classList.remove('green-light');

        this.lineIn.style.width = '0';
        this.lineIn.style.transitionDuration = '1000ms';
        this.lineOut.style.width = '0';
        this.lineOut.style.transitionDuration = '1000ms';

        this.resultLight.remove();
        this.resultLight = null;
        this.resultDiv.remove();
        this.resultDiv = null;
        this.resultPulse.remove();
        this.resultPulse = null;

        this.cardBeingDragged = null;
        this.slotBeingHovered = null;
        this.originalDragPosition = null;
        this.puzzle = null
        this.currentFlow = [];

        this.isResetting = false;
        this.startNewPuzzle();
    }

    private showCampaignVictory() {
        const victoryDiv = document.createElement('div');
        victoryDiv.classList.add('campaign-victory-modal');
        victoryDiv.innerHTML = `
            <picture class="splash-emoji">&#127942;</picture>
            <h1>Congratulations!</h1>
            <p>You just beat the campaign! You've unlocked a hidden difficulty in the free play mode.</p>
            <button class="done-button">Back to the Main Menu</button>
        `;
        const doneButton = victoryDiv.querySelector('.done-button');
        doneButton.addEventListener('click', this.onBack);
        this.element.appendChild(victoryDiv);
    }

    private onDragStart(event: MouseEvent) {
        if (this.isResetting) {
            return;
        }
        this.cardBeingDragged = event.target as HTMLElement;
        this.originalDragPosition = this.getCurrentDragTransform();
        const flowIndex = parseInt(this.cardBeingDragged.dataset.flowIndex, 10);
        if (!isNaN(flowIndex)) {
            this.currentFlow[flowIndex] = undefined;
            this.cardBeingDragged.dataset.flowIndex = ''
            this.updateResult();
        }
    }

    private onDragMove(event: MouseEvent) {
        if (this.isResetting) {
            return;
        }
        if (this.cardBeingDragged) {
            const x = event.clientX - this.originalDragPosition[0];
            const y = event.clientY - this.originalDragPosition[1];
            this.cardBeingDragged.style.transform = `translate(${x + 2}px, ${y + 2}px)`;
        }
    }

    private onDragEnd(event: MouseEvent) {
        if (this.isResetting) {
            return;
        }
        if (this.slotBeingHovered) {
            const hoveredIndex = parseInt(this.slotBeingHovered.dataset.index, 10);
            if (!this.currentFlow[hoveredIndex]) {
                const originalCardPosition = this.getCurrentDragTransform();
                const slotPosition = this.slotBeingHovered.getBoundingClientRect();
                const x = slotPosition.x - originalCardPosition[0] + 5;
                const y = slotPosition.y - originalCardPosition[1] + 5;
                this.cardBeingDragged.style.transform = `translate(${x}px, ${y}px)`;

                const slotIndex = parseInt(this.slotBeingHovered.dataset.index, 10);
                this.currentFlow[slotIndex] = {
                    operation: this.cardBeingDragged.dataset.operation as BinaryOperation,
                    scalar: parseInt(this.cardBeingDragged.dataset.scalar, 10),
                }
                this.cardBeingDragged.dataset.flowIndex = this.slotBeingHovered.dataset.index;
                this.onSlotHoverEnd();
                this.updateResult();
            }
        }
        this.cardBeingDragged = null;
    }

    private getCurrentDragTransform(): [number, number] {
        const boundingBox = this.cardBeingDragged.getBoundingClientRect();
        let currentX = boundingBox.x;
        let currentY = boundingBox.y;
        const currentTransform = this.cardBeingDragged.style.transform;
        if (currentTransform) {
            const match = currentTransform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px/);
            currentX -= parseFloat(match[1]);
            currentY -= parseFloat(match[2]);
        }
        return [currentX, currentY];
    }

    private onSlotHoverStart(event: MouseEvent) {
        if (this.cardBeingDragged && !this.isResetting) {
            this.slotBeingHovered = event.target as HTMLElement;
            this.slotBeingHovered.classList.add('targeted-slot');
        }
    }

    private onSlotHoverEnd() {
        if (this.slotBeingHovered && !this.isResetting) {
            this.slotBeingHovered.classList.remove('targeted-slot');
            this.slotBeingHovered = null;
        }
    }

    private updateResult() {
        const flowSoFar = [];
        let hasGapsInFlow = false;
        let foundNullStep = false;
        for (const step of this.currentFlow) {
            if (step == null) {
                foundNullStep = true;
            } else {
                flowSoFar.push(step);
                if (foundNullStep) {
                    hasGapsInFlow = true;
                }
            }
        }
        let resultNumber: number;
        if (!flowSoFar.length) {
            resultNumber = this.getNumberDisplay(this.puzzle.start);
            this.resultDiv.innerHTML = resultNumber + '';
        } else if (hasGapsInFlow) {
            this.resultDiv.innerHTML = '-/-';
        } else {
            const flowResult = this.evaluateFlow(this.puzzle.start, flowSoFar);
            resultNumber = this.getNumberDisplay(flowResult);
            this.resultDiv.innerHTML = resultNumber + '';
        }
        if (this.difficulty === 'insane') {
            this.resultDiv.innerHTML = '???';
        }
        if (resultNumber) {
            this.resultPulse.style.animationPlayState = 'running';
            this.resultPulse.style.animationDirection = resultNumber > 0 ? 'normal' : 'reverse';
            this.resultPulse.style.animationDuration = Math.abs(resultNumber) + 's';
        } else {
            this.resultPulse.style.animationPlayState = 'paused';
        }
        if (resultNumber === this.puzzle.answer && flowSoFar.length === this.puzzle.steps.length) {
            this.playVictoryAnimation();
        }
    }

    private evaluateFlow(start: number, steps: PuzzleStep[], print = false) {
        let currentFlow = start;
        if (print) {
            const cardDisplays = steps.map(i => `${i.operation}${i.scalar}`);
            shuffle(cardDisplays);
            console.log('Cards are: ' + cardDisplays.join(', '));
            console.log(`Start at ${this.getNumberDisplay(currentFlow)}`);
        }
        for (const step of steps) {
            const nextValue = BINARY_OPERATOR_FUNCTIONS[step.operation](currentFlow, step.scalar);
            if (print) {
                console.log(`${this.getNumberDisplay(currentFlow)} ${step.operation} ${step.scalar} = ${this.getNumberDisplay(nextValue)}`);
            }
            currentFlow = nextValue;
        }
        return currentFlow;
    }

    private getNumberDisplay(num: number) {
        return num / PRECISION_FACTOR;
    }

    private getOperationDisplay(operation: BinaryOperation) {
        switch (operation) {
            case '*': return 'x';
            case '/': return "\u00F7"; // Division symbol
            default: return operation;
        }
    }
}
