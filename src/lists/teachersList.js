import { Icon16CancelCircleOutline, Icon28ChevronRightOutline, Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Avatar, SimpleCell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, PullToRefresh, Search, Snackbar } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import { useContextProvider } from "../context/context"


function TeachersList(props) {

    const [controller] = useState(new AbortController())
    const [search, setSearch] = useState(history.state.searchValue)
    const [load, setLoad] = useState(localStorage.getItem("teachers") ? true : false)
    const [fail, setFail] = useState(false)
    const [teachers, setTeachers] = useState(localStorage.getItem("teachers") ? JSON.parse(localStorage.getItem("teachers")) : [])
    const [teachersSearchResult, setTeachersSearchResult] = useState(
        localStorage.getItem("teachers")
            ?
            JSON.parse(localStorage.getItem("teachers")).filter(
                ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
            )
            :
            []
    )
    const [currentPage, setCurrentPage] = useState(history.state.groups_CurrentPage)
    const [endOfPage, setEndOfPage] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [teachersRender, setTeachersRender] = useState([])
    const [snackbar, setSnackbar] = useState(null)

    const { favoriteTeachers, toggleTeachersFavoriteFlag } = useContextProvider()

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        let storyState = history.state
        storyState.searchValue = search
        history.replaceState(storyState, "")
        setTeachersSearchResult(teachers.filter(
            ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
        ))
    }, [search])

    useEffect(() => {
        if (endOfPage && teachersSearchResult.length > 30) {
            setTeachersRender([...teachersRender, ...teachersSearchResult.slice(currentPage * 30, currentPage * 30 + 30)])
            setCurrentPage(currentPage => currentPage + 1)
            setEndOfPage(false)
        } else {
            setEndOfPage(false)
        }
    }, [endOfPage])

    useEffect(() => {
        setCurrentPage(1)
        setTeachersRender(teachersSearchResult.slice(0, 30))
    }, [teachersSearchResult])

    useEffect(() => {
        if (!load) {
            axios
                .get("https://iis.bsuir.by/api/v1/employees/all", {
                    signal: controller.signal
                })
                .then(response => {
                    const data = response.data.map(e => {
                        e.fullName = e.lastName + " " + e.firstName + " " + e.middleName
                        return e
                    })
                    localStorage.setItem("teachers", JSON.stringify(data))
                    setTeachers(data)
                    setLoad(() => {
                        setTeachersSearchResult(JSON.parse(localStorage.getItem("teachers")).filter(
                            ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
                        ))
                        return true
                    })
                })
                .catch(() => {
                    setFail(true)
                })
        }
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler)
        return function () {
            window.removeEventListener("scroll", scrollHandler)
        }
    }, [])

    useEffect(() => {
        return function () {
            controller.abort()
        }
    }, [])

    useEffect(() => {
        return function () {
            setSnackbar(null)
        }
    }, [])

    useEffect(() => {
        window.addEventListener("popstate", popstateHandler)
        return function () {
            window.removeEventListener("popstate", popstateHandler)
        }
    }, [])



    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setEndOfPage(true)
        }
    }

    const onRefresh = () => {
        setFetching(true)
        axios
            .get("https://iis.bsuir.by/api/v1/employees/all", {
                signal: controller.signal
            })
            .then(response => {
                const data = response.data.map(e => {
                    e.fullName = e.lastName + " " + e.firstName + " " + e.middleName
                    return e
                })
                localStorage.setItem("teachers", JSON.stringify(data))
                setTeachers(data)
                setFetching(() => {
                    setTeachersSearchResult(JSON.parse(localStorage.getItem("teachers")).filter(
                        ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
                    ))
                    return false
                })
                if (fail) {
                    setLoad(true)
                    setFail(false)
                }
            })
            .catch(() => {
                setFetching(false)
                setSnackbar(refreshErrorSnackbar)
            })
    }

    const openTeachersScheduleHandler = (id) => {
        props.onTeacherSelect(id)
    }

    const changeHandler = (e) => {
        if (history.state.isSearch) {
            history.replaceState({
                activeStory: "teachers",
                searchValue: e.target.value,
                isSearch: true,
                teachers_activePanel: "teachers-list",
                teachers_contextOpened: false,
                body_overflow: "visible"
            }, "")
        } else {
            history.pushState({
                activeStory: "teachers",
                searchValue: e.target.value,
                isSearch: true,
                teachers_activePanel: "teachers-list",
                teachers_contextOpened: false,
                body_overflow: "visible"
            }, "")
        }
        setSearch(e.target.value)
    }

    const popstateHandler = () => {
        if (history.state) {
            setSearch(history.state.searchValue)
        }
    }

    const favoriteFlagClickHandler = (e, teacheID) => {
        e.stopPropagation()
        toggleTeachersFavoriteFlag(teacheID)
        setSnackbar(null)
    }

    const refreshErrorSnackbar =
        <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
            duration={1700}
        >
            Не удалось обновить список преподавателей
        </Snackbar>


    return (
        <>
            <FixedLayout vertical="top" filled="true">
                <Search
                    readOnly={!load || fetching}
                    value={search}
                    onChange={e => fetching ? () => { } : changeHandler(e)}
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40 }}>
                {!load && !fail && <PanelSpinner />}
                {fail &&
                    <PullToRefresh
                        onRefresh={onRefresh}
                        isFetching={fetching}
                        style={{ minHeight: 350 }}
                    >
                        <Placeholder>Не удалось загрузить список преподавателей</Placeholder>
                    </PullToRefresh>
                }
                {load && !fail &&
                    <PullToRefresh
                        onRefresh={onRefresh}
                        isFetching={fetching}
                        style={{ minHeight: 350 }}
                    >
                        <List>
                            {teachersSearchResult.length > 0 &&
                                teachersRender.map((teacher) => (
                                    <SimpleCell
                                        key={teacher.id}
                                        onClick={() => openTeachersScheduleHandler(teacher.id)}
                                        before={
                                            <>
                                                <IconButton onClick={e => favoriteFlagClickHandler(e, teacher.id) }>
                                                    {favoriteTeachers.includes(teacher.id) && <Icon28Favorite fill="var(--accent)" />}
                                                    {!favoriteTeachers.includes(teacher.id) && <Icon28FavoriteOutline fill="var(--accent)" />}
                                                </IconButton>
                                                <Avatar src={teacher.photoLink} />
                                            </>
                                        }
                                        description={teacher.rank}
                                    >
                                        {teacher.fullName}
                                    </SimpleCell>
                                ))}
                        </List>
                        {teachersSearchResult.length === 0 && <Footer>Ничего не найдено</Footer>}
                    </PullToRefresh>
                }
                { snackbar }
            </Group>
        </>
    )
}

export default TeachersList