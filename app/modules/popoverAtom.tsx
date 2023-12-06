import { atom } from "jotai"

export const anchorElAtom = atom<HTMLElement | null>(null);

export const setAnchorEl = atom(
    null,
    (get, set, popstate : HTMLElement | null) => {
        set(
            anchorElAtom,
            popstate
        )
    }
)