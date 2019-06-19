Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

var ctx = document.getElementById("myAreaChart");
var NewUser = ""; var LoginUser = ""; var TotalUser = "";
if(document.getElementById("Node") != null){ Node = document.getElementById("Node").value; }
if(document.getElementById("Python") != null){ Python = document.getElementById("Python").value; }
if(document.getElementById("Java") != null){ Java = document.getElementById("Java").value; }
if(document.getElementById("Angular") != null){ Angular = document.getElementById("Angular").value; }
if(document.getElementById("Go") != null){ Go = document.getElementById("Go").value; }
if(document.getElementById("TotalUser")){ TotalUser = document.getElementById("TotalUser").value; }
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Node", "Python", "Java", "Angular", "Go", "Total Developers"],
    datasets: [{
      label: "Total",
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [Node, Python, Java, Angular, Go, TotalUser],
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
