import { Icon16CancelCircleOutline, Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { SimpleCell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, PullToRefresh, Search, Snackbar, Header, Avatar } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import { useContextProvider } from "../context/context"


function FavoritesList(props) {

    const [controller] = useState(new AbortController())
    const [search, setSearch] = useState(history.state.searchValue)
    const { favoriteGroups, favoriteTeachers, toggleGroupsFavoriteFlag, toggleTeachersFavoriteFlag } = useContextProvider()

    const [groupsLoaded, setGroupsLoaded] = useState(localStorage.getItem("groups") ? true : false)
    const [groupLoadingFail, setGroupLoadingFail] = useState(false)
    const [groups, setGroups] = useState(
        localStorage.getItem("groups")
            ?
            JSON.parse(localStorage.getItem("groups")).filter(
                ({ name }) => favoriteGroups.includes(name.toLowerCase())
            )
            :
            []
    )
    const [groupsSearchResult, setGroupsSearchResult] = useState(
        localStorage.getItem("groups")
            ?
            JSON.parse(localStorage.getItem("groups")).filter(
                ({ name }) => favoriteGroups.includes(name.toLowerCase())
            )
            :
            []
    )
    const [teachers, setTeachers] = useState(
        localStorage.getItem("teachers")
            ?
            JSON.parse(localStorage.getItem("teachers")).filter(
                ({ id }) => favoriteTeachers.includes(id)
            )
            :
            []
    )
    const [teachersLoadingFail, setTeachersLoadingFail] = useState(false)
    const [teachersLoaded, setTeachersLoaded] = useState(localStorage.getItem("teachers") ? true : false)
    
    const [teachersSearchResult, setTeachersSearchResult] = useState(
        localStorage.getItem("teachers")
            ?
            JSON.parse(localStorage.getItem("teachers")).filter(
                ({ id }) => favoriteTeachers.includes(id)
            )
            :
            []
    )

    const [fetching, setFetching] = useState(false)
    const [snackbar, setSnackbar] = useState(null)    

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        let storyState = history.state
        storyState.searchValue = search
        history.replaceState(storyState, "")
        setGroupsSearchResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
        ))
        setTeachersSearchResult(teachers.filter(
            ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
        ))
    }, [search])

    useEffect(() => {
        setGroupsSearchResult(groups.filter(group => favoriteGroups.includes(group.name)))
    }, [favoriteGroups])

    useEffect(() => {
        if (!groupsLoaded) {
            axios
                .get("https://iis.bsuir.by/api/v1/student-groups", {
                    signal: controller.signal
                })
                .then(response => {
                    localStorage.setItem("groups", JSON.stringify(response.data))
                    setGroups(response.data.filter(({ name }) => favoriteGroups.includes(name.toLowerCase())))
                    setGroupsLoaded(() => {
                        setGroupsSearchResult(response.data.filter(
                            ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
                        ))
                        return true
                    })
                })
                .catch(() => {
                    setGroupLoadingFail(true)
                })
        }
    }, [])

    useEffect(() => {
        if (!teachersLoaded) {
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
                    setTeachers(data.filter(({ id }) => favoriteTeachers.includes(id)))
                    setTeachersLoaded(() => {
                        setTeachersSearchResult(data.filter(
                            ({ fullName }) => fullName.toLowerCase().indexOf(search.toLowerCase()) > -1
                        ))
                        return true
                    })
                })
                .catch(() => {
                    setTeachersLoadingFail(true)
                })
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

    const onRefreshGroups = () => {
        setFetching(true)
        axios
            .get("https://iis.bsuir.by/api/v1/student-groups", {
                signal: controller.signal
            })
            .then(response => {
                localStorage.setItem("groups", JSON.stringify(response.data))
                setGroups(response.data.filter(({ name }) => favoriteGroups.includes(name.toLowerCase())))
                setFetching(() => {
                    setGroupsSearchResult(response.data.filter(
                        ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
                    ))
                    return false
                })
                if (groupLoadingFail) {
                    setGroupsLoaded(true)
                    setGroupLoadingFail(false)
                }
            })
            .catch(() => {
                setFetching(false)
                setSnackbar(refreshErrorSnackbar)
            })
    }

    const openGroupScheduleHandler = (e) => {
        props.onGroupSelect(e)
    }

    const openTeachersScheduleHandler = (id) => {
        props.onTeacherSelect(id)
    }

    const changeHandler = (e) => {
        const state = history.state
        if (state.isSearch) {
            state.isSearch = true
            state.searchValue = e.target.value
            history.replaceState(state, "")
        } else {
            state.isSearch = true
            state.searchValue = e.target.value
            history.pushState(state, "")
        }
        setSearch(e.target.value)
    }

    const popstateHandler = () => {
        if (history.state) {
            setSearch(history.state.searchValue)
        }
    }

    const groupFavoriteFlagClickHandler = (e, groupName) => {
        e.stopPropagation()
        toggleGroupsFavoriteFlag(groupName)
        setSnackbar(null)
    }

    const teacherFavoriteFlagClickHandler = (e, teacheID) => {
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
            Не удалось обновить список групп
        </Snackbar>


    return (
        <>
            <FixedLayout vertical="top" filled="true">
                <Search
                    readOnly={!groupsLoaded || fetching}
                    value={search}
                    onChange={e => fetching ? () => { } : changeHandler(e)}
                    after="Отмена"
                />
            </FixedLayout>
            <>
                <Group
                    style={{ paddingTop: 40 }}
                >
                    {/* {!groupsLoaded && !groupLoadingFail && <PanelSpinner />}
                    {groupLoadingFail &&
                        <PullToRefresh
                            onRefresh={onRefresh}
                            isFetching={fetching}
                            style={{ minHeight: 350 }}
                        >
                            <Placeholder>Не удалось загрузить список групп</Placeholder>
                        </PullToRefresh>
                    } */}
                    {groupsLoaded && !groupLoadingFail && groupsSearchResult.length > 0 &&
                        <Group
                            header={<Header>Группы</Header>}
                            separator="hide"
                        >
                            <PullToRefresh
                                onRefresh={onRefreshGroups}
                                isFetching={fetching}
                            >
                                <List>
                                    {
                                        groupsSearchResult.map((group) => (
                                            <SimpleCell
                                                onClick={() => { openGroupScheduleHandler(group.name) }}
                                                key={group.id}
                                                expandable={true}
                                                before={
                                                    <IconButton onClick={e => groupFavoriteFlagClickHandler(e, group.name)}>
                                                        <Icon28Favorite fill="var(--accent)" />
                                                    </IconButton>
                                                }
                                            >
                                                {group.name}
                                            </SimpleCell>
                                        ))
                                    }
                                </List>
                            </PullToRefresh>
                        </Group>
                    }
                    {teachersLoaded && !teachersLoadingFail && teachersSearchResult.length > 0 &&
                        <Group
                            header={<Header>Преподаватели</Header>}
                            separator="hide"
                        >
                            <PullToRefresh
                                onRefresh={onRefreshGroups}
                                isFetching={fetching}
                            >
                                <List>
                                    {
                                        teachersSearchResult.map((teacher) => (
                                            <SimpleCell
                                                key={teacher.id}
                                                onClick={() => openTeachersScheduleHandler(teacher.id)}
                                                before={
                                                    <>
                                                        <IconButton onClick={e => teacherFavoriteFlagClickHandler(e, teacher.id)}>
                                                            <Icon28Favorite fill="var(--accent)" />
                                                        </IconButton>
                                                        <Avatar src={teacher.photoLink} />
                                                    </>
                                                }
                                                description={teacher.rank}
                                            >
                                                {teacher.fullName}
                                            </SimpleCell>
                                        ))
                                    }
                                </List>
                            </PullToRefresh>
                        </Group>
                    }
                </Group>
            </>
            { snackbar }
        </>
    )
}

export default FavoritesList