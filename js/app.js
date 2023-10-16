const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const usernameOutput =  document.getElementById('username-output')
const logout = document.getElementById('logout-nav')

usernameOutput.textContent = "Hello " + currentUser.username
logout.onclick = logoutUser


function logoutUser(){
    localStorage.setItem('currentUser',null)
    window.location.href = "http://127.0.0.1:5500/html/login.html";
}
