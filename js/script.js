document.addEventListener('DOMContentLoaded', function () {
    const burgerMenu = document.querySelector('.burgerMenu');
    const sidebar = document.querySelector('.sidebar');

    burgerMenu.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });
});
