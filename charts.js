const buildPieChart = (data) => {

    // For a pie chart
    var ctx = document.getElementById('myPieChart').getContext('2d');
    var myPieChart = new Chart(ctx, { //CTX is where the chart will be physically drawn
    type: 'pie',
    data: {
      datasets: [{
          data: [
            data.todayCases,
            data.todayRecovered,
            data.todayDeaths
          ],
          backgroundColor: [      //copy from charts.js...then click Github
            '#9d80fe',
            '#7dd71d',
            '#fb4443'
          ]
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          'Today Active',
          'Today Recovered',
          'Today Deaths'
      ]
  },
     options: {
       responsive: true,
        maintainAspectRatio: false,
     }
  
});
}

const buildChartDataCases = (data) => {
    let chartData = [];
  
    
        for(let date in data.cases){
            let newDataPoint = {
              x: date,
              y: data.cases[date]
            }
            //console.log(date);
            chartData.push(newDataPoint);
           
            }
            //console.log(chartData);
        return chartData;
  }
  
  
  const buildChartDataRecovered = (data) => {
    let chartData = [];

        for(let date in data.cases){
            let newDataPoint = {
              x: date,
              y: data.recovered[date]
            }
           
            chartData.push(newDataPoint);
           
            }
      
        return chartData;
  }
  
  const buildChartDataDeaths = (data) => {
    let chartData = [];
 
  
        for(let date in data.cases){
            let newDataPoint = {
              x: date,
              y: data.deaths[date]
            }
         
            chartData.push(newDataPoint);
           
            }
         
        return chartData;
  }