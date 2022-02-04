import { Icon16CancelCircleOutline, Icon28ChevronRightOutline, Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Cell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, PullToRefresh, Search, Snackbar } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import bridge from "@vkontakte/vk-bridge"


function GroupList(props) {

    const [controller] = useState(new AbortController())
    const [search, setSearch] = useState(history.state.searchValue)
    const [snackbar, setSnackbar] = useState(null)
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
    const [currentPage, setCurrentPage] = useState(1)
    const [endOfPage, setEndOfPage] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [groupsRender, setGroupsRender] = useState([])
    const [groupsFavorite, setGroupsFavorite] = useState(sessionStorage.getItem("groupsFavorite") ? JSON.parse(sessionStorage.getItem("groupsFavorite")) : [])

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
        sessionStorage.setItem("groupsFavorite", JSON.stringify(groupsFavorite))
    }, [groupsFavorite])

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
        window.addEventListener("storageChange", storsgeChangeHandler)
        return function () {
            window.removeEventListener("storageChange", storsgeChangeHandler)
        }
    }, [])

    useEffect(() => {
        return function () {
            controller.abort()
        }
    }, [])

    const storsgeChangeHandler = (e) => {
        if (e.detail.key === "groups") {
            setGroups(JSON.parse(localStorage.getItem("groups")))
            setGroupsSearchResult(JSON.parse(localStorage.getItem("groups")).filter(
                ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
            ))
        }
    }

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setEndOfPage(true)
        }
    }

    const favoritesFlagButtonClickHandler = (e) => {
        const temp = [...groupsFavorite]
        let favoriteChangeErrorSnackbar = null
        if (groupsFavorite.includes(e)) {
            temp.splice(groupsFavorite.indexOf(e), 1)
            favoriteChangeErrorSnackbar = 
                <Snackbar
                    onClose={() => setSnackbar(null)}
                    before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
                    duration={1700}
                >
                    Не удалось удалить группу из "Избранное"
                </Snackbar>
        } else {
            temp.push(e)
            favoriteChangeErrorSnackbar =
                <Snackbar
                    onClose={() => setSnackbar(null)}
                    before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
                    duration={1700}
                >
                    Не удалось добавить группу в "Избранное"
                </Snackbar>
        }
        bridge
            .send("VKWebAppStorageSet", { "key": "groupsFavorite", "value": JSON.stringify(temp)})
            .then(() => {
                setGroupsFavorite(temp)
            })
            .catch(() => {
                setSnackbar(favoriteChangeErrorSnackbar)
            })
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
                    readOnly={!load || fetching}
                    value={search}
                    onChange={e => fetching ? search : setSearch(e.target.value) }
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40}}>
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
                                            <IconButton onClick={() => { favoritesFlagButtonClickHandler(group.id) }}>
                                                {groupsFavorite.includes(group.id) && <Icon28Favorite fill="var(--accent)" />}
                                                {!groupsFavorite.includes(group.id) && <Icon28FavoriteOutline fill="var(--accent)" />}
                                            </IconButton>
                                        }
                                        after={
                                            <IconButton onClick={() => { openGroupScheduleHandler(group.name) }}>
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
                {snackbar}
            </Group>
        </>
    )
}

export default GroupList