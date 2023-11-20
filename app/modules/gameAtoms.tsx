import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type game = [string, number|null]

export const gameAtoms = atomWithStorage<game>("game", ['',null]);

export const setGameAtoms = atom(
    null,
    (get, set, newGame : game) => {
        set(
            gameAtoms,
            newGame
        )
    }
)