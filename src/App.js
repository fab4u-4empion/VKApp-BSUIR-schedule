import {useEffect, useMemo, useState} from "react";
import {
	View,
	Panel,
	PanelHeader,
	Group,
	useAdaptivity,
	SplitCol,
	SplitLayout,
	ViewWidth, 
	usePlatform,
	VKCOM, 
	Cell,
	Tabbar,
	TabbarItem,
	Epic,
	ModalRoot,
	ModalCard,
	Button,
	IOS,
	ANDROID,
	ConfigProvider
} from "@vkontakte/vkui";
import { Icon28EducationOutline, Icon28FavoriteOutline, Icon28UsersOutline } from "@vkontakte/icons";
import { useContextProvider } from "./context/context";
import { GroupSchedulePanel } from "./components/panels/groupSchedulePanel";
import { TeacherSchedulePanel } from "./components/panels/teacherSchedulePanel";
import { GroupsListPanel } from "./components/panels/groupsListPanel";
import { TeachersListPanel } from "./components/panels/teachersListPanel";
import { FavoritesListPanel } from "./components/panels/favoritesListPanel";

const App = () => {
	const { viewWidth } = useAdaptivity()
	const platform = usePlatform();

	const isDesktop = viewWidth >= ViewWidth.TABLET;
    const hasHeader = platform !== VKCOM;

	const [activeStory, setActiveStory] = useState("favorites")
	const [groupsActivePanel, setGroupsActivePanel] = useState("groups-list")
	const [teachersActivePanel, setTeachersActivePanel] = useState("teachers-list")
	const [favoritesActivePanel, setFavoritesActivePanel] = useState("favorites-list")
	const [groupName, setGroupName] = useState("")
	const [teacher, setTeacher] = useState({})
	const [groupContextMenuOpened, setGroupContextMenuOpened] = useState(false)
	const [teacherContextMenuOpened, setTeacherContextMenuOpened] = useState(false)
	const [activeModal, setActiveModal] = useState(null)
	const [modalContent, setModalContent] = useState(null)
	const [popout, setPopout] = useState(null)

	const { favoriteGroups, toggleGroupsFavoriteFlag, favoriteTeachers, toggleTeachersFavoriteFlag, closeSnackbars } = useContextProvider()
	
	useEffect(() => {
		window.addEventListener("popstate", popstateHandler)
		return function () {
			window.removeEventListener("popstate", popstateHandler)
		}
	}, [])

	const modals = useMemo(() => {
		return (
			<ConfigProvider platform="ios">
				<ModalRoot activeModal={activeModal} onClose={() => setActiveModal(null)}>
					<ModalCard
						id="lessonInfo"

						onClose={() => setActiveModal(null)}
						header={modalContent?.header}
						subheader={modalContent?.subHeader}
					>
						{modalContent?.inner}
					</ModalCard>
				</ModalRoot>
			</ConfigProvider>
		)
	}, [modalContent, activeModal])

	const onStoryChange = (e) => {
		closeSnackbars()
		history.pushState({
			activeStory: e.currentTarget.dataset.story,
			searchValue: "",
			isSearch: false,
			groups_activePanel: "groups-list",
			teachers_activePanel: "teachers-list",
			favorites_activePanel: "favorites-list",
			groups_contextOpened: false,
			body_overflow: "visible"
		}, "")
		setGroupsActivePanel("groups-list")
		setTeachersActivePanel("teachers-list")
		setFavoritesActivePanel("favorites-list")
		setActiveStory(e.currentTarget.dataset.story)
	} 

	const popstateHandler = () => {
		closeSnackbars()
		if (history.state) {
			setGroupContextMenuOpened(history.state.groups_contextOpened)
			setTeacherContextMenuOpened(history.state.teachers_contextOpened)
			setActiveStory(history.state.activeStory)
			setGroupsActivePanel(history.state.groups_activePanel)
			setTeachersActivePanel(history.state.teachers_activePanel)
			setFavoritesActivePanel(history.state.favorites_activePanel)
			document.body.style.overflow = history.state.body_overflow
		}
	}

	const groupSelectHandler = (e) => {
		closeSnackbars()
		if (activeStory === "groups") {
			history.pushState({
				activeStory: "groups",
				searchValue: "",
				isSearch: false,
				groups_activePanel: "group-schedule",
				groups_contextOpened: false,
				body_overflow: "visible"
			}, "")
			setGroupsActivePanel("group-schedule")
		} else {
			history.pushState({
				activeStory: "favorites",
				searchValue: "",
				isSearch: false,
				favorites_activePanel: "group-schedule",
				groups_contextOpened: false,
				body_overflow: "visible"
			}, "")
			setFavoritesActivePanel("group-schedule")
		}
		setGroupName(e)
		window.scrollTo(window.scrollX, 0)
	}

	const teacherSelectHandler = (id) => {
		closeSnackbars()
		if (activeStory === "teachers") {
			history.pushState({
				activeStory: "teachers",
				searchValue: "",
				isSearch: false,
				teachers_activePanel: "teacher-schedule",
				teachers_contextOpened: false,
				body_overflow: "visible"
			}, "")
			setTeachersActivePanel("teacher-schedule")
		} else {
			history.pushState({
				activeStory: "favorites",
				searchValue: "",
				isSearch: false,
				favorites_activePanel: "teacher-schedule",
				teachers_contextOpened: false,
				body_overflow: "visible"
			}, "")
			setFavoritesActivePanel("teacher-schedule")
		}
		const teacherTmp = localStorage.getItem("teachers") ? JSON.parse(localStorage.getItem("teachers")) : []
		setTeacher(teacherTmp.find(teacher => teacher.id === id))
		window.scrollTo(window.scrollX, 0)
	}


	const toggleGroupContextMenu = () => {
		if (!groupContextMenuOpened)  {
			let stateObj = history.state
			stateObj.groups_contextOpened = true
			stateObj.body_overflow = "hidden"
			document.body.style.overflow = "hidden"
			history.pushState(stateObj, "")
			setGroupContextMenuOpened(true)
		} else {
			history.back()
		}	
	}	

	const toggleTeacherContextMenu = () => {
		if (!teacherContextMenuOpened)  {
			let stateObj = history.state
			stateObj.teachers_contextOpened = true
			stateObj.body_overflow = "hidden"
			document.body.style.overflow = "hidden"
			history.pushState(stateObj, "")
			setTeacherContextMenuOpened(true)
		} else {
			history.back()
		}
	}
	
	const toggleGroupsFavoriteFlagHandler = (groupName) => {
		toggleGroupContextMenu()
		toggleGroupsFavoriteFlag(groupName)
	}

	const toggleTeachersFavoriteFlagHandler = (id) => {
		toggleTeacherContextMenu()
		toggleTeachersFavoriteFlag(id)
	}

	const openModal = (content) => {
		setModalContent(content)
		setActiveModal("lessonInfo")
	}

	return (
		<SplitLayout
			header={ hasHeader && <PanelHeader separator={false} /> }
			style={{ justifyContent: "center" }}
			modal={modals}
			popout={popout}
		>
			{ isDesktop && (
				<SplitCol fixed width={280} maxWidth={280}>
					<Panel>
						{ hasHeader && <PanelHeader /> }
						<Group>
							<Cell
								disabled={ activeStory === "favorites" }
								style={
									activeStory === "favorites"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="favorites"
								onClick={onStoryChange}
								before={ <Icon28FavoriteOutline /> }
							>
								Избранное
							</Cell>
							<Cell
								disabled={ activeStory === "groups" }
								style={
									activeStory === "groups"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="groups"
								onClick={onStoryChange}
								before={ <Icon28UsersOutline /> }
							>
								Группы
							</Cell>
							<Cell
								disabled={ activeStory === "teachers" }
								style={
									activeStory === "teachers"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="teachers"
								onClick={onStoryChange}
								before={ <Icon28EducationOutline /> }
							>
								Преподаватели
							</Cell>
						</Group>
					</Panel>
				</SplitCol>
			)}
			<SplitCol
				animate={!isDesktop}
				spaced={isDesktop}
				width={ isDesktop ? "560px" : "100%" }
				maxWidth={ isDesktop ? "560px" : "100%" }
        	>
				<Epic
					activeStory={activeStory}
					tabbar={
						!isDesktop && (
							<Tabbar>
								<TabbarItem
									onClick={onStoryChange}
									selected={ activeStory === "favorites" }
									data-story="favorites"
									text="Избранное"
								>
									<Icon28FavoriteOutline />
								</TabbarItem>
								<TabbarItem
									onClick={onStoryChange}
									selected={ activeStory === "groups" }
									data-story="groups"
									text="Группы"
								>
									<Icon28UsersOutline />
								</TabbarItem>
								<TabbarItem
									onClick={onStoryChange}
									selected={ activeStory === "teachers" }
									data-story="teachers"
									text="Преподаватели"
								>
									<Icon28EducationOutline />
								</TabbarItem>
							</Tabbar>
						)
					}
				>	
					<View id="favorites" activePanel={favoritesActivePanel}>
						<Panel id="favorites-list">
							<FavoritesListPanel
								onGroupSelect={groupSelectHandler}
								onTeacherSelect={teacherSelectHandler}
							/>
						</Panel>
						<Panel id="group-schedule">
							<GroupSchedulePanel
								groupContextMenuOpened={groupContextMenuOpened}
								onToggleGroupContextMenu={toggleGroupContextMenu}
								onToggleGroupsFavorireFlag={toggleGroupsFavoriteFlagHandler}
								favoriteGroups={favoriteGroups}
								groupName={groupName}
								onOpenModal={openModal}
								onOpenPopout={setPopout}
							/>
						</Panel>
						<Panel id="teacher-schedule">
							<TeacherSchedulePanel
								teacherContextMenuOpened={teacherContextMenuOpened}
								onToggleTeacherContextMenu={toggleTeacherContextMenu}
								onToggleTeachersFavoriteFlagHandler={toggleTeachersFavoriteFlagHandler}
								favoriteTeachers={favoriteTeachers}
								teacher={teacher}
								onOpenModal={openModal}
							/>
						</Panel>
					</View>
					<View id="groups" activePanel={groupsActivePanel}>
						<Panel id="groups-list">
							<GroupsListPanel
								onGroupSelect={groupSelectHandler}
							/>
						</Panel>
						<Panel id="group-schedule">
							<GroupSchedulePanel
								groupContextMenuOpened={groupContextMenuOpened}
								onToggleGroupContextMenu={toggleGroupContextMenu}
								onToggleGroupsFavorireFlag={toggleGroupsFavoriteFlagHandler}
								favoriteGroups={favoriteGroups}
								groupName={groupName}
								onOpenModal={openModal}
								onOpenPopout={setPopout}
							/>
						</Panel>
					</View>
					<View id="teachers" activePanel={teachersActivePanel}>
						<Panel id="teachers-list">
							<TeachersListPanel
								onTeacherSelect={teacherSelectHandler}
							/>
						</Panel>
						<Panel id="teacher-schedule">
							<TeacherSchedulePanel
								teacherContextMenuOpened={teacherContextMenuOpened}
								onToggleTeacherContextMenu={toggleTeacherContextMenu}
								onToggleTeachersFavoriteFlagHandler={toggleTeachersFavoriteFlagHandler}
								favoriteTeachers={favoriteTeachers}
								teacher={teacher}
								onOpenModal={openModal}
							/>
						</Panel>
					</View>
				</Epic>
        	</SplitCol>
		</SplitLayout>
	);
};

export default App


