const submit = document.getElementById('submit')
const password = document.getElementById('password')
const username = document.getElementById('username')


const passwordAlert = document.getElementById('password-alert')
const usernameAlert = document.getElementById('username-alert')
const submitAlert = document.getElementById('submit-alert')





submit.addEventListener('click', () => {
        const user = checkIfUserExist(username.value.trim(),password.value.trim());
        if (user){
           localStorage.setItem('currentUser', JSON.stringify(user))
           window.location.href = "http://127.0.0.1:5500/index.html";
        }
        else if (user === null){
            submitAlert.classList.add('alert')
            submitAlert.textContent = "User Does Not Exist"
        }
        else {
            submitAlert.classList.add('alert')
            submitAlert.textContent = "Wrong Password"
        }
    }
)


function checkIfUserExist(username,password) {
    const users = JSON.parse(localStorage.getItem('users')) ? JSON.parse(localStorage.getItem('users')) : []
    for (let user of users){
        if (user.username === username) {
           if   (user.password === password){
            return user }
            else {
                return undefined
            }
        }
    }
    return null;
}
