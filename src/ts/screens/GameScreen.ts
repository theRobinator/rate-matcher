export interface GameScreen {
    enter(): Promise<void> | void;
    exit(): Promise<void> | void;
}
