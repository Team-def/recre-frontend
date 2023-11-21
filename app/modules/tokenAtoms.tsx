import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const tokenAtoms = atomWithStorage<string>('access_token','');

export const setTokenAtoms = atom(
    null,
    (get, set, token : string) => {
        set(
            tokenAtoms,
            token
        )
    }
)