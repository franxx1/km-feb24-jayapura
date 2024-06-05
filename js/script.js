// Event listener yang akan dijalankan saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', function () {
    // Mengambil elemen burger menu
    const burgerMenu = document.querySelector('.burgerMenu');
    // Mengambil elemen sidebar
    const sidebar = document.querySelector('.sidebar');
    // Mengambil semua elemen menu item di dalam sidebar
    const menuItems = document.querySelectorAll('.side-menu-item');

    // Menambahkan event listener untuk burger menu
    burgerMenu.addEventListener('click', function () {
        // Menambahkan atau menghapus kelas 'active' pada sidebar saat burger menu diklik
        sidebar.classList.toggle('active');
    });

    // Menambahkan event listener untuk setiap menu item di dalam sidebar
    menuItems.forEach(function(menuItem) {
        menuItem.addEventListener('click', function () {
            // Menghapus kelas 'active' pada sidebar saat salah satu menu item diklik
            sidebar.classList.remove('active');
        });
    });
});
