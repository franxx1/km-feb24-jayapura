var selectedCategory;
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
    const MonthlyPizzaCategory = data.MonthlyPizzaCategory;
    const PizzaSalesOvertime = data.PizzaSalesOvertime;
    const PizzasizeSales = data.PizzasizeSales;
    const QuarterlyPizzaSales = data.QuaterlyPizza;
    const top5Pizza = data.top5Pizza;
    const low5Pizza = data.lowest5Pizza;
    const combineCharts = data.CombinedMetrics;
    const ingredientUsage = data.MostUseIngredients;
    const pizzaSales = data.PizzaSales;

    createMonthlySalesChart(MonthlyPizzaCategory);
    chartOvertime(PizzaSalesOvertime);
    sizeChart(PizzasizeSales);
    QuarterSalesChart(QuarterlyPizzaSales);
    top5Chart(top5Pizza);
    low5Chart(low5Pizza);
    displayMostUsedIngredients(ingredientUsage);
    displayPizzaSales(pizzaSales);
    combineChart(combineCharts);
    console.log(combineCharts);

   // Perbarui elemen HTML dengan total order dan total sales
  let totalOrder = totalOrders(data.totalOrder).toLocaleString();
  console.log("Total Order:", totalOrder);
  document.getElementById("totalOrder").textContent = totalOrder;

  // Update total sales revenue
  let totalSales = totalRevenue(data.totalRevenue);
  console.log("Total Sales:", totalSales);

  document.getElementById("totalSales").textContent =
    "$" + totalSales.toFixed(2);

  });
});

// Fungsi untuk memfilter data berdasarkan kategori
function filterDataByCategory(data, category) {
  // Memastikan data adalah array sebelum melakukan filter
  if (!Array.isArray(data)) {
    console.error("Data is not an array");
    return []; // Mengembalikan array kosong jika data bukan array
  }

  // Jika kategori tidak dipilih atau kategori adalah "All", mengembalikan semua data
  if (!category || category === "All") {
    return data;
  }

  // Memfilter dan memodifikasi data berdasarkan kategori yang dipilih
  return data
    .filter((item) => {
      // Memisahkan kategori dan memeriksa apakah termasuk kategori yang dipilih
      const categories = item.category.split(',').map(cat => cat.trim());
      return categories.includes(category);
    })
    .map(item => {
      const categories = item.category.split(',').map(cat => cat.trim());
      return {
        ...item,
        category: categories.includes(category) ? category : item.category
      };
    });
}


// MONTHLY CHART
// Fungsi untuk menghasilkan label dengan singkatan bulan dan tahun
function generateMonthYearLabels(months, year) {
  return months.map(function(month) {
    // Mengambil 3 karakter pertama dari nama bulan
    const monthAbbrev = month.substr(0, 3); 
    // Menggabungkan singkatan bulan dengan tahun
    return monthAbbrev + ' ' + year; 
  });
}

