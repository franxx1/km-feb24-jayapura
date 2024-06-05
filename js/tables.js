
// Most Use Ingredients [Data Table]
// Fungsi untuk Mengagregasi Data Berdasarkan Bahan dan Kategori
function aggregateDataByIngredientAndCategory(data) {
  const aggregatedData = {};

  data.forEach(item => {
    const ingredient = item.ingredient.trim();
    const jumlah = parseInt(item.jumlah, 10);
    const category = item.category;

    if (aggregatedData[ingredient]) {
      aggregatedData[ingredient].jumlah += jumlah;
      if (!aggregatedData[ingredient].categories.includes(category)) {
        aggregatedData[ingredient].categories.push(category);
      }
    } else {
      aggregatedData[ingredient] = {
        jumlah: jumlah,
        categories: [category]
      };
    }
  });

  return Object.keys(aggregatedData).map(ingredient => ({
    ingredient: ingredient,
    jumlah: aggregatedData[ingredient].jumlah,
    categories: aggregatedData[ingredient].categories.join(', ')
  }));
}

// Fungsi untuk Menampilkan Bahan yang Paling Sering Digunakan
function displayMostUsedIngredients(data) {
  data = filterDataByCategory(data, selectedCategory);
  
  // Agregasi data untuk tampilan awal
  const aggregatedData = aggregateDataByIngredientAndCategory(data);

  // Buat elemen tabel dengan DataTables
  const tableContainer = document.getElementById("ingredientTableContainer");
  tableContainer.innerHTML = '<h1 class="ingredients-title">Most Used Ingredients</h1>'; // Kosongkan konten tabel sebelumnya

  const table = $('<table id="ingredientTable" class="display"></table>').appendTo(tableContainer).DataTable({
    data: aggregatedData,
    columns: [
      { data: 'ingredient', title: 'Ingredient' },
      { data: 'jumlah', title: 'Usage' },
      { data: 'categories', title: 'Categories' }
    ],
    order: [[1, 'desc']], // Mengatur kolom kedua (Usage) diurutkan dari yang tertinggi ke terendah
    dom: '<"top"lf>rt<"bottom"ip><"clear">', // Konfigurasi dom untuk menyertakan menu panjang dan bilah pencarian
    paging: true, // Aktifkan pagination
    pageLength: 10 // Jumlah baris default yang akan ditampilkan
  });

  // Tambahkan pagination container
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");
  tableContainer.appendChild(paginationContainer);

  // Menambahkan event listener untuk input pencarian default DataTables
  $('#ingredientTable_filter input').on('input', function () {
    const searchTerm = this.value.trim().toLowerCase();

    // Validasi input: hanya izinkan huruf dan spasi
    const validSearchTerm = searchTerm.replace(/[^a-z\s]/gi, '');

    // Jika validSearchTerm berbeda dari searchTerm, tampilkan alert dan perbarui nilai input
    if (validSearchTerm !== searchTerm) {
      alert('Untuk mencari Most Used Ingredients silakan hanya masukkan huruf dan spasi saja.');
      this.value = validSearchTerm;
    }

    table.search(validSearchTerm).draw();
  });
}

  
  
  // Pizza Sales [Data Table]
// Fungsi untuk Menampilkan Penjualan Pizza
function displayPizzaSales(data) {
  data = filterDataByCategory(data, selectedCategory);

  const tableContainer = document.getElementById("pizzaSalesTableContainer");

  // Kosongkan konten sebelumnya
  tableContainer.innerHTML = '<h1 class="pizza-sales-title">Pizza Sales</h1>'; 

  // Buat elemen tabel
  const table = $('<table id="pizzaSalesTable" class="display"></table>').appendTo(tableContainer).DataTable({
    data: data,
    columns: [
      { data: 'name', title: 'Pizza Name' },
      { data: 'total_sales', title: 'Total Sales' },
      { data: 'category', title: 'Categories' } 
    ],
    order: [[1, 'desc']], 
    dom: '<"top"lf>rt<"bottom"ip><"clear">', // Konfigurasi dom untuk menyertakan menu panjang dan bilah pencarian
    paging: true, // Aktifkan pagination
    pageLength: 12 // Jumlah baris default yang akan ditampilkan
  });

  // Tambahkan pagination container
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");
  tableContainer.appendChild(paginationContainer);

  // Menambahkan event listener untuk input pencarian default DataTables
  $('#pizzaSalesTable_filter input').on('input', function() {
    const searchTerm = this.value.trim().toLowerCase();

    // Validasi input: hanya izinkan huruf dan spasi
    const validSearchTerm = searchTerm.replace(/[^a-z\s]/gi, '');

    // Jika validSearchTerm berbeda dari searchTerm, tampilkan alert dan perbarui nilai input
    if (validSearchTerm !== searchTerm) {
      alert('Untuk mencari Pizza Name silakan hanya masukkan huruf dan spasi saja.');
      this.value = validSearchTerm;
    }

    table.search(validSearchTerm).draw();
  });
}

// Insight Section [Data Table]
document.addEventListener("DOMContentLoaded", function() {
  const insightsData = [
    { no: 1, insight: "Penjualan pizza mengalami penurunan selama tahun 2015." },
    { no: 2, insight: "Banyaknya penggunaan Ingredients menyesuaikan jumlah menu yang dipesan." },
    { no: 3, insight: "Kategori 'Chicken' memiliki tren penjualan yang paling stabil selama 6 bulan terakhir, sehingga dapat digunakan untuk meningkatkan keuntungan pizza sebanyak 5% dalam 1 kuartal kedepan. Peningkatan tersebut dapat dilakukan dengan meningkatkan penjualan pizza Chicken sebanyak minimum 23%." },
    { no: 4, insight: "Strategi yang dapat digunakan untuk meningkatkan keuntungan sebesar 5% dalam 1 kuartal adalah fokus menjual pizza Ukuran L di Waktu Makan Siang sebanyak minimum 22%." },
    { no: 5, insight: "Strategi yang dapat digunakan untuk meningkatkan keuntungan sebesar 5% dalam 1 kuartal adalah fokus menjual pizza Classic di Waktu Makan Siang sebanyak minimum 28%." }
  ];

  const tableContainer = document.getElementById("insightsTableContainer");
  createInsightsTable(insightsData, tableContainer);
});

// Fungsi untuk Membuat Tabel Insight
function createInsightsTable(data, container) {
  const table = document.createElement("table");
  table.id = "insightsTable";
  table.classList.add("display");
  container.appendChild(table);

  // Inisialisasi DataTable
  $(document).ready(function() {
    $('#insightsTable').DataTable({
      data: data,
      columns: [
        { data: 'no', title: 'No' },
        { data: 'insight', title: 'Insight' }
      ],
      paging: false,
      searching: false,
      info: false
    });
  });
}
