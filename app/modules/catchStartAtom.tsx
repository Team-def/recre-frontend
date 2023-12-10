import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const catchStartAtom = atomWithStorage("catchStart", false);

export const setCatchStartAtom = atom(
    null,
    (get, set, newState : boolean) => {
        set(
            catchStartAtom,
            newState
        )
    }
)