import { Icon16Dropdown, Icon28Favorite, Icon28FavoriteOutline, Icon28UsersOutline } from '@vkontakte/icons'
import {Cell, Group, List, PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderContext, Placeholder} from '@vkontakte/vkui'
import { useContextProvider } from '../../context/context'

export const GroupSchedulePanel = (props) => {
    const { toggleGroupFavoriteFlagSnackbar } = useContextProvider()

    return (
        <>
            <PanelHeader
                before={
                    <PanelHeaderBack
                        onClick={() => props.groupContextMenuOpened ? history.go(-2) : history.back()}
                    />
                }
            >
                <PanelHeaderContent
                    aside={
                        <Icon16Dropdown
                            style={{ transform: `rotate(${props.groupContextMenuOpened ? "180deg" : "0"})` }}
                        />
                    }
                    onClick={() => props.onToggleGroupContextMenu()}
                >
                    {props.groupName}
                </PanelHeaderContent>
            </PanelHeader>
            <PanelHeaderContext
                opened={props.groupContextMenuOpened}
                onClose={() => props.onToggleGroupContextMenu()}
            >
                <List>
                    <Cell
                        before={
                            <>
                                {props.favoriteGroups.includes(props.groupName) && <Icon28Favorite fill="var(--accent)" />}
                                {!props.favoriteGroups.includes(props.groupName) && <Icon28FavoriteOutline fill="var(--accent)" />}
                            </>
                        }
                        onClick={() => props.onToggleGroupsFavorireFlag(props.groupName)}
                    >
                        {props.favoriteGroups.includes(props.groupName) && "Удалить из \"Избранное\""}
                        {!props.favoriteGroups.includes(props.groupName) && "Добавить в \"Избранное\""}
                    </Cell>
                </List>
            </PanelHeaderContext>
            <Group style={{ height: "1000px" }}>
                <Placeholder
                    icon={<Icon28UsersOutline width={56} height={56} />}
                >
                    Расписание группы {props.groupName}
                </Placeholder>
                { toggleGroupFavoriteFlagSnackbar }
            </Group>
        </>
    )
}