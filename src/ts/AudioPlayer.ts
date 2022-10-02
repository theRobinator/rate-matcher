import '../assets/brokenline.wav';
import '../assets/click.wav';
import '../assets/end.wav';
import '../assets/light.wav';
import '../assets/powerup.wav';
import '../assets/tap.wav';
import '../assets/startup.wav';
import '../assets/success.wav';

const AVAILABLE_SOUNDS = [
    'brokenline', 'click', 'end', 'light', 'powerup', 'tap', 'startup', 'success'
] as const;

export default class AudioPlayer {
    public static playSound(name: typeof AVAILABLE_SOUNDS[number]) {
        new Audio(`./${name}.wav`).play();
    }
}
