const debounce = (fn: { (...args: any): any }, time: number) => {
    let timeout: NodeJS.Timeout

    return async (...args: any) => {
        clearTimeout(timeout)
        timeout = setTimeout(()=>fn(...args), time)
    }
}

export default debounce