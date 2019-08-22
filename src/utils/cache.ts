


export const getCache = (key: string) => {
  let arg = localStorage.getItem(key)
  try {
    return JSON.parse(arg || '')
  }
  catch (err) {
    return arg
  }
}

export const setCache = (key: string, value: object) => localStorage.setItem(key, JSON.stringify(value))
