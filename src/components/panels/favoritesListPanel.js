import { Icon24Replay, Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Avatar, Button, FixedLayout, Group, Header, IconButton, List, PanelHeader, Placeholder, Search, SimpleCell, Spinner } from "@vkontakte/vkui"
import { useEffect } from "react"
import { useContextProvider } from "../../context/context"
import { useLocalStorage } from "../../hooks/useLocalStorage";

export const FavoritesListPanel = (props) => {

    const { 
        favoriteGroups, 
        favoriteTeachers, 
        groups,
        teachers,
        toggleGroupsFavoriteFlag,
        closeSnackbars,
        toggleGroupFavoriteFlagSnackbar,
        toggleTeachreFavoriteFlagSnackbar,
        toggleTeachersFavoriteFlag,
        errorLoadingGroupList,
        errorLoadingTeachersList
    } = useContextProvider()

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

    const groupFavoriteFlagClickHandler = (e, groupName) => {
        e.stopPropagation()
        toggleGroupsFavoriteFlag(groupName)
        closeSnackbars()
    }

    const teacherFavoriteFlagClickHandler = (e, teacheID) => {
        e.stopPropagation()
        toggleTeachersFavoriteFlag(teacheID)
        closeSnackbars()
    }

    return (
        <>
            <PanelHeader>Избранное</PanelHeader>
            {(!groups || !teachers) && (!errorLoadingGroupList || !errorLoadingTeachersList) &&
                <Group style={{ paddingTop: 50 }}>
                    <Spinner />
                </Group>
            }
            {(errorLoadingGroupList || errorLoadingTeachersList) &&
                <Group style={{ paddingTop: 50}}>
                    <Placeholder
                        action={
                            <Button><Icon24Replay/></Button>
                        }
                    >Не удалось загрузить список групп или список преподавателей</Placeholder>
                </Group>
            }
            {favoriteGroups && groups && teachers && 
                <Group header={<Header>Группы</Header>}>
                    <List>
                        {favoriteGroups.map(e => 
                            <SimpleCell
                                key={e}
                                expandable={true}
                                onClick={() => props.onGroupSelect(e)}
                                before={
                                    <IconButton onClick={event => groupFavoriteFlagClickHandler(event, e)}>
                                        <Icon28Favorite fill="var(--accent)" />
                                    </IconButton>
                                }
                            >
                                {e}
                            </SimpleCell>  
                        )}
                    </List>
                    { toggleGroupFavoriteFlagSnackbar }
                </Group>
            }
            {favoriteTeachers && teachers && groups &&
                <Group header={<Header>Преподаватели</Header>}>
                    <List>
                        {favoriteTeachers.map(t => {
                            const teacher = teachers.find(e => e.id == t)
                            return (
                                <SimpleCell
                                    key={t}
                                    onClick={() => props.onTeacherSelect(teacher.id)}
                                    expandable={true}
                                    description={teacher.rank}
                                    before={
                                        <>
                                            <IconButton onClick={e => teacherFavoriteFlagClickHandler(e, teacher.id)}>
                                                <Icon28Favorite fill="var(--accent)" />
                                            </IconButton>
                                            <Avatar src={teacher.photoLink} />
                                        </>
                                    }
                                >
                                    {teacher.fullName}
                                </SimpleCell>
                            )
                        }
                        )}  
                    </List>
                    { toggleTeachreFavoriteFlagSnackbar }
                </Group>
            }
        </>
    )
}