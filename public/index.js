
var menuBtn = document.querySelector("#navbar-menu-button")
var menuIcon = document.querySelector(".fa-bars")
var mobileMenu = document.querySelector('.navbar-links-mobile')

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('navbar-links-mobile-active')
    // attempting to toggle id instead of class  
    menuIcon.classList.toggle('fa-x')
})