function createMonthlySalesChart(data) {
  // Memfilter data berdasarkan kategori yang dipilih
  data = filterDataByCategory(data, selectedCategory);

  // Menghancurkan chart sebelumnya
  destroyChart("salesOvertime");

  // Fungsi untuk mengelompokkan data berdasarkan bulan
  function groupByMonth(data) {
    return data.reduce(function (acc, obj) {
      var key = obj.month;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  // Fungsi untuk mendapatkan data berdasarkan bulan dan kategori
  function getDataByMonthAndCategory(groupedData, month, category) {
    var monthData = groupedData[month] || [];
    var categoryData = monthData.find(function (item) {
      return item.category === category;
    });
    return categoryData ? parseInt(categoryData.total_sales) : 0;
  }

  // Array nama bulan dalam urutan yang diinginkan
  var orderedMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Menghasilkan label untuk tahun 2015
  var labels = generateMonthYearLabels(orderedMonths, 2015);

  // Mengelompokkan data berdasarkan bulan
  var groupedData = groupByMonth(data);

  // Warna untuk setiap kategori
  const colors = {
    "Classic": {
      borderColor: "rgba(54, 162, 235, 1)", // Biru
      backgroundColor: "rgba(54, 162, 235, 0.2)"
    },
    "Supreme": {
      borderColor: "rgba(255, 99, 132, 1)", // Merah
      backgroundColor: "rgba(255, 99, 132, 0.2)"
    },
    "Veggie": {
      borderColor: "rgba(255, 159, 64, 1)",  // Oranye
      backgroundColor: "rgba(255, 159, 64, 0.2)"
    },
    "Chicken": {
      borderColor: "rgba(255, 205, 86, 1)",  // Kuning
      backgroundColor: "rgba(255, 205, 86, 0.2)"
    }
  };

  // Menyiapkan dataset
  var datasets = [];
  if (selectedCategory === "All") {
    // Jika tidak ada kategori yang dipilih, tampilkan semua kategori
    datasets = Object.keys(colors).map(function (category) {
      return {
        label: category,
        data: orderedMonths.map(function (month) {
          return getDataByMonthAndCategory(groupedData, month, category);
        }),
        borderColor: colors[category].borderColor,
        backgroundColor: colors[category].backgroundColor,
        borderWidth: 3, // Lebar border meningkat
        fill: false
      };
    });
  } else {
    // Jika kategori dipilih, hanya tampilkan kategori tersebut
    datasets.push({
      label: selectedCategory,
      data: orderedMonths.map(function (month) {
        return getDataByMonthAndCategory(groupedData, month, selectedCategory);
      }),
      borderColor: colors[selectedCategory].borderColor,
      backgroundColor: colors[selectedCategory].backgroundColor,
      borderWidth: 3, // Lebar border meningkat untuk kategori yang dipilih
      fill: false
    });

    // Menambahkan kategori lain dengan warna default dan garis yang lebih tipis
    datasets = datasets.concat(Object.keys(colors).filter(category => category !== selectedCategory).map(category => ({
      label: category,
      data: orderedMonths.map(month => getDataByMonthAndCategory(groupedData, month, category)),
      borderColor: colors[category].borderColor,
      backgroundColor: colors[category].backgroundColor,
      borderWidth: 2, // Lebar border lebih tipis untuk kategori non-dipilih
      fill: false,
      borderDash: [5, 5] // Garis putus-putus untuk penekanan yang lebih sedikit
    })));
  }

  // Menggambar chart baru dengan data yang telah diperbarui
  var ctx = document.getElementById("salesOvertime").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: true,
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'nearest',
          intersect: true,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Month, Year'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Sales'
          },
          beginAtZero: false, // Pastikan sumbu y tidak dimulai dari nol jika chart awal tidak
          min: 800, // Nilai minimum sumbu y (berdasarkan chart awal)
          max: 1400, // Nilai maksimum sumbu y (berdasarkan chart awal)
          ticks: {
            stepSize: 50 // Ukuran langkah untuk menyesuaikan garis grid chart awal
          }
        }
      }
    },
  });
}

// Fungsi untuk menghancurkan chart sebelumnya
function destroyChart(chartId) {
  const chartElement = document.getElementById(chartId);
  if (chartElement) {
    const chartInstance = Chart.getChart(chartElement);
    if (chartInstance) {
      chartInstance.destroy();
    }
  }
}

