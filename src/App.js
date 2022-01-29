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
	Placeholder
} from "@vkontakte/vkui";
import { Icon28EducationOutline, Icon28FavoriteOutline, Icon28UsersOutline } from "@vkontakte/icons";
import GroupList from "./lists/groupsList";

const App = () => {
	const { viewWidth } = useAdaptivity()
	const platform = usePlatform();

	const isDesktop = viewWidth >= ViewWidth.TABLET;
    const hasHeader = platform !== VKCOM;

	const [activeStory, setActiveStory] = useState("favorites");

	const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);   

	return (
		<SplitLayout
			header={hasHeader && <PanelHeader separator={false} />}
			style={{ justifyContent: "center" }}
		>
			{isDesktop && (
				<SplitCol fixed width={280} maxWidth={280}>
					<Panel>
						{hasHeader && <PanelHeader />}
						<Group>
							<Cell
								disabled={activeStory === "favorites"}
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
								before={<Icon28FavoriteOutline />}
							>
								Избранное
							</Cell>
							<Cell
								disabled={activeStory === "groups"}
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
								before={<Icon28UsersOutline />}
							>
								Группы
							</Cell>
							<Cell
								disabled={activeStory === "teachers"}
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
								before={<Icon28EducationOutline />}
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
				width={isDesktop ? "560px" : "100%"}
				maxWidth={isDesktop ? "560px" : "100%"}
        	>
				<Epic
					activeStory={activeStory}
					tabbar={
					!isDesktop && (
						<Tabbar>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "favorites"}
								data-story="favorites"
								text="Избранное"
							>
								<Icon28FavoriteOutline />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "groups"}
								data-story="groups"
								text="Группы"
							>
								<Icon28UsersOutline />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "teachers"}
								data-story="teachers"
								text="Преподаватели"
							>
								<Icon28EducationOutline />
							</TabbarItem>
						</Tabbar>
					)}
				>	
					<View id="favorites" activePanel="favorites-list">
						<Panel id="favorites-list">
							<PanelHeader>Избранное</PanelHeader>
							<Group style={{ height: "1000px" }}>
								<Placeholder
									icon={<Icon28FavoriteOutline width={56} height={56} />}
								>
									Избранное
								</Placeholder>
							</Group>
						</Panel>
					</View>
					<View id="groups" activePanel="groups-list">
						<Panel id="groups-list">
							<PanelHeader>Группы</PanelHeader>
							<GroupList />
						</Panel>
					</View>
					<View id="teachers" activePanel="teachers-list">
						<Panel id="teachers-list">
							<PanelHeader>Преподаватели</PanelHeader>
							<Group style={{ height: "1000px" }}>
								<Placeholder
									icon={<Icon28EducationOutline width={56} height={56} />}
								>
									Преподаваетли
								</Placeholder>
							</Group>
						</Panel>
					</View>
				</Epic>
        	</SplitCol>
		</SplitLayout>
	);
};

export default App


