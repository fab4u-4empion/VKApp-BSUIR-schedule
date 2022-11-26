import { Icon12Circle, Icon16Dropdown, Icon24CalendarOutline, Icon24InfoCircleOutline, Icon28CalendarOutline, Icon28ClockOutline, Icon28EducationOutline, Icon28Favorite, Icon28FavoriteOutline, Icon28HomeOutline, Icon28UsersOutline } from '@vkontakte/icons'
import {ActionSheet, ActionSheetDefaultIosCloseItem, ActionSheetItem, Avatar, Button, ButtonGroup, Card, CardGrid, Cell, Div, FixedLayout, Group, Header, Headline, IconButton, InitialsAvatar, Link, List, MiniInfoCell, PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelHeaderContent, PanelHeaderContext, Placeholder, PullToRefresh, RichCell, Separator, SimpleCell, Spinner, Text, Title} from '@vkontakte/vkui'
import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useContextProvider } from '../../context/context'
import { useFirstUpperCase } from '../../hooks/useFirstUpperCase'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ErrorSnackbar } from '../alerts/errorSnackbar'
import { CalendarTabBar } from '../controls/CalendarTabBar'
import { WeekDayTabBar } from '../controls/WeekDayTabBar'
import { OutlineText } from '../typography/outlineText'

const lessonTypes = {
    "ЛК": "green",
    "ПЗ": "yellow",
    "ЛР": "red",
    "Экзамен": "red",
    "Консультация": "green",
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

const subGroupText = ["Вся группа", "1 подгруппа", "2 подгруппа",]

export const GroupSchedulePanel = (props) => {
    const { toggleGroupFavoriteFlagSnackbar } = useContextProvider()

    const [schedule, setSchedule] = useLocalStorage(null, `schedule_${props.groupName}`)
    const [dayInfo, setDayInfo] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [loadingError, setLoadingError] = useState(false)
    const [snackbar, setSnackbar] = useState(null)
    const [subGroup, setSubgroup] = useState(0)
    const [fullSchedule, setFullSchedule] = useState(false)
    const [examsSchedule, setExamsSchedule] = useState(false)
    const [endDate, setEndDate] = useState(null)

    const [fixedLayoutRef, setFixedLayoutRef] = useState(null)

    const selectSubGroupButtonRef = useRef()

    const currentSchedule = useMemo(() => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',]
        if (examsSchedule)
            return schedule?.exams
        const daySchedule = !fullSchedule ? schedule?.schedules[days[dayInfo?.date.getDay()]] : schedule?.schedules[days[dayInfo + 1]]
        if (fullSchedule)
            return daySchedule
        if (Date.parse(schedule?.endDate.split(".").reverse().join("/")) - dayInfo?.date > -86400000)
            return daySchedule?.filter(e => e.weekNumber.includes(dayInfo.week)).filter(e => {
                return subGroup ? e.numSubgroup == 0 || e.numSubgroup == subGroup : true
            })
        return []
    }, [dayInfo, subGroup])

    const actionSheet = useMemo(() => {
        return (
            <ActionSheet 
                onClose={() => props.onOpenPopout(null)}
                iosCloseItem={<ActionSheetDefaultIosCloseItem />}
                toggleRef={selectSubGroupButtonRef}
            >
                {subGroupText.map((text, index) => 
                    <ActionSheetItem
                        onChange={() => setSubgroup(index)}
                        checked={subGroup === index}
                        autoclose
                        selectable
                    >
                        {text}
                    </ActionSheetItem>
                )}
            </ActionSheet>
        )
    }, [subGroup])

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

    useEffect(() => {
        if (examsSchedule) setDayInfo(null)
    }, [examsSchedule])

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
                        {lesson.employees[0] && <Text style={{ textAlign: "center" }}>{`${lesson.employees[0].lastName} ${lesson.employees[0]?.firstName} ${lesson.employees[0]?.middleName}`}</Text>}
                        {lesson.employees[0] && <Text style={{ color: "var(--text_secondary)", textAlign: "center" }}>{lesson.employees[0]?.rank}</Text>}
                    </div>
                    {lesson.auditories[0] && <SimpleCell before={<Icon28HomeOutline/>} disabled indicator={lesson.auditories[0]}>Аудитория</SimpleCell>} 
                    {examsSchedule && <SimpleCell before={<Icon28CalendarOutline />} disabled indicator={new Date(Date.parse(lesson.dateLesson.split(".").reverse().join("/"))).toLocaleString("ru-RU", { day: "numeric", month: "long" })}>Дата</SimpleCell>}
                    <SimpleCell before={<Icon28ClockOutline />} disabled indicator={`${lesson.startLessonTime} - ${lesson.endLessonTime}`}>Время</SimpleCell>
                    {lesson.numSubgroup > 0 && <SimpleCell before={<Icon28UsersOutline />} disabled indicator={lesson.numSubgroup}>Подгруппа</SimpleCell>}
                    {!examsSchedule && <SimpleCell before={<Icon28CalendarOutline />} disabled indicator={lesson.weekNumber.join(", ")}>Недели</SimpleCell>}
                </>
        }
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
                after={
                    <>
                        {schedule?.exams.length > 0 && <PanelHeaderButton onClick={() => { setFullSchedule(false); setExamsSchedule(!examsSchedule);}}><Icon28EducationOutline fill={!examsSchedule && 'var(--tabbar_inactive_icon)'} /></PanelHeaderButton>}
                        {schedule && <PanelHeaderButton onClick={() => { setFullSchedule(!fullSchedule); setExamsSchedule(false) }}><Icon28CalendarOutline fill={!fullSchedule && 'var(--tabbar_inactive_icon)'} /></PanelHeaderButton>}
                    </>
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
                        {!examsSchedule && <>
                            {!fullSchedule && <CalendarTabBar onSelect={setDayInfo} />}
                            {fullSchedule && <WeekDayTabBar onSelect={setDayInfo} />}
                        </>}
                        <Separator wide />
                    </FixedLayout>
                    <Group
                        style={{ paddingTop: fixedLayoutRef?.offsetHeight - 15 * !fullSchedule}}
                        header={
                            !fullSchedule && <>
                                {!examsSchedule && dayInfo &&
                                    <Header
                                        subtitle={`${dayInfo.week}-ая учебная неделя`}
                                        aside={
                                            <Link getRootRef={selectSubGroupButtonRef} onClick={() => props.onOpenPopout(actionSheet)} mode="outline" size="s">
                                                {subGroupText[subGroup]}
                                            </Link>
                                        }
                                    >
                                        {useFirstUpperCase(dayInfo.date?.toLocaleString("ru-RU", { day: 'numeric', month: 'long', weekday: 'long' }))}
                                    </Header>
                                }
                                {examsSchedule && 
                                    <Header style={{justifyContent: "center"}}>
                                        Экзамены
                                    </Header>
                                }
                            </>
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
                                                    >{examsSchedule ? "|" : lessonNumber[e.startLessonTime]}</Headline>
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
                                                        {examsSchedule && <OutlineText>{new Date(Date.parse(e.dateLesson.split(".").reverse().join("/"))).toLocaleString("ru-RU", { day: "numeric", month: "short" })}</OutlineText>}
                                                        {e.auditories[0] && <OutlineText>{e.auditories[0]}</OutlineText>}
                                                        {e.numSubgroup != 0 && <OutlineText>{e.numSubgroup}</OutlineText>}
                                                        {fullSchedule && <OutlineText>{`нед. ${e.weekNumber.join(", ")}`}</OutlineText>}
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