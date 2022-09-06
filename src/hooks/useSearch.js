import { useEffect, useState } from "react"

export const useSearch = (arr, param, initSearchValue) => {
    const [value, setValue] = useState(initSearchValue)
    const [result, setResult] = useState(
        arr ? arr.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1) : []
    )

    const getResult = (value) => {
        setResult(arr.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1))
        setValue(value)
    }

    useEffect(() => {
        setResult(
            arr ? arr.filter(e => e[param].toLowerCase().indexOf(value.toLowerCase()) > -1) : []
        )
    }, [arr])

    return [value, result, getResult]
}