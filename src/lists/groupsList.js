import { Icon28FavoriteOutline } from "@vkontakte/icons"
import { Cell, FixedLayout, Footer, Group, IconButton, List, PanelSpinner, Placeholder, Search } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"

function GroupList() {

    const [search, setSearch] = useState("")
    const [load, setLoad] = useState(false)
    const [fail, setFail] = useState(false)
    const [groups, setGroups] = useState([])
    const [groupsResult, setGroupsResult] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [fetching, setFetching] = useState(false)
    const [groupsRender, setGroupsRender] = useState([])

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

    return (
        <span>
            <FixedLayout vertical="top">
                <Search 
                    readOnly={!load}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); } }
                    after={null}
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40}}>
                <List>
                    {load && groupsResult.length > 0 &&
                        groupsRender.map((group) => (
                            <Cell
                                key={group.id}
                                after={<IconButton><Icon28FavoriteOutline /></IconButton>}
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