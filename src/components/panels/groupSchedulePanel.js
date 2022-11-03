import { Icon12Circle, Icon16Dropdown, Icon24InfoCircleOutline, Icon28CalendarOutline, Icon28ClockOutline, Icon28Favorite, Icon28FavoriteOutline, Icon28HomeOutline, Icon28UsersOutline } from '@vkontakte/icons'
import {Avatar, Card, CardGrid, Cell, Div, FixedLayout, Group, Header, Headline, IconButton, InitialsAvatar, List, MiniInfoCell, PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderContext, Placeholder, PullToRefresh, RichCell, Separator, SimpleCell, Spinner, Text, Title} from '@vkontakte/vkui'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useContextProvider } from '../../context/context'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ErrorSnackbar } from '../alerts/errorSnackbar'
import { CalendarTabBar } from '../controls/CalendarTabBar'
import { OutlineText } from '../typography/outlineText'

const lessonTypes = {
    "ЛК": "green",
    "ПЗ": "yellow",
    "ЛР": "red",
}

const lessonNumber = {
    "09:00": 1,
    "10:35": 2,
    "12:25": 3,
    "14:00": 4,
    "15:50": 5,
    "17:25": 6,
    "19:00": 7,
    "20:40": 8,
}

export const GroupSchedulePanel = (props) => {
    const { toggleGroupFavoriteFlagSnackbar } = useContextProvider()

    const [schedule, setSchedule] = useLocalStorage(null, `schedule_${props.groupName}`)
    const [dayInfo, setDayInfo] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [loadingError, setLoadingError] = useState(false)
    const [snackbar, setSnackbar] = useState(null)

    const [fixedLayoutRef, setFixedLayoutRef] = useState(null)

    const currentSchedule = useMemo(() => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота',]
        const daySchedule = schedule?.schedules[days[dayInfo?.date.getDay()]]
        return daySchedule?.filter(e => e.weekNumber.includes(dayInfo.week))
    }, [dayInfo])

    useEffect(() => {
        if (!schedule) {
            axios
                .get(`https://iis.bsuir.by/api/v1/schedule?studentGroup=${props.groupName}`)
                .then(response => {
                    setSchedule(response.data)
                    setFetching(false)
                })
                .catch(e => {
                    setLoadingError(true)
                })
        }
    }, [])

    const refreshHandler = () => {
        setFetching(true)
        axios
            .get(`https://iis.bsuir.by/api/v1/schedule?studentGroup=${props.groupName}`)
            .then(response => {
                setSchedule(response.data)
                setFetching(false)
                setLoadingError(false)
            })
            .catch(e => {
                setFetching(false)
                setSnackbar(<ErrorSnackbar message="Не удалось обновить расписание" setSnackbar={setSnackbar}/>)
            })
    }

    const openModal = (lesson) => {
        const content = {
            header: lesson.subjectFullName,
            inner: 
                <>
                    <div className="LessonModalInner">
                        <Avatar
                            size={90} 
                            src={lesson?.employees[0]?.photoLink}
                            className={`${lessonTypes[lesson.lessonTypeAbbrev]}`}
                            shadow={false}
                        />
                        {lesson.employees[0] && <Text style={{ color: "var(--text_secondary)", textAlign: "center" }}>{`${lesson.employees[0].lastName} ${lesson.employees[0]?.firstName} ${lesson.employees[0]?.middleName}`}</Text>}
                    </div>
                    {lesson.auditories[0] && <SimpleCell before={<Icon28HomeOutline/>} disabled indicator={lesson.auditories[0]}>Аудитория</SimpleCell>}
                    <SimpleCell before={<Icon28ClockOutline />} disabled indicator={`${lesson.startLessonTime} - ${lesson.endLessonTime}`}>Время</SimpleCell>
                    {lesson.numSubgroup > 0 && <SimpleCell before={<Icon28UsersOutline />} disabled indicator={lesson.numSubgroup}>Подгруппа</SimpleCell>}
                    <SimpleCell before={<Icon28CalendarOutline />} disabled indicator={lesson.weekNumber.join(", ")}>Недели</SimpleCell>
                </>
        }
        console.log(props.onOpenModal);
        props.onOpenModal(content)
    }

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
                    onClick={() => {
                        setSnackbar(null)
                        props.onToggleGroupContextMenu()
                    }}
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
            {!schedule && !loadingError &&
                <Group style={{paddingTop: 50}}>
                    <Spinner />
                </Group>
            }
            {loadingError &&
                <Group style={{ paddingTop: 50 }}>
                    <PullToRefresh
                        onRefresh={refreshHandler}
                        isFetching={fetching}
                    >
                        <Placeholder>Не удалось загрузить расписание</Placeholder>
                    </PullToRefresh>
                </Group>
            }
            {schedule && 
                <>
                    <FixedLayout
                        vertical='top'
                        filled
                        getRef={setFixedLayoutRef}
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
                        style={{ paddingTop: fixedLayoutRef?.offsetHeight - 15 }}
                        header={dayInfo &&
                            <Header
                                subtitle={`${dayInfo.week}-ая учебная неделя`}
                                className="ScheduleHeader"
                            >
                                {dayInfo.date.toLocaleString("ru-RU", { day: 'numeric', month: 'long', weekday: 'long' })}
                            </Header>
                        }
                    >
                        <PullToRefresh
                            isFetching={fetching}
                            onRefresh={refreshHandler}
                        >
                            {currentSchedule &&
                                <CardGrid size='l'>
                                    {currentSchedule.map((e, index) =>
                                        <Card key={index} mode='outline'>
                                            <div className='ScheduleCardInner'>
                                                <IconButton onClick={() => openModal(e)} className='ScheduleCardInfoButton'>
                                                    <Icon24InfoCircleOutline />
                                                </IconButton>
                                                <div className='ScheduleCardInner__Time'>
                                                    <Headline
                                                        style={{ fontSize: ".95em" }}
                                                        level="1"
                                                        weight="1"
                                                    >{e.startLessonTime}</Headline>
                                                    <Headline
                                                        weight="2"
                                                        style={{ color: "var(--text_secondary)", fontSize: ".85em" }}
                                                    >{lessonNumber[e.startLessonTime]}</Headline>
                                                    <Headline
                                                        style={{ fontSize: ".9em" }}
                                                        level="2"
                                                    >{e.endLessonTime}</Headline>
                                                </div>
                                                <div className={`ScheduleCardInner__Separator ${lessonTypes[e.lessonTypeAbbrev]}`}></div>
                                                <div className='ScheduleCardInner__Content'>
                                                    <Title level='3'>{e.subject}</Title>
                                                    <div className='LessonInfo'>
                                                        <OutlineText>{e.lessonTypeAbbrev}</OutlineText>
                                                        {e.auditories[0] && <OutlineText>{e.auditories[0]}</OutlineText>}
                                                        {e.numSubgroup != 0 && <OutlineText>{e.numSubgroup}</OutlineText>}
                                                    </div>
                                                    {e.employees[0] && <Text style={{ color: "var(--text_secondary)", fontSize: ".9em" }}>{`${e.employees[0].lastName} ${e.employees[0]?.firstName} ${e.employees[0]?.middleName}`}</Text>}
                                                    {e.note && <Text style={{ color: "var(--vkui--color_background_negative)", fontSize: ".9em" }}>{e.note}</Text>}
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </CardGrid>
                            }
                            {(!currentSchedule || !currentSchedule.length) &&
                                <Placeholder>
                                    В этот день нет занятий
                                </Placeholder>
                            }
                        </PullToRefresh>
                        {toggleGroupFavoriteFlagSnackbar}
                    </Group>
                </>
            }
            {snackbar}
        </>
    )
}