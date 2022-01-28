import { Icon28FavoriteOutline } from "@vkontakte/icons"
import { FixedLayout, Footer, Group, IconButton, PanelSpinner, Placeholder, Search, SimpleCell } from "@vkontakte/vkui"
import axios from "axios"
import { useEffect, useState } from "react"

function GroupList() {

    const [search, setSearch] = useState("")
    const [load, setLoad] = useState(false)
    const [fail, setFail] = useState(false)
    const [groups, setGroups] = useState([])
    const [groupsResult, setGroupsResult] = useState([])

    useEffect(() => {
        const searchValue = search.toLowerCase();
        setGroupsResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(searchValue) > -1
        ))
    }, [search])

    useEffect(() => {
        const searchValue = search.toLowerCase();
        setGroupsResult(groups.filter(
            ({ name }) => name.toLowerCase().indexOf(searchValue) > -1
        ))
    }, [groups])

    useEffect(() => {
        if (sessionStorage.getItem("groups")) {
            setGroups(JSON.parse(sessionStorage.getItem("groups")))
            setLoad(true)
        } else {
            axios
                .get("https://journal.bsuir.by/api/v1/groups")
                .then(response => {
                    sessionStorage.setItem("groups", JSON.stringify(response.data))
                    setGroups(response.data)
                    setLoad(true)
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

    }

    return (
        <span>
            <FixedLayout vertical="top">
                <Search 
                    readOnly={!load}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value) } }
                    after={null}
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40}}>
                {!load && !fail && <PanelSpinner />}
                {load && groupsResult.length > 0 &&
                    groupsResult.map((group) => (
                        <SimpleCell
                            key={group.id}
                            after={<IconButton><Icon28FavoriteOutline /></IconButton>}
                        >
                            {group.name}
                        </SimpleCell>
                    ))}
                {load && groupsResult.length === 0 && <Footer>Ничего не найдено</Footer>}
                {fail && <Placeholder>Не удалось загрузить список групп</Placeholder>}
            </Group>
        </span>
    )
}

export default GroupList