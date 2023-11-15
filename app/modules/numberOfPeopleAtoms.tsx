import { atom } from "jotai"

export const numberOfPeopleAtom = atom<number | null>(null)

export const setNumberOfPeopleAtom = atom(
    null,
    (get, set, newNumber : number | null) => {
        set(
            numberOfPeopleAtom,
            newNumber
            )
    }
)
