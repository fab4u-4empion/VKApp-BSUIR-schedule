import React, {useEffect, useState} from "react";
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
	Placeholder,
	PanelHeaderBack,
	PanelHeaderContent,
	PanelHeaderContext,
	List
} from "@vkontakte/vkui";
import { Icon16Dropdown, Icon28EducationOutline, Icon28Favorite, Icon28FavoriteOutline, Icon28UsersOutline } from "@vkontakte/icons";
import GroupList from "./lists/groupsList";
import TeachersList from "./lists/teachersList";
import { useContextProvider } from "./context/context";

const App = () => {
	const { viewWidth } = useAdaptivity()
	const platform = usePlatform();

	const isDesktop = viewWidth >= ViewWidth.TABLET;
    const hasHeader = platform !== VKCOM;

	const [activeStory, setActiveStory] = useState("favorites")
	const [groupsActivePanel, setGroupsActivePanel] = useState("groups-list")
	const [groupName, setGroupName] = useState("")
	const [contextMenuOpened, setContextMenuOpened] = useState(false)
	const [snackbar, setSnackbar] = useState(null)

	const { favoriteGroups, toggleGroupsFavoriteFlag, errorSnackbar } = useContextProvider()

	useEffect(() => {
		history.pushState({
			activeStory: "favorites",
			searchValue: "",
			isSearch: false,
			groups_activePanel: "groups-list",
			groups_contextOpened: false,
			body_overflow: "visible"
		}, "")
	}, [])

	useEffect(() => {
		setSnackbar(errorSnackbar)
	}, [errorSnackbar])

	useEffect(() => {
		window.addEventListener("popstate", popstateHandler)
		return function () {
			window.removeEventListener("popstate", popstateHandler)
		}
	}, [])

	const onStoryChange = (e) => {
		setSnackbar(null)
		history.pushState({
			activeStory: e.currentTarget.dataset.story,
			searchValue: "",
			isSearch: false,
			groups_activePanel: "groups-list",
			groups_contextOpened: false,
			body_overflow: "visible"
		}, "")
		setGroupsActivePanel("groups-list")
		setActiveStory(e.currentTarget.dataset.story)
	} 

	const popstateHandler = () => {
		if (history.state) {
			setContextMenuOpened(history.state.groups_contextOpened)
			setActiveStory(history.state.activeStory)
			setGroupsActivePanel(history.state.groups_activePanel)
			document.body.style.overflow = history.state.body_overflow
		}
	}

	const groupSelecHandler = (e) => {
		history.pushState({
			activeStory: "groups",
			searchValue: "",
			isSearch: false,
			groups_activePanel: "group-schedule",
			groups_contextOpened: false,
			body_overflow: "visible"
		}, "")
		setGroupName(e)
		setGroupsActivePanel("group-schedule")
		window.scrollTo(window.scrollX, 0)
	}

	const toggleContextMenu = () => {
		if (!contextMenuOpened)  {
			let stateObj = history.state
			stateObj.groups_contextOpened = true
			stateObj.body_overflow = "hidden"
			document.body.style.overflow = "hidden"
			history.pushState(stateObj, "")
			setContextMenuOpened(true)
		} else {
			history.back()
		}	
	}	
	
	const toggleGroupsFavoriteFlagHandler = (groupName) => {
		toggleContextMenu()
		toggleGroupsFavoriteFlag(groupName)
	}

	return (
		<SplitLayout
			header={ hasHeader && <PanelHeader separator={false} /> }
			style={{ justifyContent: "center" }}
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
					<View id="favorites" activePanel="favorites-list">
						<Panel id="favorites-list">
							<PanelHeader>Избранное</PanelHeader>
							<Group style={{ height: "1000px" }}>
								<Placeholder
									icon={ <Icon28FavoriteOutline width={56} height={56} /> }
								>
									Избранное
								</Placeholder>
							</Group>
						</Panel>
					</View>
					<View id="groups" activePanel={groupsActivePanel}>
						<Panel id="groups-list">
							<PanelHeader>Группы</PanelHeader>
							<GroupList onGroupSelect={groupSelecHandler} />
							{ snackbar }
						</Panel>
						<Panel id="group-schedule">
							<PanelHeader
								left={
									<PanelHeaderBack
										onClick={ () => history.state.groups_contextOpened ? history.go(-2) : history.back() }
									/>
								}
							>
								<PanelHeaderContent
									aside={
										<Icon16Dropdown
											style={{ transform: `rotate(${contextMenuOpened ? "180deg" : "0" })` }}
										/>
									}
									onClick={ () => toggleContextMenu() }
								>
									{groupName}
								</PanelHeaderContent>
							</PanelHeader>
							<PanelHeaderContext
								opened={contextMenuOpened}
								onClose={ () => toggleContextMenu() }
							>
								<List>
									<Cell
										before={
											<>
												{favoriteGroups.includes(groupName) && <Icon28Favorite fill="var(--accent)" />}
												{!favoriteGroups.includes(groupName) && <Icon28FavoriteOutline fill="var(--accent)" />}
											</>
										}
										onClick={() => toggleGroupsFavoriteFlagHandler(groupName) }
									>
										{favoriteGroups.includes(groupName) && "Удалить из \"Избранное\""}
										{!favoriteGroups.includes(groupName) && "Добавить в \"Избранное\""}
									</Cell>
								</List>
							</PanelHeaderContext>
							<Group style={{ height: "1000px" }}>
								<Placeholder
									icon={<Icon28EducationOutline width={56} height={56} />}
								>
									Расписание группы {groupName}
								</Placeholder>
								{ snackbar }
							</Group>
						</Panel>
					</View>
					<View id="teachers" activePanel="teachers-list">
						<Panel id="teachers-list">
							<PanelHeader>Преподаватели</PanelHeader>
							<TeachersList/>
						</Panel>
					</View>
				</Epic>
        	</SplitCol>
		</SplitLayout>
	);
};

export default App


