import { Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { FixedLayout, Footer, Group, IconButton, List, PanelHeader, PanelSpinner, Placeholder, Search, SimpleCell } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useContextProvider } from "../../context/context" 
import { useSearch } from "../../hooks/useSearch"

export const GroupsListPanel = () => {
    const { groups, errorLoadingGroupList } = useContextProvider()

    const [currentPage, setCurrentPage] = useState(1)
    const [endOfPage, setEndOfPage] = useState(false)
    const [groupsRender, setGroupsRender] = useState([])
    const [search, groupsSearchResult, setSearchValue] = useSearch(groups, "name", history.state.searchValue)

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        let storyState = history.state
        storyState.searchValue = search
        history.replaceState(storyState, "")
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
            setEndOfPage(true)
        }
    }

    const popstateHandler = () => {
        if (history.state) {
            setSearchValue(history.state.searchValue)
        }
    }

    const changeHandler = (e) => {
        if (history.state.isSearch) {
            history.replaceState({
                activeStory: "groups",
                searchValue: e.target.value,
                isSearch: true,
                groups_activePanel: "groups-list",
                groups_contextOpened: false,
                body_overflow: "visible"
            }, "")
        } else {
            history.pushState({
                activeStory: "groups",
                searchValue: e.target.value,
                isSearch: true,
                groups_activePanel: "groups-list",
                groups_contextOpened: false,
                body_overflow: "visible"
            }, "")
        }
        setSearchValue(e.target.value)
    }

    return (
        <>
            <PanelHeader>Группы</PanelHeader>

            <FixedLayout vertical="top" filled="true">
                <Search
                    readOnly={!groups}
                    value={search}
                    onChange={e => false ? () => { } : changeHandler(e)}
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 40 }}>
                {!groups && !errorLoadingGroupList && <PanelSpinner />}
                {errorLoadingGroupList &&
                    <Placeholder>Не удалось загрузить список групп</Placeholder>
                }
                {groups && !errorLoadingGroupList &&
                    <>
                        <List>
                            {groupsSearchResult.length > 0 &&
                                groupsRender.map((group) => (
                                    <SimpleCell
                                        //onClick={() => { openGroupScheduleHandler(group.name) }}
                                        key={group.id}
                                        expandable={true}
                                        before={
                                            <IconButton /*onClick={e => favoriteFlagClickHandler(e, group.name)}*/>
                                                {false && <Icon28Favorite fill="var(--accent)" />}
                                                {true && <Icon28FavoriteOutline fill="var(--accent)" />}
                                            </IconButton>
                                        }
                                    >
                                        {group.name}
                                    </SimpleCell>
                                ))}
                        </List>
                        {groupsSearchResult.length === 0 && <Footer>Ничего не найдено</Footer>}
                    </>
                }
            </Group>
        </>
    )
}