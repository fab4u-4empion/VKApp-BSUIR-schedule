import { Icon16Dropdown, Icon28EducationOutline, Icon28Favorite, Icon28FavoriteOutline } from '@vkontakte/icons'
import { Avatar, Cell, Group, List, PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderContext, Placeholder } from '@vkontakte/vkui'

export const TeacherSchedulePanel = (props) => {
    return (
        <>
            <PanelHeader
                before={
                    <PanelHeaderBack
                        onClick={() => props.teacherContextMenuOpened ? history.go(-2) : history.back()}
                    />
                }
            >
                <PanelHeaderContent
                    aside={
                        <Icon16Dropdown
                            style={{ transform: `rotate(${props.teacherContextMenuOpened ? "180deg" : "0"})` }}
                        />
                    }
                    onClick={() => props.onToggleTeacherContextMenu()}
                    before={<Avatar size={36} src={props.teacher.photoLink} />}
                    status={props.teacher.rank}
                >
                    {props.teacher.fullName}
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
            <Group style={{ height: "1000px" }}>
                <Placeholder
                    icon={<Icon28EducationOutline width={56} height={56} />}
                >
                    Расписание преподавателя {props.teacher.fullName}
                </Placeholder>
                { props.snackbar }
            </Group>
        </>
    )
}