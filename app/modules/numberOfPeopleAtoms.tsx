import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const numberOfPeopleAtom = atomWithStorage<number | null>("numberOfPeople", null);

export const setNumberOfPeopleAtom = atom(
    null,
    (get, set, newNumber : number | null) => {
        set(
            numberOfPeopleAtom,
            newNumber
            )
    }
)
