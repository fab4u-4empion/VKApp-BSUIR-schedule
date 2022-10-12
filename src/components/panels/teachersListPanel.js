import { Icon28Favorite, Icon28FavoriteOutline } from "@vkontakte/icons"
import { Avatar, FixedLayout, Footer, Group, IconButton, List, PanelHeader, PanelSpinner, Placeholder, PullToRefresh, Search, SimpleCell, Spinner } from "@vkontakte/vkui"
import { useEffect } from "react"
import { useContextProvider } from "../../context/context"
import { usePagination } from "../../hooks/usePagination"
import { useSearch } from "../../hooks/useSearch"


export const TeachersListPanel = (props) => {
    const {
        teachers,
        errorLoadingTeachersList,
        favoriteTeachers,
        toggleTeachersFavoriteFlag,
        closeSnackbars,
        fetchingTeachers,
        onTeachersRefresh,
        toggleTeachreFavoriteFlagSnackbar,
        refreshTeachersErrorSnackbar
    } = useContextProvider()

    const [search, teachersSearchResult, setSearchValue] = useSearch(teachers, "fullName", history.state.searchValue)
    const [teachersRender] = usePagination(teachersSearchResult, 1, 30)

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
                activeStory: "teachers",
                searchValue: e.target.value,
                isSearch: true,
                teachers_activePanel: "teachers-list",
                teachers_contextOpened: false,
                body_overflow: "visible"
            }, "")
        } else {
            history.pushState({
                activeStory: "teachers",
                searchValue: e.target.value,
                isSearch: true,
                teachers_activePanel: "teachers-list",
                teachers_contextOpened: false,
                body_overflow: "visible"
            }, "")
        }
        setSearchValue(e.target.value)
    }

    const openTeacherScheduleHandler = (e) => {
        props.onTeacherSelect(e)
    }

    const favoriteFlagClickHandler = (e, teacheID) => {
        e.stopPropagation()
        toggleTeachersFavoriteFlag(teacheID)
        closeSnackbars()
    }

    return (
        <>
            <PanelHeader>Преподаватели</PanelHeader>

            <FixedLayout vertical="top" filled="true">
                <Search
                    readOnly={!teachers || fetchingTeachers}
                    value={search}
                    onChange={e => false ? () => { } : changeHandler(e)}
                    after="Отмена"
                />
            </FixedLayout>
            <Group style={{paddingTop: 50}}>
                {!teachers && !errorLoadingTeachersList && <Spinner />}
                {errorLoadingTeachersList &&
                    <PullToRefresh
                        onRefresh={onTeachersRefresh}
                        isFetching={fetchingTeachers}
                        style={{ minHeight: 350 }}
                    >
                        <Placeholder>Не удалось загрузить список преподавателей</Placeholder>
                    </PullToRefresh>
                }
                {teachers && !errorLoadingTeachersList &&
                    <PullToRefresh
                        onRefresh={onTeachersRefresh}
                        isFetching={fetchingTeachers}
                        style={{ minHeight: 350 }}
                    >
                        <List>
                            {teachersSearchResult.length > 0 &&
                                teachersRender.map((teacher) => (
                                    <SimpleCell
                                        onClick={() => { openTeacherScheduleHandler(teacher.id) }}
                                        key={teacher.id}
                                        expandable={true}
                                        description={teacher.rank}
                                        before={
                                            <>
                                                <IconButton onClick={e => favoriteFlagClickHandler(e, teacher.id)}>
                                                    {favoriteTeachers.includes(teacher.id) ? <Icon28Favorite fill="var(--accent)" /> : <Icon28FavoriteOutline fill="var(--accent)" />}
                                                </IconButton>
                                                <Avatar src={teacher.photoLink} />
                                            </>
                                        }
                                    >
                                        {teacher.fullName}
                                    </SimpleCell>
                                ))}
                        </List>
                        {teachersSearchResult.length === 0 && <Footer>Ничего не найдено</Footer>}
                    </PullToRefresh>
                }
                {toggleTeachreFavoriteFlagSnackbar}
                {refreshTeachersErrorSnackbar}
            </Group>
        </>
    )
}