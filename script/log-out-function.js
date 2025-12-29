function logOut() {
    sessionStorage.removeItem("userID")
    sessionStorage.removeItem('userStatus')
    sessionStorage.removeItem('name')
    window.location.href = "../html/login-site.html";
}