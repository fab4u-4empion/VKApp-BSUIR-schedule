import { createContext, useContext, useState } from "react";
import bridge from "@vkontakte/vk-bridge"
import { Snackbar } from "@vkontakte/vkui"
import { Icon16CancelCircleOutline } from "@vkontakte/icons"

const Context = createContext()

export const useContextProvider = () => {
    return useContext(Context)
}

export const СontextProvider = ({ children }) => {
    const [favoriteGroups, setFavoritesGroups] = useState(JSON.parse(sessionStorage.getItem("groupsFavorite")))
    const [snackbar, setSnackbar] = useState(null)

    const toggleGroupsFavoriteFlag = groupName => {
        let favoriteGroupsTemp = [...favoriteGroups]
        let errorSnackbar = null
        if (favoriteGroupsTemp.includes(groupName)) {
            favoriteGroupsTemp.splice(favoriteGroupsTemp.indexOf(groupName), 1)
            errorSnackbar =
                <Snackbar
                    onClose={() => { setSnackbar(null) }}
                    before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
                    duration={1700}
                >
                    Не удалось удалить группу из "Избранное"
                </Snackbar>

        } else {
            favoriteGroupsTemp.push(groupName)
            errorSnackbar =
                <Snackbar
                    onClose={() => { setSnackbar(null) }}
                    before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
                    duration={1700}
                >
                    Не удалось добавить группу в "Избранное"
                </Snackbar>
        }
        bridge
            .send("VKWebAppStorageSet", { "key": "groupsFavorite", "value": JSON.stringify(favoriteGroupsTemp) })
            .then(() => {
                setFavoritesGroups(favoriteGroupsTemp)
            })
            .catch(() => {
                setSnackbar(errorSnackbar)
            })
    }

    return (
        <Context.Provider value={{
            favoriteGroups: favoriteGroups,
            errorSnackbar: snackbar,
            toggleGroupsFavoriteFlag,
        }}>
            { children }
        </Context.Provider>
    )
}  