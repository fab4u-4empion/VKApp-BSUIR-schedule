import { Icon16Dropdown, Icon24InfoCircleOutline, Icon28CalendarOutline, Icon28ClockOutline, Icon28EducationOutline, Icon28Favorite, Icon28FavoriteOutline, Icon28HomeOutline, Icon28Users3Outline, Icon28UsersOutline } from '@vkontakte/icons'
import { ActionSheet, ActionSheetDefaultIosCloseItem, ActionSheetItem, Avatar, Button, ButtonGroup, Card, CardGrid, Cell, Div, FixedLayout, Group, Header, Headline, IconButton, InitialsAvatar, Link, List, MiniInfoCell, PanelHeader, PanelHeaderBack, PanelHeaderButton, PanelHeaderContent, PanelHeaderContext, Placeholder, PullToRefresh, RichCell, Separator, SimpleCell, Spinner, Text, Title } from '@vkontakte/vkui'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
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

export const TeacherSchedulePanel = (props) => {
    const { toggleTeachreFavoriteFlagSnackbar } = useContextProvider()

    const [schedule, setSchedule] = useLocalStorage(null, `schedule_${props.teacher.urlId}`)
    const [dayInfo, setDayInfo] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [loadingError, setLoadingError] = useState(false)
    const [snackbar, setSnackbar] = useState(null)
    const [fullSchedule, setFullSchedule] = useState(false)
    const [examsSchedule, setExamsSchedule] = useState(false)

    const [fixedLayoutRef, setFixedLayoutRef] = useState(null)

    const currentSchedule = useMemo(() => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',]
        if (examsSchedule)
            return schedule?.exams
        const daySchedule = !fullSchedule ? schedule?.schedules[days[dayInfo?.date.getDay()]] : schedule?.schedules[days[dayInfo + 1]]
        return !fullSchedule ? daySchedule?.filter(e => e.weekNumber.includes(dayInfo.week)) : daySchedule
    }, [dayInfo])

    useEffect(() => {
        if (!schedule) {
            axios
                .get(`https://iis.bsuir.by/api/v1/employees/schedule/${props.teacher.urlId}`)
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
            .get(`https://iis.bsuir.by/api/v1/employees/schedule/${props.teacher.urlId}`)
            .then(response => {
                setSchedule(response.data)
                setFetching(false)
                setLoadingError(false)
            })
            .catch(e => {
                setFetching(false)
                setSnackbar(<ErrorSnackbar message="Не удалось обновить расписание" setSnackbar={setSnackbar} />)
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
                            className={`${lessonTypes[lesson.lessonTypeAbbrev]}`}
                            shadow={false}
                        >
                            <Icon28Users3Outline width={40} height={40}/>
                        </Avatar>
                        <Text style={{ textAlign: "center" }}>{lesson.studentGroups.map(g => g.name).join(", ")}</Text>
                    </div>
                    {lesson.auditories[0] && <SimpleCell before={<Icon28HomeOutline />} disabled indicator={lesson.auditories[0]}>Аудитория</SimpleCell>}
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
                        onClick={() => props.teacherContextMenuOpened ? history.go(-2) : history.back()}
                    />
                }
                after={
                    <>
                        {schedule?.exams.length > 0 && <PanelHeaderButton onClick={() => { setFullSchedule(false); setExamsSchedule(!examsSchedule); }}><Icon28EducationOutline fill={!examsSchedule && 'var(--tabbar_inactive_icon)'} /></PanelHeaderButton>}
                        {schedule && <PanelHeaderButton onClick={() => { setFullSchedule(!fullSchedule); setExamsSchedule(false) }}><Icon28CalendarOutline fill={!fullSchedule && 'var(--tabbar_inactive_icon)'} /></PanelHeaderButton>}
                    </>
                }
            >
                <PanelHeaderContent
                    aside={
                        <Icon16Dropdown
                            style={{ transform: `rotate(${props.teacherContextMenuOpened ? "180deg" : "0"})` }}
                        />
                    }
                    onClick={() => props.onToggleTeacherContextMenu()}
                >
                    {`${props.teacher.lastName} ${props.teacher.firstName[0]}. ${props.teacher.middleName[0]}.`}
                </PanelHeaderContent>
            </PanelHeader>
            <PanelHeaderContext
                opened={props.teacherContextMenuOpened}
                onClose={() => props.onToggleTeacherContextMenu()}
            >
                <List>
                    <Cell
                        before={
                            <>
                                {props.favoriteTeachers.includes(props.teacher.id) && <Icon28Favorite fill="var(--accent)" />}
                                {!props.favoriteTeachers.includes(props.teacher.id) && <Icon28FavoriteOutline fill="var(--accent)" />}
                            </>
                        }
                        onClick={() => props.onToggleTeachersFavoriteFlagHandler(props.teacher.id)}
                    >
                        {props.favoriteTeachers.includes(props.teacher.id) && "Удалить из \"Избранное\""}
                        {!props.favoriteTeachers.includes(props.teacher.id) && "Добавить в \"Избранное\""}
                    </Cell>
                </List>
            </PanelHeaderContext>
            {!schedule && !loadingError &&
                <Group style={{ paddingTop: 50 }}>
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
                            caption={schedule.employeeDto.rank}
                            before={<Avatar size={48} src={schedule.employeeDto.photoLink}/>}
                        >
                            {`${schedule.employeeDto.lastName} ${schedule.employeeDto.firstName} ${schedule.employeeDto.middleName}`}
                        </RichCell>
                        {!examsSchedule && <>
                            {!fullSchedule && <CalendarTabBar onSelect={setDayInfo} />}
                            {fullSchedule && <WeekDayTabBar onSelect={setDayInfo} />}
                        </>}
                        <Separator wide />
                    </FixedLayout>
                <Group
                    style={{ paddingTop: fixedLayoutRef?.offsetHeight - 15 * !fullSchedule }}
                    header={
                        !fullSchedule && <>
                            {!examsSchedule && dayInfo &&
                                <Header
                                    subtitle={`${dayInfo.week}-ая учебная неделя`}
                                >
                                    {useFirstUpperCase(dayInfo.date?.toLocaleString("ru-RU", { day: 'numeric', month: 'long', weekday: 'long' }))}
                                </Header>
                            }
                            {examsSchedule &&
                                <Header style={{ justifyContent: "center" }}>
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
                                                    {e.auditories[0] && <OutlineText>{e.auditories[0]}</OutlineText>}
                                                    {e.numSubgroup != 0 && <OutlineText>{e.numSubgroup}</OutlineText>}
                                                    {fullSchedule && <OutlineText>{`нед. ${e.weekNumber.join(", ")}`}</OutlineText>}
                                                </div>
                                                {<Text style={{ color: "var(--text_secondary)", fontSize: ".9em" }}>{e.studentGroups.map(g => g.name).join(", ")}</Text>}
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
                    {toggleTeachreFavoriteFlagSnackbar}
                </Group>
                </>
            }
            {snackbar}
        </>
    )
}