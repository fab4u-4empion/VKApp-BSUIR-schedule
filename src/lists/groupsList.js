import { Icon16CancelCircleOutline, Icon28ChevronRightOutline, Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Cell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, PullToRefresh, Search, Snackbar } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import bridge from "@vkontakte/vk-bridge"
import { useContextProvider } from "../context/context"


function GroupList(props) {

    const [controller] = useState(new AbortController())
    const [search, setSearch] = useState(history.state.searchValue)
    const [load, setLoad] = useState(localStorage.getItem("groups") ? true : false)
    const [fail, setFail] = useState(false)
    const [groups, setGroups] = useState(localStorage.getItem("groups") ? JSON.parse(localStorage.getItem("groups")) : [])
    const [groupsSearchResult, setGroupsSearchResult] = useState(
        localStorage.getItem("groups")
            ? 
                JSON.parse(localStorage.getItem("groups")).filter(
                    ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
                )
            : 
                []
    )
    const [currentPage, setCurrentPage] = useState(history.state.groups_CurrentPage)
    const [endOfPage, setEndOfPage] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [groupsRender, setGroupsRender] = useState([])

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        let storyState = history.state
        storyState.searchValue = search
        history.replaceState(storyState, "")
        setGroupsSearchResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
        ))
    }, [search])

    useEffect(() => {
        if (endOfPage && groupsSearchResult.length > 30) {
            setGroupsRender([...groupsRender, ...groupsSearchResult.slice(currentPage * 30, currentPage * 30 + 30)])
            setCurrentPage(currentPage => currentPage + 1)
            setEndOfPage(false)
        } else {
            setEndOfPage(false)
        }
    }, [endOfPage])

    useEffect(() => {
        setCurrentPage(1)
        setGroupsRender(groupsSearchResult.slice(0, 30))
    }, [groupsSearchResult])

    useEffect(() => { 
        if (!load) {
            axios
                .get("https://journal.bsuir.by/api/v1/groups", {
                    signal: controller.signal
                })
                .then(response => {
                    console.log("test")
                    localStorage.setItem("groups", JSON.stringify(response.data))
                    setGroups(response.data)
                    setLoad(() => {
                        setGroupsSearchResult(JSON.parse(localStorage.getItem("groups")).filter(
                            ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
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
        window.addEventListener("popstate", popstateHandler)
        return function () {
            window.removeEventListener("popstate", popstateHandler)
        }
    }, [])

    const { favoriteGroups, toggleGroupsFavoriteFlag, toggleFlagErrorSnackbar } = useContextProvider()

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setEndOfPage(true)
        }
    }

    const onRefresh = () => {
        setFetching(true)
        axios
            .get("https://journal.bsuir.by/api/v1/groups", {
                signal: controller.signal
            })
            .then(response => {
                localStorage.setItem("groups", JSON.stringify(response.data))
                setGroups(response.data)
                setFetching(() => {
                    setGroupsSearchResult(JSON.parse(localStorage.getItem("groups")).filter(
                        ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
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

    const openGroupScheduleHandler = (e) => {
        props.onGroupSelect(e)
    }

    const changeHandler = (e) => {
        if (history.state.isSearch) {
            history.replaceState({
                activeStory: "groups",
                searchValue: e.target.value,
                isSearch: true,
                groups_activePanel: "groups-list",
                groups_contextOpened: false
            }, "")
        } else {
            history.pushState({
                activeStory: "groups",
                searchValue: e.target.value,
                isSearch: true,
                groups_activePanel: "groups-list",
                groups_contextOpened: false
            }, "")
        }
        setSearch(e.target.value)
    }

    const popstateHandler = () => {
        if (history.state) {
            setSearch(history.state.searchValue)
        }
    }

    const refreshErrorSnackbar = 
        <Snackbar
            onClose={ () => setSnackbar(null) }
            before={ <Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} /> }
            duration={1700}
        >
            Не удалось обновить список групп
        </Snackbar>
        

    return (
        <>
            <FixedLayout vertical="top" filled="true">
                <Search 
                    readOnly={!load || fetching}
                    value={search}
                    onChange={ e => fetching ? () => {} : changeHandler(e) }
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40 }}>
                { !load && !fail && <PanelSpinner /> }
                { fail && 
                    <PullToRefresh
                        onRefresh={onRefresh}
                        isFetching={fetching}
                        style={{ minHeight: 350 }}
                    >
                        <Placeholder>Не удалось загрузить список групп</Placeholder>
                    </PullToRefresh>
                }
                { load && !fail &&
                    <PullToRefresh
                        onRefresh={onRefresh}
                        isFetching={fetching}
                        style={{ minHeight: 350 }}
                    >
                        <List>
                            { groupsSearchResult.length > 0 &&
                                groupsRender.map((group) => (
                                    <Cell
                                        disabled={true}
                                        key={group.id}
                                        before={
                                            <IconButton onClick={() => { toggleGroupsFavoriteFlag(group.name) }}>
                                                { favoriteGroups.includes(group.name) && <Icon28Favorite fill="var(--accent)" /> }
                                                { !favoriteGroups.includes(group.name) && <Icon28FavoriteOutline fill="var(--accent)" /> }
                                            </IconButton>
                                        }
                                        after={
                                            <IconButton onClick={ () => { openGroupScheduleHandler(group.name) } }>
                                                <Icon28ChevronRightOutline fill="var(--icon_tertiary)" />
                                            </IconButton>
                                        }
                                    >
                                        {group.name}
                                    </Cell>
                                ))}
                        </List>
                        { groupsSearchResult.length === 0 && <Footer>Ничего не найдено</Footer> }
                    </PullToRefresh>
                }
                { toggleFlagErrorSnackbar }
            </Group>
        </>
    )
}

export default GroupList