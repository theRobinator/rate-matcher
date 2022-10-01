export interface Puzzle {
    start: number;
    steps: PuzzleStep[];
    answer: number;
}

export interface PuzzleStep {
    operation: BinaryOperation;
    scalar: number;
}

export const BINARY_OPERATORS = ['+', '-', '*', '/'] as const;
export type BinaryOperation = typeof BINARY_OPERATORS[number];
export const BINARY_OPERATOR_FUNCTIONS: {[k in BinaryOperation]: (l: number, r: number) => number} = {
    '+': (input, scalar) => input + scalar * PRECISION_FACTOR,
    '-': (input, scalar) => input - scalar * PRECISION_FACTOR,
    '*': (input, scalar) => input * scalar,
    '/': (input, scalar) => input / (scalar),
}

export const BINOP_INVERSES: {[k in BinaryOperation]: BinaryOperation} = {
    '+': '-',
    '-': '+',
    '*': '/',
    '/': '*'
};

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

export const PRECISION_FACTOR = 100000000;
