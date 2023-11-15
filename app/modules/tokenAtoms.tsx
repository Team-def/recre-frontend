import { atom } from "jotai"

export const tokenAtoms = atom<string[]>([])

export const setTokenAtoms = atom(
    null,
    (get, set, token : string[]) => {
        set(
            tokenAtoms,
            token
        )
    }
)