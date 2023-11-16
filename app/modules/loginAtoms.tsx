import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const loginAtom = atomWithStorage("login", true);

export const setLoginAtom = atom(
    null,
    (get, set, newState : boolean) => {
        set(
            loginAtom,
            newState
        )
    }
)