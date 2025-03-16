
var menuBtn = document.querySelector("#navbar-menu-button")
var menuIcon = document.querySelector(".fa-bars")
var mobileMenu = document.querySelector('.navbar-links-mobile')
var navbar = document.getElementById('navbar')


menuBtn.addEventListener('click', () => {


    mobileMenu.classList.toggle('navbar-links-mobile-active')

    menuIcon.classList.toggle('fa-x')

    navbar.classList.toggle('dark')
})
