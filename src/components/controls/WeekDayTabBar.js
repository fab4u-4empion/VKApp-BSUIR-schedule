import { HorizontalScroll, TabsItem, Tabs } from "@vkontakte/vkui"
import { useEffect, useMemo, useState } from "react"

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье',]

export const WeekDayTabBar = ({ onSelect }) => {
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        onSelect(selected)
    }, [])

    const selectHandler = (index) => {
        setSelected(index)
        onSelect(index)
    }

    return (
        <Tabs mode="accent">
            <HorizontalScroll
                arrowSize="m"
                getScrollToLeft={(i) => i - 300}
                getScrollToRight={(i) => i + 300}
            >
                {
                    days
                        .map((e, index) =>
                            <TabsItem
                                selected={selected == index}
                                onClick={() => { selectHandler(index) }}
                                key={index}
                            >
                                {`${days[index]}`}
                            </TabsItem>
                        )
                }
            </HorizontalScroll>
        </Tabs>
    )
}