// OVERTIMECHART
// Fungsi untuk membuat chart penjualan secara waktu (overtime)
function chartOvertime(data) {
  // Memfilter data berdasarkan kategori yang dipilih (asumsi selectedCategory sudah didefinisikan di tempat lain)
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("salesChart");

  // Mengelompokkan data berdasarkan 'tier_waktu' dan menghitung total waktu penjualan
  const groupedData = data.reduce((acc, curr) => {
    const key = curr.tier_waktu;
    if (!acc[key]) {
      acc[key] = {
        tier_waktu: curr.tier_waktu,
        total_sales_time: parseInt(curr.total_sales_time, 10),
      };
    } else {
      acc[key].total_sales_time += parseInt(curr.total_sales_time, 10);
    }
    return acc;
  }, {});

  // Mengonversi objek data yang sudah dikelompokkan menjadi array untuk chart
  const chartData = Object.values(groupedData);

  // Mengambil label-label unik
  const uniqueLabels = [...new Set(data.map(item => item.tier_waktu))];

  // Mendefinisikan warna untuk setiap label
  const backgroundColor = [
    "rgba(255, 159, 64, 0.6)", // Makan Siang
    "rgba(255, 205, 86, 0.6)", // Makan Malam
    "rgba(255, 99, 132, 0.6)"  // Makan Pagi
  ];
  const borderColor = [
    "rgba(255, 159, 64, 1)",
    "rgba(255, 205, 86, 1)",
    "rgba(255, 99, 132, 1)"
  ];

  // Menghitung total penjualan untuk persentase
  const totalSales = chartData.reduce((sum, item) => sum + item.total_sales_time, 0);

  // Membuat chart baru dengan data yang telah diproses
  const ctx = document.getElementById("salesChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: uniqueLabels,
      datasets: [{
        label: "Total Sales",
        data: chartData.map(item => item.total_sales_time),
        backgroundColor: backgroundColor.slice(0, uniqueLabels.length),
        borderColor: borderColor.slice(0, uniqueLabels.length),
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            // Mengatur label tooltip
            label: function(tooltipItem) {
              const dataIndex = tooltipItem.dataIndex;
              const value = chartData[dataIndex].total_sales_time;
              const formattedValue = value.toLocaleString(); // Format dengan koma
              const percentage = ((value / totalSales) * 100).toFixed(2) + '%';
              return `${uniqueLabels[dataIndex]}: ${formattedValue} (${percentage})`;
            }
          }
        },
        // Mengatur label data
        datalabels: {
          formatter: (value, ctx) => {
            const formattedValue = value.toLocaleString(); // Format dengan koma
            const percentage = ((value / totalSales) * 100).toFixed(2) + '%';
            return `${formattedValue} (${percentage})`;
          },
          color: '#fff',
          font: {
            weight: 'bold',
          },
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
  });

  // Memperbarui chart dengan persentase
  myChart.options.plugins.datalabels = {
    formatter: (value, ctx) => {
      const formattedValue = value.toLocaleString(); // Format dengan koma
      const percentage = ((value / totalSales) * 100).toFixed(2) + '%';
      return `${formattedValue} (${percentage})`;
    },
    color: '#fff',
    font: {
      weight: 'bold',
    },
  };
  myChart.update();
}

// Fungsi untuk menghancurkan chart sebelumnya
function destroyChart(chartId) {
  const chartElement = document.getElementById(chartId);
  if (chartElement) {
    const chartInstance = Chart.getChart(chartElement);
    if (chartInstance) {
      chartInstance.destroy();
    }
  }
}


// SIZECHART
// Fungsi untuk membuat chart penjualan berdasarkan ukuran
function sizeChart(data) {
  // Memfilter data berdasarkan kategori yang dipilih
  data = filterDataByCategory(data, selectedCategory);

  // Menghancurkan instance chart sebelumnya jika ada
  destroyChart("sizeChart");

  // Mengelompokkan data berdasarkan ukuran dan menghitung total penjualan untuk setiap ukuran
  const groupedData = data.reduce((acc, curr) => {
    const key = curr.size;
    if (!acc[key]) {
      acc[key] = {
        size: curr.size,
        total_sales_size: parseInt(curr.total_sales_size),
      };
    } else {
      acc[key].total_sales_size += parseInt(curr.total_sales_size);
    }
    return acc;
  }, {});

  // Mengonversi objek data ke dalam array untuk data chart
  const chartData = Object.values(groupedData);

  // Mendefinisikan label-label yang tetap untuk memastikan urutan yang benar dan mencakup semua ukuran
  const uniqueLabels = ['L', 'M', 'S', 'XL', 'XXL'];
  const chartDataSorted = uniqueLabels.map(label => {
    const data = chartData.find(item => item.size === label);
    return data ? data.total_sales_size : 0;
  });

  const ctx = document.getElementById("sizeChart").getContext("2d");

  // Membuat chart baru dengan data yang telah diproses
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueLabels, // Menggunakan label yang sudah ditentukan
      datasets: [
        {
          data: chartDataSorted,
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)", // Merah
            "rgba(255, 99, 132, 0.6)", // Biru
            "rgba(255, 206, 86, 1)", // Kuning
            "rgba(255, 159, 64, 0.6)", // Hijau
            "rgba(153, 102, 255, 1)" // Ungu
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(153, 102, 255, 1)"
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 20000, // Memastikan maksimal sumbu y sama dengan contoh
          ticks: {
            stepSize: 2000, // Mengatur ukuran langkah untuk sumbu y
            callback: function(value) {
              return value.toLocaleString(); // Format label dengan koma
            },
            color: "#8D8D8D" // Warna label sumbu y
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Warna garis grid standar
          },
          title: {
            display: true,
            text: 'Quantity'
          },
        },
        x: {
          ticks: {
            color: "#8D8D8D" // Warna label sumbu x
          },
          title: {
            display: true,
            text: 'Size'
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Warna garis grid standar
          },
        }
      },
      plugins: {
        legend: {
          display: false, // Menyembunyikan legenda
        },
        tooltip: {
          enabled: true, // Mengaktifkan tooltip
        },
      },
    },
  });
}

