import { createContext, useContext, useState } from "react";
import bridge from "@vkontakte/vk-bridge"
import { ErrorSnackbar } from "../components/alerts/errorSnackbar";

const Context = createContext()

export const useContextProvider = () => {
    return useContext(Context)
}

export const СontextProvider = ({ children }) => {
    const [favoriteGroups, setFavoritesGroups] = useState(JSON.parse(sessionStorage.getItem("groupsFavorite")))
    const [favoriteTeachers, setFavoritesTeachers] = useState(JSON.parse(sessionStorage.getItem("teachersFavorite")))
    const [snackbar, setSnackbar] = useState(null)

    const toggleGroupsFavoriteFlag = groupName => {
        let favoriteGroupsTemp = [...favoriteGroups]
        let errorMessage = ""
        if (favoriteGroupsTemp.includes(groupName)) {
            favoriteGroupsTemp.splice(favoriteGroupsTemp.indexOf(groupName), 1)
            errorMessage = 'Не удалось удалить группу из "Избранное"'
        } else {
            favoriteGroupsTemp.push(groupName)
            errorMessage = 'Не удалось добавить группу в "Избранное"'
        }

        bridge
            .send("VKWebAppStorageSet", { "key": "groupsFavorite", "value": JSON.stringify(favoriteGroupsTemp) })
            .then(() => {
                setFavoritesGroups(favoriteGroupsTemp)
            })
            .catch(() => {
                setSnackbar(<ErrorSnackbar message={errorMessage} setSnackbar={setSnackbar}/>)
            })
    }

    const toggleTeachersFavoriteFlag = teacherID => {
        let favoriteTeachersTemp = [...favoriteTeachers]
        let errorMessage = ""
        if (favoriteTeachersTemp.includes(teacherID)) {
            favoriteTeachersTemp.splice(favoriteTeachersTemp.indexOf(teacherID), 1)
            errorMessage = 'Не удалось удалить преподавателя из "Избранное"' 
        } else {
            favoriteTeachersTemp.push(teacherID)
            errorMessage = 'Не удалось добавить преподавателя в "Избранное"' 
        }
        bridge
            .send("VKWebAppStorageSet", { "key": "teachersFavorite", "value": JSON.stringify(favoriteTeachersTemp) })
            .then(() => {
                setFavoritesTeachers(favoriteTeachersTemp)
            })
            .catch(() => {
                setSnackbar(<ErrorSnackbar message={errorMessage} setSnackbar={setSnackbar} />)
            })
    }

    return (
        <Context.Provider value={{
            favoriteGroups: favoriteGroups,
            favoriteTeachers: favoriteTeachers,
            errorSnackbar: snackbar,
            toggleGroupsFavoriteFlag,
            toggleTeachersFavoriteFlag
        }}>
            { children }
        </Context.Provider>
    )
}  