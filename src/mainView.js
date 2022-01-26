import React from "react";
import {
	View,
	Panel,
	PanelHeader,
	Header,
	Group,
	SimpleCell, 
} from "@vkontakte/vkui";

const MainView = () => {
	const [activePanel, setActivePanel] = React.useState("main")

	return (
		<View activePanel={activePanel}>
			<Panel id="main">
				<PanelHeader>Расписание БГУИР</PanelHeader>
				<Group header={<Header mode="secondary">Items</Header>}>
					<SimpleCell>Hello</SimpleCell>
					<SimpleCell>World</SimpleCell>
				</Group>
			</Panel>
		</View>
	);
};

export default MainView


