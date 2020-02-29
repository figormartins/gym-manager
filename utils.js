module.exports = {
  age: (timeStamp) => {
    const today = new Date()
    const birthdate = new Date(timeStamp)
    
    let age = today.getFullYear() - birthdate.getFullYear()
    const month = today.getMonth() - birthdate.getMonth()

    if (month < 0 || month == 0 && today.getDate() <= birthdate.getDate())
      age = age - 1
    
    return age
  },
  date: (timeStamp) => {
    const date = new Date(timeStamp)

    const year = date.getUTCFullYear()
    const month = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day = `0${date.getUTCDate()}`.slice(-2)

    return `${year}-${month}-${day}`
  }
}