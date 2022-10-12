import { Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { FixedLayout, Footer, Group, IconButton, List, PanelHeader, PanelSpinner, Placeholder, PullToRefresh, Search, SimpleCell, Spinner } from "@vkontakte/vkui"
import { useEffect } from "react"
import { useContextProvider } from "../../context/context" 
import { usePagination } from "../../hooks/usePagination"
import { useSearch } from "../../hooks/useSearch"

export const GroupsListPanel = (props) => {
    const { 
        groups, 
        errorLoadingGroupList, 
        favoriteGroups, 
        toggleGroupsFavoriteFlag,  
        closeSnackbars,
        fetchingGroups,
        onGroupRefresh,
        toggleGroupFavoriteFlagSnackbar,
        refreshGroupsErrorSnackbar
    } = useContextProvider()

    const [search, groupsSearchResult, setSearchValue] = useSearch(groups, "name", history.state.searchValue)
    const [groupsRender] = usePagination(groupsSearchResult, 1, 30)

    useEffect(() => {
        window.scrollTo(window.scrollX, 0)
        let storyState = history.state
        storyState.searchValue = search
        history.replaceState(storyState, "")
    }, [search])

    useEffect(() => {
        window.addEventListener("popstate", popstateHandler)
        return function () {
            window.removeEventListener("popstate", popstateHandler)
        }
    }, [])

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

    const openGroupScheduleHandler = (e) => {
        props.onGroupSelect(e)
    }

    const favoriteFlagClickHandler = (e, groupName) => {
        e.stopPropagation()
        toggleGroupsFavoriteFlag(groupName)
        closeSnackbars()
    }

    return (
        <>
            <PanelHeader>Группы</PanelHeader>

            <FixedLayout vertical="top" filled="true">
                <Search
                    readOnly={!groups || fetchingGroups}
                    value={search}
                    onChange={e => false ? () => { } : changeHandler(e)}
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{ paddingTop: 50 }}>
                {!groups && !errorLoadingGroupList && <Spinner />}
                {errorLoadingGroupList &&
                    <PullToRefresh
                        onRefresh={onGroupRefresh}
                        isFetching={fetchingGroups}
                        style={{ minHeight: 350 }}
                    >
                        <Placeholder>Не удалось загрузить список групп</Placeholder>
                    </PullToRefresh>
                }
                {groups && !errorLoadingGroupList &&
                    <PullToRefresh
                        onRefresh={onGroupRefresh}
                        isFetching={fetchingGroups}
                        style={{ minHeight: 350 }}
                    >
                        <List>
                            {groupsSearchResult.length > 0 &&
                                groupsRender.map((group) => (
                                    <SimpleCell
                                        onClick={() => { openGroupScheduleHandler(group.name) }}
                                        key={group.id}
                                        expandable={true}
                                        before={
                                            <IconButton onClick={e => favoriteFlagClickHandler(e, group.name)}>
                                                {favoriteGroups.includes(group.name) ? <Icon28Favorite fill="var(--accent)" /> : <Icon28FavoriteOutline fill="var(--accent)" />}
                                            </IconButton>
                                        }
                                    >
                                        {group.name}
                                    </SimpleCell>
                                ))}
                        </List>
                        {groupsSearchResult.length === 0 && <Footer>Ничего не найдено</Footer>}
                    </PullToRefresh>
                }
                { toggleGroupFavoriteFlagSnackbar }
                { refreshGroupsErrorSnackbar }
            </Group>
        </>
    )
}