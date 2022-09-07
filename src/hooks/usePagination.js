//Used to reduce the load if there are too many elements to display

import { useEffect, useState } from "react"

export const usePagination = (array, startPage, count) => {
    const [currentPage, setCurrentPage] = useState(startPage)
    const [endOfPage, setEndOfPage] = useState(false)
    const [distArray, setDistArray] = useState([])

    useEffect(() => {
        if (endOfPage && array.length > 30) {
            setDistArray([...distArray, ...array.slice(currentPage * 30, currentPage * 30 + 30)])
            setCurrentPage(currentPage => currentPage + 1)
            setEndOfPage(false)
        } else {
            setEndOfPage(false)
        }
    }, [endOfPage])

    useEffect(() => {
        setCurrentPage(1)
        setDistArray(array.slice(0, 30))
    }, [array])

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler)
        return function () {
            window.removeEventListener("scroll", scrollHandler)
        }
    }, [])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setEndOfPage(true)
        }
    }

    return [distArray]
}