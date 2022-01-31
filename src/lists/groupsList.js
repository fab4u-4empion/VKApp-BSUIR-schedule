import { Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Cell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, Search } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"
import bridge from "@vkontakte/vk-bridge"


function GroupList() {

    const [search, setSearch] = useState("")
    const [load, setLoad] = useState(sessionStorage.getItem("groups") ? true : false)
    const [fail, setFail] = useState(false)
    const [groups, setGroups] = useState(sessionStorage.getItem("groups") ? JSON.parse(sessionStorage.getItem("groups")) : [])
    const [groupsResult, setGroupsResult] = useState(
        sessionStorage.getItem("groups")
            ? 
                JSON.parse(sessionStorage.getItem("groups")).filter(
                    ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
                )
            : 
                []
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [fetching, setFetching] = useState(false)
    const [groupsRender, setGroupsRender] = useState([])
    const [groupsFavorite, setGroupsFavorite] = useState(sessionStorage.getItem("groupsFavorite") ? JSON.parse(sessionStorage.getItem("groupsFavorite")) : [])

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        setGroupsResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(search.toLowerCase()) > -1
        ))
    }, [search])

    useEffect(() => {
        if (fetching) {
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
        sessionStorage.setItem("groupsFavorite", JSON.stringify(groupsFavorite))
    }, [groupsFavorite])

    useEffect(() => {
        if (!load) {
            axios
                .get("https://journal.bsuir.by/api/v1/groups")
                .then(response => {
                    sessionStorage.setItem("groups", JSON.stringify(response.data))
                    setGroups(response.data)
                    setLoad(() => {
                        setGroupsResult(JSON.parse(sessionStorage.getItem("groups")).filter(
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
            setFetching(true)
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

    return (
        <span>
            <FixedLayout vertical="top" filled="true">
                <Search 
                    readOnly={!load}
                    value={search}
                    onChange={e => setSearch(e.target.value) }
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