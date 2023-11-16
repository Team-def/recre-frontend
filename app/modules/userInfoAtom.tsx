import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

type userInfo = {
    id:string,
    nickname:string,
    email:string,
    profileImage:string,
    provider:string,
}

export const userInfoAtoms = atomWithStorage<userInfo>("userInfo", {
    id: '',
    nickname: '',
    email: '',
    profileImage: '',
    provider: '',
})

export const setUserInfoAtoms = atom(
    null,
    (get, set, userInfo : userInfo) => {
        set(
            userInfoAtoms,
            userInfo
        )
    }
)