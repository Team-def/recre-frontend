import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type game = [string, number]

export const gameAtoms = atomWithStorage<game>("game", ['',0]);

export const setGameAtoms = atom(
    null,
    (get, set, newGame : game) => {
        set(
            gameAtoms,
            newGame
        )
    }
)