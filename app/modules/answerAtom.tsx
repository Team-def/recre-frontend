import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const answerAtom = atomWithStorage<string|null>('answer',null);

export const setAnswerAtoms = atom(
    null,
    (get, set, answer : string) => {
        set(
            answerAtom,
            answer
        )
    }
)