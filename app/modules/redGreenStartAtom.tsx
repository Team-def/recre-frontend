import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const redGreenStartAtom = atomWithStorage("redGreenStart", false);

export const setredGreenStartAtom = atom(
    null,
    (get, set, newState : boolean) => {
        set(
            redGreenStartAtom,
            newState
        )
    }
)