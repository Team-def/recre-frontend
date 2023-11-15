import { atom } from "jotai"

export const numberOfPeopleAtom = atom(0)

export const setNumberOfPeopleAtom = atom(
    null,
    (get, set, newNumber : number) => {
        set(
            numberOfPeopleAtom,
            newNumber
            )
    }
)
