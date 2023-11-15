import { atom } from "jotai"

export const gameAtoms = atom("")

export const setGameAtoms = atom(
    null,
    (get, set, newGame : string) => {
        set(
            gameAtoms,
            newGame
        )
    }
)