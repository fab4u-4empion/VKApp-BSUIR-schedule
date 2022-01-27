import React, {useState} from "react";
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
	Badge,
	Placeholder
} from "@vkontakte/vkui";
import { Icon28ClipOutline, Icon28MessageOutline, Icon28NewsfeedOutline, Icon28ServicesOutline, Icon28UserCircleOutline, Icon56NewsfeedOutline } from "@vkontakte/icons";

const App = () => {
	const { viewWidth } = useAdaptivity()
	const platform = usePlatform();

	const isDesktop = viewWidth >= ViewWidth.TABLET;
    const hasHeader = platform !== VKCOM;

	const [activeStory, setActiveStory] = useState("profile");

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
								disabled={activeStory === "feed"}
								style={
									activeStory === "feed"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="feed"
								onClick={onStoryChange}
								before={<Icon28NewsfeedOutline />}
							>
								Новости
							</Cell>
							<Cell
								disabled={activeStory === "services"}
								style={
									activeStory === "services"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="services"
								onClick={onStoryChange}
								before={<Icon28ServicesOutline />}
							>
								Сервисы
							</Cell>
							<Cell
								disabled={activeStory === "messages"}
								style={
									activeStory === "messages"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="messages"
								onClick={onStoryChange}
								before={<Icon28MessageOutline />}
							>
								Сообщения
							</Cell>
							<Cell
								disabled={activeStory === "clips"}
								style={
									activeStory === "clips"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="clips"
								onClick={onStoryChange}
								before={<Icon28ClipOutline />}
							>
								Клипы
							</Cell>
							<Cell
								disabled={activeStory === "profile"}
								style={
									activeStory === "profile"
									? {
										backgroundColor: "var(--button_secondary_background)",
										borderRadius: 8,
										}
									: {}
								}
								data-story="profile"
								onClick={onStoryChange}
								before={<Icon28UserCircleOutline />}
							>
								Профиль
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
								selected={activeStory === "feed"}
								data-story="feed"
								text="Новости"
							>
								<Icon28NewsfeedOutline />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "services"}
								data-story="services"
								text="Сервисы"
							>
								<Icon28ServicesOutline />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "messages"}
								data-story="messages"
								label="12"
								text="Сообщения"
							>
								<Icon28MessageOutline />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "clips"}
								data-story="clips"
								text="Клипы"
							>
								<Icon28ClipOutline />
							</TabbarItem>
							<TabbarItem
								onClick={onStoryChange}
								selected={activeStory === "profile"}
								data-story="profile"
								indicator={<Badge mode="prominent" />}
								text="Профиль"
							>
								<Icon28UserCircleOutline />
							</TabbarItem>
						</Tabbar>
					)}
				>	
					<View id="feed" activePanel="feed">
						<Panel id="feed">
							<PanelHeader>Новости</PanelHeader>
							<Group style={{ height: "1000px" }}>
							<Placeholder
								icon={<Icon56NewsfeedOutline width={56} height={56} />}
							/>
							</Group>
						</Panel>
					</View>
					<View id="services" activePanel="services">
						<Panel id="services">
							<PanelHeader>Сервисы</PanelHeader>
							<Group style={{ height: "1000px" }}>
							<Placeholder
								icon={<Icon28ServicesOutline width={56} height={56} />}
							></Placeholder>
							</Group>
						</Panel>
					</View>
					<View id="messages" activePanel="messages">
						<Panel id="messages">
							<PanelHeader>Сообщения</PanelHeader>
							<Group style={{ height: "1000px" }}>
							<Placeholder
								icon={<Icon28MessageOutline width={56} height={56} />}
							></Placeholder>
							</Group>
						</Panel>
					</View>
					<View id="clips" activePanel="clips">
						<Panel id="clips">
							<PanelHeader>Клипы</PanelHeader>
							<Group style={{ height: "1000px" }}>
							<Placeholder
								icon={<Icon28ClipOutline width={56} height={56} />}
							></Placeholder>
							</Group>
						</Panel>
					</View>
					<View id="profile" activePanel="profile">
						<Panel id="profile">
							<PanelHeader>Профиль</PanelHeader>
							<Group style={{ height: "1000px" }}>
							<Placeholder
								icon={<Icon28UserCircleOutline width={56} height={56} />}
							></Placeholder>
							</Group>
						</Panel>
					</View>
				</Epic>
        	</SplitCol>
		</SplitLayout>
		
	);
};

export default App


