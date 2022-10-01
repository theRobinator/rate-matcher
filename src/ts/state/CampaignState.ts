import {localStorageGet, localStorageSet} from "../utils";
import {PRECISION_FACTOR, Puzzle, PuzzleDifficulty} from "../Puzzle";

interface CampaignStateData {
    currentLevel: number;
}

const STORAGE_KEY = 'campaignState';

export default class CampaignState {
    private static readonly defaultState: CampaignStateData = {
        currentLevel: 0
    };
    private static currentState: CampaignStateData = localStorageGet(STORAGE_KEY) || CampaignState.defaultState;

    public static setCurrentLevel(level: number) {
        CampaignState.currentState.currentLevel = level;
        localStorageSet(STORAGE_KEY, CampaignState.currentState);
    }

    public static getCurrentLevel() {
        return CampaignState.currentState.currentLevel;
    }
}

export interface CampaignLevel {
    difficulty: PuzzleDifficulty;
    puzzle: Puzzle;
}

/**
 * Cards are: *4, -5, *2, -3
 BoardScreen.ts:340 Start at 6.75
 BoardScreen.ts:345 6.75 - 3 = 3.75
 BoardScreen.ts:345 3.75 * 2 = 7.5
 BoardScreen.ts:345 7.5 - 5 = 2.5
 BoardScreen.ts:345 2.5 * 4 = 10
 */
export const CAMPAIGN_LEVELS: CampaignLevel[] = [
    // Easy
    {
        difficulty: 'easy',
        puzzle: {
            start: 60,
            steps: [
                {
                    scalar: 5,
                    operation: '/'
                },
                {
                    scalar: 2,
                    operation: '+'
                },
                {
                    scalar: 4,
                    operation: '-'
                }
            ],
            answer: 10
        }
    },
    {
        difficulty: 'easy',
        puzzle: {
            start: 29,
            steps: [
                {
                    scalar: 5,
                    operation: '-'
                },
                {
                    scalar: 4,
                    operation: '/'
                },
                {
                    scalar: 4,
                    operation: '+'
                }
            ],
            answer: 10
        }
    },
    {
        difficulty: 'easy',
        puzzle: {
            start: -1,
            steps: [
                {
                    scalar: 2,
                    operation: '*'
                },
                {
                    scalar: 4,
                    operation: '+'
                },
                {
                    scalar: 5,
                    operation: '*'
                }
            ],
            answer: 10
        }
    },
    // Medium
    {
        difficulty: 'medium',
        puzzle: {
            "start": -27.5,
            "steps": [
                {
                    "scalar": 5,
                    "operation": "/"
                },
                {
                    "scalar": 3,
                    "operation": "+"
                },
                {
                    "scalar": 5,
                    "operation": "+"
                },
                {
                    "scalar": 4,
                    "operation": "*"
                }
            ],
            "answer": 10
        }
    },
    {
        difficulty: 'medium',
        puzzle: {
            start: 21,
            steps: [
                {
                    scalar: 3,
                    operation: '-'
                },
                {
                    scalar: 2,
                    operation: '*'
                },
                {
                    scalar: 4,
                    operation: '+'
                },
                {
                    scalar: 4,
                    operation: '/'
                }
            ],
            answer: 10
        }
    },
    {
        difficulty: 'medium',
        puzzle: {
            start: 13.5,
            steps: [
                {
                    scalar: 2,
                    operation: '+'
                },
                {
                    scalar: 3,
                    operation: '-'
                },
                {
                    scalar: 5,
                    operation: '/'
                },
                {
                    scalar: 4,
                    operation: '*'
                }
            ],
            answer: 10
        }
    },
    // Hard
    {
        difficulty: 'hard',
        puzzle: {
            start: -1,
            steps: [
                {
                    scalar: 2,
                    operation: '+'
                },
                {
                    scalar: 4,
                    operation: '*'
                },
                {
                    scalar: 5,
                    operation: '+'
                },
                {
                    scalar: 5,
                    operation: '*'
                },
                {
                    scalar: 5,
                    operation: '-'
                },
                {
                    scalar: 4,
                    operation: '/'
                }
            ],
            answer: 10
        }
    },
    {
        difficulty: 'hard',
        puzzle: {
            start: 22.5,
            steps: [
                {
                    scalar: 2,
                    operation: '/'
                },
                {
                    scalar: 4,
                    operation: '*'
                },
                {
                    scalar: 5,
                    operation: '+'
                },
                {
                    scalar: 5,
                    operation: '/'
                },
                {
                    scalar: 2,
                    operation: '+'
                },
                {
                    scalar: 2,
                    operation: '-'
                }
            ],
            answer: 10
        }
    },
    {
        difficulty: 'hard',
        puzzle: {
            start: 6.65,
            steps: [
                {
                    scalar: 5,
                    operation: '-'
                },
                {
                    scalar: 4,
                    operation: '*'
                },
                {
                    scalar: 4,
                    operation: '+'
                },
                {
                    scalar: 5,
                    operation: '*'
                },
                {
                    scalar: 3,
                    operation: '-'
                },
                {
                    scalar: 5,
                    operation: '/'
                }
            ],
            answer: 10
        }
    },
    // Insane
    {
        difficulty: 'insane',
        puzzle: {
            start: 3,
            steps: [
                {
                    scalar: 2,
                    operation: '+'
                },
                {
                    scalar: 5,
                    operation: '/'
                },
                {
                    scalar: 4,
                    operation: '*'
                },
                {
                    scalar: 3,
                    operation: '+'
                },
                {
                    scalar: 2,
                    operation: '-'
                },
                {
                    scalar: 2,
                    operation: '*'
                }
            ],
            answer: 10
        }
    },
];
for (const level of CAMPAIGN_LEVELS) {
    level.puzzle.start *= PRECISION_FACTOR;
}
