const submit = document.getElementById('submit-signup')
const password = document.getElementById('password')
const username = document.getElementById('username')
const email = document.getElementById('email')


const emailAlert = document.getElementById('email-alert')
const passwordAlert = document.getElementById('password-alert')
const usernameAlert = document.getElementById('username-alert')
const submitAlert = document.getElementById('submit-alert')

let canSubmitUsermame = false
let canSubmitPassword = false
let canSubmitEmail = false

username.addEventListener('change', () => {
    if (username.value.length < 8){
        usernameAlert.classList.add('alert')
        usernameAlert.textContent = "Username Length Has To Be 8+ Chars"
        canSubmitUsermame = false
    }
    else {
        usernameAlert.classList.remove('alert')
        usernameAlert.textContent = ""
        canSubmitUsermame = true
    }
})

email.addEventListener('change', () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(!emailRegex.test(email.value)) {
        emailAlert.classList.add('alert')
        emailAlert.textContent = "Invalid email structure"
        canSubmitEmail = false


    }
    else {
        emailAlert.classList.remove('alert')
        emailAlert.textContent = ""
        canSubmitEmail = true

    }
})

password.addEventListener('change', () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if(!passwordRegex.test(password.value)) {
        passwordAlert.classList.add('alert')
        passwordAlert.textContent = "8+ length, 1 Upper Case, 1 Lower Case, 1 Number"
        canSubmitPassword = false

    }
    else {
        passwordAlert.classList.remove('alert')
        passwordAlert.textContent = ""
        canSubmitPassword = true

    }
})

submit.addEventListener('click', () => {
    if (canSubmitEmail && canSubmitPassword && canSubmitUsermame){
        if (checkIfUserExist(username.value.trim(),email.value.trim())){
            submitAlert.classList.add('alert')
            submitAlert.textContent = "User Already Exists"
    
        }
        else {
            submitAlert.classList.remove('alert')
            submitAlert.textContent = ""
            addUser(username.value.trim(),email.value.trim(),password.value.trim())
            window.location.href = "http://127.0.0.1:5500/html/login.html";

        }
    }
})


function checkIfUserExist(username,email) {
    const users = JSON.parse(localStorage.getItem('users')) ? JSON.parse(localStorage.getItem('users')) : []
    for (let user of users){
        if (user.username === username || user.email === email){
            return true
        }
    }
    return false;
}

function addUser(username,email,password){
    const users = JSON.parse(localStorage.getItem('users')) ? JSON.parse(localStorage.getItem('users')) : []
    users.push({"username" : username, "password" : password, "email" :email , "blackWinCount" : 0, "whiteWinCount" : 0})
    localStorage.setItem("users",JSON.stringify(users))
}


// users : [
//     {"username" : , "password ", "email" : },
// ]