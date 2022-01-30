import { Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Cell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, Search } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import bridge from "@vkontakte/vk-bridge"


function GroupList() {

    const [search, setSearch] = useState("")
    const [searchStart, setSearchStart] = useState(true)
    const [load, setLoad] = useState(false)
    const [fail, setFail] = useState(false)
    const [groups, setGroups] = useState([])
    const [groupsResult, setGroupsResult] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [fetching, setFetching] = useState(false)
    const [groupsRender, setGroupsRender] = useState([])
    const [groupsFavorite, setGroupsFavorite] = useState([])

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        const searchValue = search.toLowerCase();
        setGroupsResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(searchValue) > -1
        ))
    }, [search])

    useEffect(() => {
        if(fetching) {
            setGroupsRender([...groupsRender, ...groupsResult.slice(currentPage * 30, currentPage * 30 + 30)])
            setCurrentPage(currentPage => currentPage + 1)
            setFetching(false)
        }
    }, [fetching])

    useEffect(() => {
        setCurrentPage(1)
        setGroupsRender(groupsResult.slice(0, 30))
    }, [groupsResult])

    useEffect(() => {
        if (sessionStorage.getItem("groups")) {
            setGroups(JSON.parse(sessionStorage.getItem("groups")))
            setLoad(() => {
                const searchValue = search.toLowerCase();
                setGroupsResult(JSON.parse(sessionStorage.getItem("groups")).filter(
                    ({ name }) => name.toLowerCase().indexOf(searchValue) > -1
                ))
                return true
            })
        } else {
            axios
                .get("https://journal.bsuir.by/api/v1/groups")
                .then(response => {
                    sessionStorage.setItem("groups", JSON.stringify(response.data))
                    setGroups(response.data)
                    setLoad(() => {
                        const searchValue = search.toLowerCase();
                        setGroupsResult(JSON.parse(sessionStorage.getItem("groups")).filter(
                            ({ name }) => name.toLowerCase().indexOf(searchValue) > -1
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
        if(sessionStorage.getItem("groupsFavorite"))
            setGroupsFavorite(JSON.parse(sessionStorage.getItem("groupsFavorite")))
    }, [])

    useEffect(() => {
        sessionStorage.setItem("groupsFavorite", JSON.stringify(groupsFavorite))
    }, [groupsFavorite])

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler)
        return function () {
            window.removeEventListener("scroll", scrollHandler)
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
            setFetching(true)
        }
    }

    const iconButtonOnClickHandler = (e) => {
        const temp = [...groupsFavorite]
        if(groupsFavorite.includes(e)) {
            temp.splice(groupsFavorite.indexOf(e), 1)
            setGroupsFavorite(temp)
        } else {
            temp.push(e)
            setGroupsFavorite(temp)
        }
        bridge
            .send("VKWebAppStorageSet", { "key": "groupsFavorite", "value": JSON.stringify(temp)})
    }

    const onChangeHandler = (v) => {
        if(searchStart) { 
            history.pushState({
                title: "search",
                searchValue: ""
            }, "")
            history.pushState({
                title: "search",
                searchValue: v
            }, "")
            setSearchStart(false)
        } else {
            history.replaceState({
                title: "search",
                searchValue: v
            }, "")
        }
        setSearch(v)
    }

    const popstateHandler = () => {
        if (history.state && history.state.title === "search") {
            setSearch(history.state.searchValue)
        }
    }

    return (
        <span>
            <FixedLayout vertical="top" filled="true">
                <Search 
                    readOnly={!load}
                    value={search}
                    onChange={e =>  onChangeHandler(e.target.value) }
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40}}>
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
                {!load && !fail && <PanelSpinner />}
                {load && groupsResult.length === 0 && <Footer>Ничего не найдено</Footer>}
                {fail && <Placeholder>Не удалось загрузить список групп</Placeholder>}
            </Group>
        </span>
    )
}

export default GroupList