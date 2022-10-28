import { Icon16Dropdown, Icon28Favorite, Icon28FavoriteOutline, Icon28UsersOutline } from '@vkontakte/icons'
import {Cell, FixedLayout, Group, InitialsAvatar, List, PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderContext, Placeholder, RichCell, Separator, Spinner} from '@vkontakte/vkui'
import axios from 'axios'
import { useEffect } from 'react'
import { useContextProvider } from '../../context/context'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export const GroupSchedulePanel = (props) => {
    const { toggleGroupFavoriteFlagSnackbar } = useContextProvider()

    const [schedule, setSchedule] = useLocalStorage(null, `schedule_${props.groupName}`)

    useEffect(() => {
        if (!schedule) {
            axios
                .get(`https://iis.bsuir.by/api/v1/schedule?studentGroup=${props.groupName}`)
                .then(response => setSchedule(response.data))
        }
    }, [])

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
            {!schedule && 
                <Group style={{paddingTop: 50}}>
                    <Spinner />
                </Group>
            }
            {schedule && 
                <>
                    <FixedLayout
                        vertical='top'
                        filled
                    >
                        <RichCell
                            multiline
                            disabled={true}
                            caption={`${schedule.studentGroupDto.facultyAbbrev}, ${schedule.studentGroupDto.course} курс`}
                        >
                            {schedule.studentGroupDto.specialityName}
                        </RichCell>
                        
                        <Separator wide />
                    </FixedLayout>
                    <Group style={{ paddingTop: 60, height: "1000px" }}>
                        wefowoefk
                        {toggleGroupFavoriteFlagSnackbar}
                    </Group>
                </>
            }
        </>
    )
}