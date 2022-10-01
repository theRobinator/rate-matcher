export function forEachInEnum<T extends {[key: string]: string | number}>(enumObj: T, iterator: (value: T[keyof T], key: keyof T) => void) {
    for (const key in enumObj) {
        if (Number(key).toString() !== key) {
            iterator(enumObj[key], key);
        }
    }
}

export function randomChoice<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function shuffle<T extends any[]>(array: T): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function wait(duration: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
