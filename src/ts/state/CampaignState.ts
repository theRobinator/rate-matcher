import {localStorageGet, localStorageSet} from "../utils";
import {PuzzleDifficulty} from "../Puzzle";

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

export const CAMPAIGN_LEVELS: PuzzleDifficulty[] = [
    'easy', 'easy', 'easy',
    'medium', 'medium', 'medium',
    'hard', 'hard', 'hard',
    'insane'
];
