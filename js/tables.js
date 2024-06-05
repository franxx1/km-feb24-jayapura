function fetchData(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching the data");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Fetch data failed:", error);
        throw error; // Re-throw the error so the calling code can handle it
      });
  }
  document.addEventListener("DOMContentLoaded", function () {
    fetchData("data/testData.json").then((data) => {
      selectedCategory = "All";
      const ingredientUsage = data.MostUseIngredients;
      const pizzaSales = data.PizzaSales;

      displayMostUsedIngredients(ingredientUsage);
      
      displayPizzaSales(pizzaSales);
      
      // Filter the combined chart data based on the selected category
    });
  });
    

function displayMostUsedIngredients(data) {
    const tableContainer = document.getElementById("ingredientTableContainer");
    tableContainer.innerHTML = '<h1 class="ingredients-title">Most Used Ingredients</h1>'; // Kosongkan konten tabel sebelumnya
  
    // Buat elemen tabel dengan DataTables
    const table = $('<table id="ingredientTable" class="display"></table>').appendTo(tableContainer).DataTable({
      data: data,
      columns: [
        { data: 'ingredient', title: 'Ingredient' },
        { data: 'jumlah', title: 'Usage' }
      ],
      dom: '<"top"lf>rt<"bottom"ip><"clear">', // Configure dom to include length menu and search bar
      paging: true, // Enable pagination
      pageLength: 10 // Default number of rows to display
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
  function displayPizzaSales(data) {
    const tableContainer = document.getElementById("pizzaSalesTableContainer");
  
    // Clear previous content
    tableContainer.innerHTML = '<h1 class="pizza-sales-title">Pizza Sales</h1>'; 
  
    // Create table element
    const table = $('<table id="pizzaSalesTable" class="display"></table>').appendTo(tableContainer).DataTable({
      data: data,
      columns: [
        { data: 'name', title: 'Pizza Name' },
        { data: 'total_sales', title: 'Total Sales' }
      ],
      dom: '<"top"lf>rt<"bottom"ip><"clear">', // Configure dom to include length menu and search bar
      paging: true, // Enable pagination
      pageLength: 10 // Default number of rows to display
    });
  
    // Add pagination container
    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("pagination");
    tableContainer.appendChild(paginationContainer);
  
    // Add event listener to search input
    $('#pizzaSalesTable_filter input').on('input', function() {
      const searchTerm = this.value.trim().toLowerCase();
  
      // Validate input: allow only letters and spaces
      const validSearchTerm = searchTerm.replace(/[^a-z\s]/gi, '');
  
      // If validSearchTerm is different from searchTerm, show alert and update input value
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
  
  function createInsightsTable(data, container) {
    const table = document.createElement("table");
    table.id = "insightsTable";
    table.classList.add("display");
    container.appendChild(table);
  
    // Initialize DataTable
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