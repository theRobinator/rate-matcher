import {
    BINARY_OPERATOR_FUNCTIONS,
    BINARY_OPERATORS,
    BINOP_INVERSES, PRECISION_FACTOR,
    Puzzle,
    PuzzleDifficulty,
    PuzzleStep
} from "./Puzzle";
import {randomChoice} from "./utils";

const ALLOWED_SCALARS = [2, 3, 4, 5];
const ALLOWED_DIVISORS = [2, 4, 5];
const stepsByDifficulty: {[d in PuzzleDifficulty]: number} = {
    'easy': 3,
    'medium': 4,
    'hard': 6,
    'insane': 6,
};

export default function generatePuzzle(difficulty: PuzzleDifficulty, answer = 10): Puzzle {
    const steps: PuzzleStep[] = [];
    let currentFlow = answer * PRECISION_FACTOR;
    let sumCount = 0;
    let productCount = 0;
    let allowedOperators = BINARY_OPERATORS.slice();
    const targetStepCount = stepsByDifficulty[difficulty];

    for (let i = 0; i < targetStepCount; i++) {
        let operator = randomChoice(allowedOperators);
        let scalar;
        if (operator === '/' || operator === '*') {
            scalar = randomChoice(ALLOWED_DIVISORS);
            productCount++;
            if (productCount >= targetStepCount / 2) {
                allowedOperators = ['+', '-'];
            }
        } else {
            scalar = randomChoice(ALLOWED_SCALARS);
            sumCount++;
            if (sumCount >= targetStepCount / 2) {
                allowedOperators = ['*', '/'];
            }
        }
        currentFlow = BINARY_OPERATOR_FUNCTIONS[operator](currentFlow, scalar);
        steps.unshift({
            scalar,
            operation: BINOP_INVERSES[operator]
        });
    }
    return {
        start: currentFlow,
        steps,
        answer,
    };
}
