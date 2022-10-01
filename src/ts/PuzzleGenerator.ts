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
const MAX_INPUTS = 1;
const MAX_OUTPUTS = 3;
const stepsByDifficulty: {[d in PuzzleDifficulty]: number} = {
    'easy': 3,
    'medium': 4,
    'hard': 6,
};

export default function generatePuzzle(difficulty: PuzzleDifficulty, answer = 10): Puzzle {
    const steps: PuzzleStep[] = [];
    let currentFlow = answer * PRECISION_FACTOR;
    for (let i = 0; i < stepsByDifficulty[difficulty]; i++) {
        let operator = randomChoice(BINARY_OPERATORS);
        let scalar;
        if (operator === '/' || operator === '*') {
            scalar = randomChoice(ALLOWED_DIVISORS);
        } else {
            scalar = randomChoice(ALLOWED_SCALARS);
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
