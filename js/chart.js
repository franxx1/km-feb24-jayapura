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

    createMonthlySalesChart(MonthlyPizzaCategory);
    chartOvertime(PizzaSalesOvertime);
    sizeChart(PizzasizeSales);
    QuarterSalesChart(QuarterlyPizzaSales);
    top5Chart(top5Pizza);
    low5Chart(low5Pizza);
    combineChart(combineCharts);
    console.log(combineCharts);

    // Perbarui elemen HTML dengan total order dan total sales
    let totalOrder = totalOrders(data.totalOrder);
    console.log("Total Order:", totalOrder);
    document.getElementById("totalOrder").textContent = totalOrder;

    // Update total sales revenue
    let totalSales = totalRevenue(data.totalRevenue);
    console.log("Total Sales:", totalSales);

    document.getElementById("totalSales").textContent =
      "$" + totalSales.toFixed(2);
  });
});

function filterDataByCategory(data, category) {
  // Memastikan data adalah array sebelum melakukan filter
  if (!Array.isArray(data)) {
    console.error("Data is not an array");
    return []; // Mengembalikan array kosong jika data bukan array
  }

  if (category === "All") {
    return data;
  }

  // Pastikan setiap objek dalam data memiliki properti category
  return data.filter((item) => item.category === category);
}

function createMonthlySalesChart(data) {
  // Filter data berdasarkan kategori yang dipilih
  data = filterDataByCategory(data, selectedCategory);

  // Hancurkan chart sebelumnya
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

  // Array berisi nama bulan-bulan dalam urutan yang diinginkan
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

  // Mengelompokkan data berdasarkan bulan
  var groupedData = groupByMonth(data);

  // Labels untuk chart adalah nama bulan-bulan
  var labels = orderedMonths;

  // Mengambil data untuk setiap kategori berdasarkan bulan
  var datasets = [];
  if (selectedCategory === "All") {
    // Jika belum ada kategori yang dipilih, tampilkan semua kategori
    datasets = ["Classic", "Supreme", "Veggie", "Chicken"].map(function (
      category
    ) {
      return {
        label: category,
        data: orderedMonths.map(function (month) {
          return getDataByMonthAndCategory(groupedData, month, category);
        }),
      };
    });
  } else {
    // Jika ada kategori yang dipilih, tampilkan hanya kategori tersebut
    datasets.push({
      label: selectedCategory,
      data: orderedMonths.map(function (month) {
        return getDataByMonthAndCategory(groupedData, month, selectedCategory);
      }),

    });
  }

  // Menggambar chart baru dengan data yang diperbarui
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
    },
  });
}

function chartOvertime(data) {
  // Filter data berdasarkan kategori yang dipilih
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("salesChart");

  // Mengelompokkan data berdasarkan tier waktu
  const groupedData = data.reduce((acc, curr) => {
    const key = curr.tier_waktu;
    if (!acc[key]) {
      acc[key] = {
        tier_waktu: curr.tier_waktu,
        total_sales_time: parseInt(curr.total_sales_time),
      };
    } else {
      acc[key].total_sales_time += parseInt(curr.total_sales_time);
    }
    return acc;
  }, {});

  // Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Membuat array untuk menyimpan label yang unik
  const uniqueLabels = [...new Set(data.map((item) => item.tier_waktu))];

  // Membuat chart baru dengan data yang telah diproses
  const ctx = document.getElementById("salesChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: uniqueLabels, // Hanya menggunakan label yang unik
      datasets: [
        {
          label: "Total Sales",
          data: chartData.map((item) => item.total_sales_time),
          backgroundColor: [
            "rgba(255, 99, 132)",
            "rgba(251, 179, 4)",
            "rgba(255, 206, 86)"
          ],
          borderColor: [
            "rgba(255, 99, 132)",
            "rgba(251, 179, 4)",
            "rgba(255, 206, 86)"
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
        },
      },
    },
  });
}

function sizeChart(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("sizeChart");
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
  //Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Membuat array untuk menyimpan label yang unik
  const uniqueLabels = ['L', 'M', 'S', 'XL', 'XXL'];
  const chartDataSorted = uniqueLabels.map(label => {
    const data = chartData.find(item => item.size === label);
    return data ? data.total_sales_size : 0;
  });
  const ctx = document.getElementById("sizeChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueLabels, // Hanya menggunakan label yang unik
      datasets: [
        {
          label: "Total Sales",
          data: chartDataSorted,
          backgroundColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
          ],
          borderColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
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
        },
      },
    },
  });
}

