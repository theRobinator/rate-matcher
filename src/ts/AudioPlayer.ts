const AVAILABLE_SOUNDS = [
    'brokenline', 'click', 'end', 'light', 'powerup', 'tap', 'startup', 'success'
] as const;

export default class AudioPlayer {
    public static playSound(name: typeof AVAILABLE_SOUNDS[number]) {
        new Audio(`../src/assets/${name}.wav`).play();
    }
}
