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

    const [refreshGroupsErrorSnackbar, setRefreshGroupsErrorSnackbar] = useState(null)
    const [refreshTeachersErrorSnackbar, setRefreshTeachersErrorSnackbar] = useState(null)

    const [toggleGroupFavoriteFlagSnackbar, setToggleGroupFavoriteFlagSnackbar] = useState(null)
    const [toggleTeachreFavoriteFlagSnackbar, setToggleTeacherFavoriteFlagSnackbar] = useState(null)

    const [groups, setGroups] = useLocalStorage(null, "groups")
    const [teachers, setTeachers] = useLocalStorage(null, "teachers")

    const [loadGroupsController] = useState(new AbortController())
    const [loadTeachersController] = useState(new AbortController())

    const [errorLoadingGroupList, setErrorLoadingGroupList] = useState(false)
    const [errorLoadingTeachersList, setErrorLoadingTeachersList] = useState(false)

    const [fetchingGroups, setFetchingGroups] = useState(false)
    const [fetchingTeachers, setFetchingTeachers] = useState(false)

    const [reload, setReload] = useState(false)
    
    useEffect(() => {
        if (!groups) {
            axios
                .get("https://iis.bsuir.by/api/v1/student-groups", {
                    signal: loadGroupsController.signal
                })
                .then(response => {
                    setGroups(response.data)
                })
                .catch(() => {
                    setErrorLoadingGroupList(true)
                })
        }
    }, [,reload])

    useEffect(() => {
        if (!teachers) {
            axios
                .get("https://iis.bsuir.by/api/v1/employees/all", {
                    signal: loadTeachersController.signal
                })
                .then(response => {
                    const data = response.data.map(e => {
                        e.fullName = e.lastName + " " + e.firstName + " " + e.middleName
                        return e
                    })
                    setTeachers(data)
                })
                .catch(() => {
                    setErrorLoadingTeachersList(true)
                })
        }
    }, [,reload])

    const onReload = () => {
        setErrorLoadingTeachersList(false)
        setErrorLoadingGroupList(false)
        setReload(!reload)
    }

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
                setRefreshGroupsErrorSnackbar(<ErrorSnackbar message={"Не удалось обновить список групп"} setSnackbar={setRefreshGroupsErrorSnackbar} />)
            })
    }

    const onTeachersRefresh = () => {
        setFetchingTeachers(true)
        axios
            .get("https://iis.bsuir.by/api/v1/employees/all")
            .then(response => {
                const data = response.data.map(e => {
                    e.fullName = e.lastName + " " + e.firstName + " " + e.middleName
                    return e
                })
                setTeachers(data)
                setErrorLoadingTeachersList(false)
                setFetchingTeachers(false)
            })
            .catch(() => {
                setFetchingTeachers(false)
                setRefreshTeachersErrorSnackbar(<ErrorSnackbar message={"Не удалось обновить список преподавателей"} setSnackbar={setRefreshTeachersErrorSnackbar} />)
            })
    }

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
            .catch(() => {
                setToggleTeacherFavoriteFlagSnackbar(<ErrorSnackbar message={errorMessage} setSnackbar={setToggleTeacherFavoriteFlagSnackbar} />)
            })
    }

    const closeSnackbars = () => {
        setRefreshGroupsErrorSnackbar(null)
        setToggleGroupFavoriteFlagSnackbar(null)
        setToggleTeacherFavoriteFlagSnackbar(null)
        setRefreshTeachersErrorSnackbar(null)
    }

    return (
        <Context.Provider value={{
            favoriteGroups,
            favoriteTeachers,
            groups,
            teachers,
            errorLoadingGroupList,
            errorLoadingTeachersList,
            fetchingGroups,
            fetchingTeachers,
            toggleGroupsFavoriteFlag,
            toggleTeachersFavoriteFlag,
            onGroupRefresh,
            onTeachersRefresh,
            toggleGroupFavoriteFlagSnackbar,
            toggleTeachreFavoriteFlagSnackbar,
            refreshGroupsErrorSnackbar,
            refreshTeachersErrorSnackbar,
            closeSnackbars,
            onReload
        }}>
            { children }
        </Context.Provider>
    )
}  