function QuarterSalesChart(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("quarterChart");
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
  //Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Membuat array untuk menyimpan label yang unik
  const uniqueLabels = [...new Set(data.map((item) => item.kuartal))];
  const ctx = document.getElementById("quarterChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueLabels, // Hanya menggunakan label yang unik
      datasets: [
        {
          label: "Total Sales",
          data: chartData.map((item) => item.total_sales_quartal),
          backgroundColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
          ],
          borderColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
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
        },
      },
    },
  });
}

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
  //Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Membuat array untuk menyimpan label yang unik
  const uniqueLabels = [...new Set(data.map((item) => item.name))];
  const ctx = document.getElementById("top5Pizza").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueLabels, // Hanya menggunakan label yang unik
      datasets: [
        {
          label: "Total Sales",
          data: chartData.map((item) => item.highest_sales),
          backgroundColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
          ],
          borderColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
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
        },
      },
    },
  });
}
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
  //Mengonversi objek menjadi array chartData
  const chartData = Object.values(groupedData);

  // Membuat array untuk menyimpan label yang unik
  const uniqueLabels = [...new Set(data.map((item) => item.name))];
  const ctx = document.getElementById("low5Pizza").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: uniqueLabels, // Hanya menggunakan label yang unik
  
      datasets: [
        {
          label: "",
          data: chartData.map((item) => item.lowest_sales),
          backgroundColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
          ],
          borderColor: [
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)",
            "rgba(251, 179, 4)"
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
        },
      },
    },
  });
}

function combineChart(data) {
  data = filterDataByCategory(data, selectedCategory);-
  // Memastikan chart sebelumnya dihancurkan
  destroyChart("combinedChart");

  // Mengelompokkan data berdasarkan kategori dan tier_waktu
  const groupedData = data.reduce((acc, curr) => {
    const category = curr.category;
    const tier_waktu = curr.tier_waktu;
    const total_sales_time = parseInt(curr.total_sales_time, 10);

    if (!acc[category]) {
      acc[category] = {
        MakanSiang: 0,
        MakanMalam: 0,
        MakanPagi: 0
      };
    }

    if (tier_waktu === "Makan Siang") {
      acc[category].MakanSiang += total_sales_time;
    } else if (tier_waktu === "Makan Malam") {
      acc[category].MakanMalam += total_sales_time;
    } else if (tier_waktu === "Makan Pagi") {
      acc[category].MakanPagi += total_sales_time;
    }

    return acc;
  }, {});

  // Mengonversi objek menjadi array chartData
  const chartData = Object.entries(groupedData).map(([category, values]) => ({
    category,
    ...values
  }));

  const labels = chartData.map(item => item.category);
  const dataMakanSiang = chartData.map(item => item.MakanSiang);
  const dataMakanMalam = chartData.map(item => item.MakanMalam);
  const dataMakanPagi = chartData.map(item => item.MakanPagi);

  const ctx = document.getElementById("combinedChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels, // Hanya menggunakan label yang unik
      datasets: [
        {
          label: "Makan Siang",
          data: dataMakanSiang,
          backgroundColor: "rgba(251, 179, 4)",
          borderColor: "rgba(251, 179, 4)",
          borderWidth: 1,
        },
        {
          label: "Makan Malam",
          data: dataMakanMalam,
          backgroundColor: "rgba(156, 10, 26)",
          borderColor: "rgba(156, 10, 26)",
          borderWidth: 1,
        },
        {
          label: "Makan Pagi",
          data: dataMakanPagi,
          backgroundColor: "rgba(255, 206, 86)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}


function totalOrders(data) {
  data = filterDataByCategory(data, selectedCategory);

  // Memastikan chart sebelumnya dihancurkan
  destroyChart("totalOrder");
  let totalQuantity = 0;
  data.forEach((item) => {
    totalQuantity += parseInt(item.quantity);
  });
  return totalQuantity;
}

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
    low5Chart(data.lowest5Pizza);
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
