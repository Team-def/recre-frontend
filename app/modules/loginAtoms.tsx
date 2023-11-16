import { atom } from "jotai"

export const loginAtom = atom(true)

export const setLoginAtom = atom(
    null,
    (get, set, newState : boolean) => {
        set(
            loginAtom,
            newState
        )
    }
)