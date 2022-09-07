//Search in an array of objects by a given field

import { useEffect, useState } from "react"

export const useSearch = (array, param, initSearchValue) => {
    const [value, setValue] = useState(initSearchValue)
    const [result, setResult] = useState(
        array ? array.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1) : []
    )

    const getResult = (value) => {
        setResult(
            array ? array.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1) : []
        )
        setValue(value)
    }

    useEffect(() => {
        setResult(
            array ? array.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1) : []
        )
    }, [array])

    return [value, result, getResult]
}