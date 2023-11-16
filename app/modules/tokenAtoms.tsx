import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const tokenAtoms = atomWithStorage<string[]>('token',[]);

export const setTokenAtoms = atom(
    null,
    (get, set, token : string[]) => {
        set(
            tokenAtoms,
            token
        )
    }
)