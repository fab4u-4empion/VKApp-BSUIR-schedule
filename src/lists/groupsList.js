import { Icon16CancelCircleOutline, Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Avatar, Cell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, PullToRefresh, Search, Snackbar } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import bridge from "@vkontakte/vk-bridge"


function GroupList() {

    const [search, setSearch] = useState(history.state.searchValue)
    const [snackbar, setSnackbar] = useState(null)
    const [load, setLoad] = useState(localStorage.getItem("groups") ? true : false)
    const [fail, setFail] = useState(false)
    const [groups, setGroups] = useState(localStorage.getItem("groups") ? JSON.parse(localStorage.getItem("groups")) : [])
    const [groupsResult, setGroupsResult] = useState(
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
        setGroupsResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
        ))
    }, [search])

    useEffect(() => {
        if (endOfPage) {
            setGroupsRender([...groupsRender, ...groupsResult.slice(currentPage * 30, currentPage * 30 + 30)])
            setCurrentPage(currentPage => currentPage + 1)
            setEndOfPage(false)
        }
    }, [endOfPage])

    useEffect(() => {
        setCurrentPage(1)
        setGroupsRender(groupsResult.slice(0, 30))
    }, [groupsResult])

    useEffect(() => {
        sessionStorage.setItem("groupsFavorite", JSON.stringify(groupsFavorite))
    }, [groupsFavorite])

    useEffect(() => {
        if (!load) {
            axios
                .get("https://journal.bsuir.by/api/v1/groups")
                .then(response => {
                    localStorage.setItem("groups", JSON.stringify(response.data))
                    setGroups(response.data)
                    setLoad(() => {
                        setGroupsResult(JSON.parse(localStorage.getItem("groups")).filter(
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

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setEndOfPage(true)
        }
    }

    const iconButtonOnClickHandler = (e) => {
        const temp = [...groupsFavorite]
        if (groupsFavorite.includes(e)) {
            temp.splice(groupsFavorite.indexOf(e), 1)
            setGroupsFavorite(temp)
        } else {
            temp.push(e)
            setGroupsFavorite(temp)
        }
        bridge
            .send("VKWebAppStorageSet", { "key": "groupsFavorite", "value": JSON.stringify(temp)})
    }

    const onRefresh = () => {
        setFetching(true)
        axios
            .get("https://journal.bsuir.by/api/v1/groups")
            .then(response => {
                localStorage.setItem("groups", JSON.stringify(response.data))
                setGroups(response.data)
                setFetching(() => {
                    setGroupsResult(JSON.parse(localStorage.getItem("groups")).filter(
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
                setSnackbar(errorSnackbar)
            })
    }

    const errorSnackbar = 
        <Snackbar
            onClose={() => setSnackbar(null)}
            before={<Icon16CancelCircleOutline fill="var(--dynamic_red)" width={24} height={24} />}
        >
            Не удалось обновить список групп
        </Snackbar>

    return (
        <>
            <FixedLayout vertical="top" filled="true">
                <Search 
                    readOnly={!load}
                    value={search}
                    onChange={e => setSearch(e.target.value) }
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40}}>
                { !load && !fail && <PanelSpinner /> }
                { fail && 
                    <PullToRefresh
                        onRefresh={onRefresh}
                        isFetching={fetching}
                    >
                        <Placeholder>Не удалось загрузить список групп</Placeholder>
                    </PullToRefresh>
                }
                { load && !fail &&
                    <PullToRefresh
                        onRefresh={onRefresh}
                        isFetching={fetching}
                    >
                        <List>
                            {load && groupsResult.length > 0 &&
                                groupsRender.map((group) => (
                                    <Cell
                                        key={group.id}
                                        after={
                                            <IconButton onClick={() => { iconButtonOnClickHandler(group.id) }}>
                                                {groupsFavorite.includes(group.id) && <Icon28Favorite />}
                                                {!groupsFavorite.includes(group.id) && <Icon28FavoriteOutline />}
                                            </IconButton>
                                        }
                                    >
                                        {group.name}
                                    </Cell>
                                ))}
                        </List>
                        { groupsResult.length === 0 && <Footer>Ничего не найдено</Footer> }
                    </PullToRefresh>
                }
                {snackbar}
            </Group>
        </>
    )
}

export default GroupList