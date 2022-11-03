import { HorizontalScroll, TabsItem, Tabs } from "@vkontakte/vkui"
import { useEffect, useMemo, useState } from "react"

const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
const daysShort = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб',]

export const CalendarTabBar = ({onSelect}) => {
    const [selected, setSelected] = useState(0)

    const daysInfo = useMemo(() => {
        let weekNumber = JSON.parse(sessionStorage.getItem("week"))
        return Array(30)
            .fill(null)
            .map((e, index) => {
                const date = new Date(Date.now() + index * 86400000)
                if (date.getDay() == 1 && index > 0) weekNumber = weekNumber % 4 + 1
                return {
                    date,
                    week: weekNumber
                }
            })
    }, [])

    useEffect(() => {
        onSelect(daysInfo[selected])
    }, [])

    const selectHandler = (index) => {
        onSelect(daysInfo[index])
        setSelected(index)
    }

    return (
        <Tabs mode="accent">
            <HorizontalScroll 
                arrowSize="m"
                getScrollToLeft={(i) => i - 300}
                getScrollToRight={(i) => i + 300}
            >
                {
                    daysInfo
                        .map((e, index) => 
                            <TabsItem
                                selected={selected == index}
                                onClick={() => {selectHandler(index)}}
                                key={e.date}
                            >
                                {`${e.date.getDate()} ${months[e.date.getMonth()]}`}
                                <br/>
                                {`${daysShort[e.date.getDay()]}`}
                            </TabsItem>
                        )
                }
            </HorizontalScroll>
        </Tabs>
    )
}