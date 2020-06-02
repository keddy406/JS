// once load website that call this founction
window.onload = () => {
  getCountryData();
  buildChart();
  getHistoriesData();
};
//create googlemap from googlemapapi
var map;
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 22.6273,
      lng: 120.3014,
    },
    zoom: 3,
    styles: mapStyles,
  });
  infoWindow = new google.maps.InfoWindow();
}

//get country data from https://corona.lmao.ninja/v2/countries
const getCountryData = () => {
  url = "https://corona.lmao.ninja/v2/countries";
  fetch(url)
    .then((response) => {
      //return response as json data
      return response.json();
    })
    .then((data) => {
      // if resolve => get response.json data
      showDataOnMap(data);
      showDataInTable(data);
    });
};

const getHistoriesData = () => {
  url = "https://corona.lmao.ninja/v2/historical/all?lastdays=120";
  fetch(url)
    .then((response) => {
      //return response as json data
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data);
      buildChart(chartData);
    });
};

const buildChartData = (data) => {
  let chartData = [];
  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }
  return chartData;
};

const showDataOnMap = (data) => {
  data.map((country) => {
    //get center of city from data countryinfo of api
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };
    //google map define the circle mark on map
    var countryCircle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      // radius: Math.sqrt(country.cases) * 100
      radius: 80000+country.recoveredPerOneMillion*10,
    });

    var html = `
        <div class="info-container">
            <div class="info-flag">
                <img src ="${country.countryInfo.flag}"
            </div>
            <div class="info-name">
                ${country.country}
            </div>
            <div class="info-confirmed">
                ${country.cases}
            </div>
            <div class="info-recovered">
                ${country.recovered}
            </div>
            <div class="info-deaths">
                ${country.deaths}
            </div>
        </div>
        `;

    //mouse move in/out show/close info of country
    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    google.maps.event.addListener(countryCircle, "mouseover", () => {
      infoWindow.open(map);
    });
    google.maps.event.addListener(countryCircle, "mouseout", () => {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";

  data.forEach((country) => {
    html += `
        <tr>
            <td>${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>    
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};

const buildChart = (chartData) => {
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "transparent",
          borderColor: "#1d2c4d",
          data: chartData,
        },
      ],
    },
    // Configuration options go here
    options: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
            scaleLabel: {
              display: true,
              labelString: "Date",
            },
          },
        ],
        yAxes: [
          { scaleLabel: {
            display: true,
            labelString: "Cases",
          },
            ticks: {
              callback: function (value, index, values) {
                return numeral(value).format("0,0");
              },
            },
          },
        ],
      },
    },
  });
};
