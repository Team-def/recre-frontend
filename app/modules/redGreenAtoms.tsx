import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const redGreenInfoAtom = atomWithStorage<number[]>('redGreenInfo',[0, 100]);

export const setRedGreenInfo = atom(
    null,
    (get, set, newRedGreenInfo : number[]) => {
        set(
            redGreenInfoAtom,
            newRedGreenInfo
        )
    }
)