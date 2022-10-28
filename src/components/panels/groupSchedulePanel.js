import { Icon16Dropdown, Icon28Favorite, Icon28FavoriteOutline, Icon28UsersOutline } from '@vkontakte/icons'
import {Card, CardGrid, Cell, FixedLayout, Group, Header, InitialsAvatar, List, MiniInfoCell, PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderContext, Placeholder, RichCell, Separator, Spinner} from '@vkontakte/vkui'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useContextProvider } from '../../context/context'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { CalendarTabBar } from '../controls/CalendarTabBar'

export const GroupSchedulePanel = (props) => {
    const { toggleGroupFavoriteFlagSnackbar } = useContextProvider()

    const [schedule, setSchedule] = useLocalStorage(null, `schedule_${props.groupName}`)
    const [dayInfo, setDayInfo] = useState(null)

    useEffect(() => {
        if (!schedule) {
            axios
                .get(`https://iis.bsuir.by/api/v1/schedule?studentGroup=${props.groupName}`)
                .then(response => setSchedule(response.data))
        }
    }, [])

    const date = new Date(Date.now())
    console.log(date.toLocaleString("ru-RU", {day: 'numeric', month:'long', weekday: 'long'}));

    return (
        <>
        {console.log(dayInfo)}
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
                        <CalendarTabBar
                            onSelect={setDayInfo}
                        />
                        <Separator wide />
                    </FixedLayout>
                    <Group 
                        style={{ paddingTop: 110 }}
                        header={dayInfo &&
                            <Header
                                subtitle={`${dayInfo.week}-ая учебная неделя`}
                                className="ScheduleHeader"
                            >
                                {dayInfo.date.toLocaleString("ru-RU", { day: 'numeric', month: 'long', weekday: 'long' })}
                            </Header>
                        }
                    >
                        <CardGrid size='l'>
                            <Card mode='outline'>
                                <div style={{ height: 96 }} />
                            </Card>
                            <Card mode='outline'>
                                <div style={{ height: 96 }} />
                            </Card>
                            <Card mode='outline'>
                                <div style={{ height: 96 }} />
                            </Card>
                            <Card mode='outline'>
                                <div style={{ height: 96 }} />
                            </Card>
                        </CardGrid>
                        {toggleGroupFavoriteFlagSnackbar}
                    </Group>
                </>
            }
        </>
    )
}