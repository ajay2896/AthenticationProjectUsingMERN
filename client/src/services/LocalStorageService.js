

/*******************  Store JWT Token From BackEnd ****************/
const storeToken = (value) => {
    localStorage.setItem('token', value)
}

/*****************  Get JWT TokenFrom Local Storage *******************/
const getToken = (value) => {
    let token = localStorage.getItem('token')
    return token
}

/****************  Remove Token From Storage  ******************/
const removeToken = (value) => {
    localStorage.removeItem(value)
}

// Export Function
export { storeToken, getToken, removeToken };