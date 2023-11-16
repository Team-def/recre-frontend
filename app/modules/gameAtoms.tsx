import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const gameAtoms = atomWithStorage("game", "");

export const setGameAtoms = atom(
    null,
    (get, set, newGame : string) => {
        set(
            gameAtoms,
            newGame
        )
    }
)