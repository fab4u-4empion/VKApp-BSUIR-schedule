//Search in an array of objects by a given field

import { useEffect, useState } from "react"

export const useSearch = (array, param, initSearchValue) => {

    const [value, setValue] = useState(initSearchValue)

    const search = () => {
        if (array && param != null)
            return array.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1)
        if (array && param == null)
            return array.filter(e => e.toLowerCase().indexOf(value.toLowerCase()) > -1)
        return []
    } 

    const [result, setResult] = useState(search(initSearchValue))

    const getResult = (value) => {
        setValue(value)
    }

    useEffect(() => {
        setResult(search())
    }, [array, value])

    return [value, result, getResult]
}