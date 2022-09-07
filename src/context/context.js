import { createContext, useContext, useEffect, useState } from "react";
import bridge from "@vkontakte/vk-bridge"
import { ErrorSnackbar } from "../components/alerts/errorSnackbar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import axios from "axios";

const Context = createContext()

export const useContextProvider = () => {
    return useContext(Context)
}

export const СontextProvider = ({ children }) => {
    const [favoriteGroups, setFavoritesGroups] = useState(JSON.parse(sessionStorage.getItem("groupsFavorite")))
    const [favoriteTeachers, setFavoritesTeachers] = useState(JSON.parse(sessionStorage.getItem("teachersFavorite")))
    const [refreshErrorSnackbar, setRefreshErrorSnackbar] = useState(null)
    const [toggleGroupFavoriteFlagSnackbar, setToggleGroupFavoriteFlagSnackbar] = useState(null)
    const [groups, setGroups] = useLocalStorage(null, "groups")
    const [controller] = useState(new AbortController())
    const [errorLoadingGroupList, setErrorLoadingGroupList] = useState(false)
    const [fetchingGroups, setFetchingGroups] = useState(false)
    
    useEffect(() => {
        if (!groups) {
            axios
                .get("https://iis.bsuir.by/api/v1/student-groups", {
                    signal: controller.signal
                })
                .then(response => {
                    setGroups(response.data)
                })
                .catch(() => {
                    setErrorLoadingGroupList(true)
                })
        }
    }, [])

    const onGroupRefresh = () => {
        setFetchingGroups(true)
        axios
            .get("https://iis.bsuir.by/api/v1/student-groups")
            .then(response => {
                setGroups(response.data)
                setErrorLoadingGroupList(false)
                setFetchingGroups(false)
            })
            .catch(() => {
                setFetchingGroups(false)
                setRefreshErrorSnackbar(<ErrorSnackbar message={"Не удалось обновить список групп"} setSnackbar={setRefreshErrorSnackbar} />)
            })
    }

    useEffect(() => {
        return function () {
            controller.abort()
            fetchingGroupController.abort()
        }
    }, [])

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
                setToggleGroupFavoriteFlagSnackbar(<ErrorSnackbar message={errorMessage} setSnackbar={setToggleGroupFavoriteFlagSnackbar}/>)
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
            // .catch(() => {
            //     setSnackbar(<ErrorSnackbar message={errorMessage} setSnackbar={setSnackbar} />)
            // })
    }

    const closeSnackbars = () => {
        setRefreshErrorSnackbar(null)
        setToggleGroupFavoriteFlagSnackbar(null)
    }

    return (
        <Context.Provider value={{
            favoriteGroups,
            favoriteTeachers,
            groups,
            errorLoadingGroupList: errorLoadingGroupList,
            fetchingGroups,
            toggleGroupsFavoriteFlag,
            toggleTeachersFavoriteFlag,
            onGroupRefresh,
            toggleGroupFavoriteFlagSnackbar,
            refreshErrorSnackbar,
            closeSnackbars
        }}>
            { children }
        </Context.Provider>
    )
}  