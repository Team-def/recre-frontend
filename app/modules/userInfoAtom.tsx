import { atom } from "jotai"

export const userInfoAtoms = atom<object>({})

export const setUserInfoAtoms = atom(
    null,
    (get, set, userInfo : object[]) => {
        set(
            userInfoAtoms,
            userInfo
        )
    }
)