// QUARTERSALES
// Fungsi untuk membuat chart penjualan berdasarkan kuartal
function QuarterSalesChart(data) {
  // Memfilter data berdasarkan kategori yang dipilih
  data = filterDataByCategory(data, selectedCategory);

  // Menghancurkan instance chart sebelumnya jika ada
  destroyChart("quarterChart");

  // Mengelompokkan data berdasarkan kuartal dan menghitung total penjualan untuk setiap kuartal
  const groupedData = data.reduce((acc, curr) => {
    const key = curr.kuartal;
    if (!acc[key]) {
      acc[key] = {
        size: curr.kuartal,
        total_sales_quartal: parseInt(curr.total_sales_quartal),
      };
    } else {
      acc[key].total_sales_quartal += parseInt(curr.total_sales_quartal);
    }
    return acc;
  }, {});

  // Mengonversi objek data ke dalam array untuk data chart
  const chartData = Object.values(groupedData);

  // Memastikan label-label diurutkan dengan benar dari Q1 hingga Q4
  const uniqueLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const chartDataSorted = uniqueLabels.map(label => {
    const data = chartData.find(item => item.size === label);
    return data ? data.total_sales_quartal : 0;
  });

  const ctx = document.getElementById("quarterChart").getContext("2d");

  // Membuat chart baru dengan data yang telah diproses
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueLabels, // Menggunakan label yang sudah ditentukan
      datasets: [
        {
          label: "Total Sales",
          data: chartDataSorted,
          backgroundColor:"rgba(255, 159, 64, 0.6)", // Warna oranye untuk bar
          borderColor:    "rgba(255, 159, 64, 1)", // Warna border oranye
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Quartal',
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Sales',
          },
        },
      },
      plugins: {
        legend: {
          display: true, // Menampilkan legenda
        },
        tooltip: {
          enabled: true, // Mengaktifkan tooltips
        },
      },
    },
  });
}

// TOP 5 CHART
function top5Chart(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("top5Pizza");
  
  const groupedData = data.reduce((acc, curr) => {
      const key = curr.name;
      if (!acc[key]) {
          acc[key] = {
              size: curr.name,
              highest_sales: parseInt(curr.highest_sales),
          };
      } else {
          acc[key].highest_sales += parseInt(curr.highest_sales);
      }
      return acc;
  }, {});

  // Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Mengurutkan data berdasarkan highest_sales dan mengambil 5 teratas
  chartData.sort((a, b) => b.highest_sales - a.highest_sales);
  const top5Data = chartData.slice(0, 5);

  // Membuat array untuk menyimpan label dan data yang unik
  const uniqueLabels = top5Data.map(item => item.size);
  const salesData = top5Data.map(item => item.highest_sales);

  const ctx = document.getElementById("top5Pizza").getContext("2d");
  const myChart = new Chart(ctx, {
      type: "bar",
      data: {
          labels: uniqueLabels,
          datasets: [
              {
                  label: "Total Sales",
                  data: salesData,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor:  "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
              },
          ],
      },
      options: {
          indexAxis: 'y', // Mengubah chart menjadi horizontal bar chart
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Total Sales',
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Pizza',
                  }
              }
          },
          plugins: {
              title: {
                  display: true,
                  color: '#fff',
                  font: {
                      size: 18
                  }
              }
          }
      }
  });
}

// LOWEST5CHART
function low5Chart(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("low5Pizza");
  
  const groupedData = data.reduce((acc, curr) => {
      const key = curr.name;
      if (!acc[key]) {
          acc[key] = {
              size: curr.name,
              lowest_sales: parseInt(curr.lowest_sales),
          };
      } else {
          acc[key].lowest_sales += parseInt(curr.lowest_sales);
      }
      return acc;
  }, {});

  // Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Mengurutkan data berdasarkan lowest_sales dan mengambil 5 terbawah
  chartData.sort((a, b) => a.lowest_sales - b.lowest_sales);
  const bottom5Data = chartData.slice(0, 5);

  // Membuat array untuk menyimpan label dan data yang unik
  const uniqueLabels = bottom5Data.map(item => item.size);
  const salesData = bottom5Data.map(item => item.lowest_sales);

  const ctx = document.getElementById("low5Pizza").getContext("2d");
  const myChart = new Chart(ctx, {
      type: "bar",
      data: {
          labels: uniqueLabels,
          datasets: [
              {
                  label: "Total Sales",
                  data: salesData,
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                  borderColor:"rgba(255, 99, 132, 1)",
                  borderWidth: 1,
              },
          ],
      },
      options: {
          indexAxis: 'y', // Mengubah chart menjadi horizontal bar chart
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Total Sales',
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Pizza',
                     
                  }
              }
          },
          plugins: {
              title: {
                  display: true,
                  color: '#fff',
                  font: {
                      size: 18
                  }
              }
          }
      }
  });
}


