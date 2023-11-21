import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const loginTryNumAtom = atomWithStorage("loginTryNum", 0);

export const setLoginTryNumAtom = atom(
    null,
    (get, set, count : number) => {
        set(
            loginTryNumAtom,
            count
        )
    }
)