// 2 Metrics
// Fungsi untuk membuat chart kombinasi penjualan
function combineChart(data) {
  // Memfilter data berdasarkan kategori yang dipilih
  const filteredData = filterDataByCategory(data, selectedCategory); 
  // Menghancurkan instance chart sebelumnya jika ada
  destroyChart("combinedChart");

  // Fungsi untuk mengelompokkan data berdasarkan tier waktu
  function groupByTimeTier(data) {
      return data.reduce((acc, obj) => {
          const { tier_waktu, category, total_sales_time } = obj;
          if (!acc[tier_waktu]) acc[tier_waktu] = {};
          acc[tier_waktu][category] = parseInt(total_sales_time);
          return acc;
      }, {});
  }

  // Mengelompokkan data
  const groupedData = groupByTimeTier(filteredData);
  const timeTiers = Object.keys(groupedData);
  const categories = ["Classic", "Veggie", "Supreme", "Chicken"];

  // Fungsi untuk membuat dataset
  function createDatasets() {
      const colors = ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"];
      const borderColor = ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"];
      const datasets = [];
      
      timeTiers.forEach((timeTier, index) => {
          datasets.push({
              label: timeTier,
              data: categories.map(category => groupedData[timeTier][category] || 0),  // Memastikan semua kategori terakomodasi
              backgroundColor: colors[index % colors.length],
              borderColor: borderColor[index % borderColor.length],
              borderWidth: 1
          });
      });
      return datasets;
  }

  const ctx = document.getElementById("combinedChart").getContext("2d");
  const myChart = new Chart(ctx, {
      type: "bar",
      data: {
          labels: categories,
          datasets: createDatasets()
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  stacked: false,
                  title: {
                      display: true,
                      text: 'Category',
                  }
              },
              y: {
                  stacked: false,
                  title: {
                      display: true,
                      text: 'Quantity',
                  },
                  beginAtZero: true
              }
          },
          plugins: {
              title: {
                  display: true,
                  color: '#fff',
                  font: {
                      size: 18
                  }
              }
          }
      }
  });
}

// TOTAL ORDERS
function totalOrders(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("totalOrder");
  let totalQuantity = 0;
  data.forEach((item) => {
    totalQuantity += parseInt(item.quantity);
  });
  return totalQuantity.toLocaleString();
}

// TOTAL ORDER
function totalRevenue(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("totalSales");
  let totalSales = 0;
  data.forEach((item) => {
    if (item.hasOwnProperty("revenue")) {
      totalSales += parseFloat(item.revenue.replace("$", ""));
    }
  });
  return totalSales;
}

function updateCharts() {
  const category = document.getElementById("categoryFilter").value;

  // Menggunakan original data yang telah di-fetch
  fetchData("data/testData.json").then((data) => {
    // Memperbarui kategori yang dipilih
    selectedCategory = category;

    // Memperbarui chart dengan kategori yang baru
    createMonthlySalesChart(data.MonthlyPizzaCategory);
    chartOvertime(data.PizzaSalesOvertime);
    sizeChart(data.PizzasizeSales);
    QuarterSalesChart(data.QuaterlyPizza);
    top5Chart(data.top5Pizza);
    low5Chart(data.lowest5Pizza);displayPizzaSales(data.PizzaSales);
    displayMostUsedIngredients(data.MostUseIngredients);
    combineChart(data.CombinedMetrics)
    document.getElementById("totalOrder").textContent = totalOrders(
      data.totalOrder
    );
    document.getElementById("totalSales").textContent =
      "$" + totalRevenue(data.totalRevenue);
  });
}
function destroyChart(canvasId) {
  var chartInstance = Chart.getChart(canvasId);
  if (chartInstance) {
    chartInstance.destroy();
  }
}
