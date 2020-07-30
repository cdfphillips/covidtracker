var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];

//Set the default for search location to WorldWide - semantic ui
const worldWideSelection = {
  name: 'Worldwide',
  value:  'www',
  selected: true
}

var casesTypeColors = {
  cases: '#1d2c4d',
  active: '#9d80fe',
  recovered: '#7dd71d',
  deaths: '#fb4443'
}

const mapCenter = {
  lat: 25.025885, 
  lng: -78.035889
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.025885, lng: -78.035889}, 
    zoom: 3,  //make zoom 3 instead of 8
    styles: mapStyle,
     
      
  });
  
  //Define infoWindow for google.maps.event.addListener in function Showmap
  infoWindow = new google.maps.InfoWindow();

  window.onload = () => {
      getCountriesData();
      //showDataInChart();
      getHistoricalData();
      getWorldCoronaData(); //For pie chart
     
      
    } 
}  


const changeDataSelection = (element, casesType) => {
  console.log(casesType);
  console.log(mapCircles);

 //Clear the map
  clearTheMap();

 //Show Data on Map
  showDataOnMap(coronaGlobalData,casesType);
  setActiveTab(element);


}

const setActiveTab = (element) => {
  const activeElement = document.querySelector('.card.active');
  activeElement.classList.remove('active');
  // element.classList.toggle("active");
  element.classList.add("active");
}

const clearTheMap = () => {
  for(let circle of mapCircles){
    circle.setMap(null);
  }
}


//Set the map center when you search for an individual country
const setMapCenter = (lat, long, zoom) => {
  map.setZoom(zoom);
  map.panTo({
    lat: lat,
    lng: long,
  })

}
//To initialize semantic ui search dropdown
const initDropdown = (searchList) => {
  $('.ui.dropdown').dropdown({
    values: searchList,
    onChange: function(value,text){
      if(value !==worldWideSelection.value){
        getCountryData(value);
      }else{
        getWorldCoronaData();
      }
   }
  }); 
}

//Set Search Location By Country List
const setSearchList = (data) => {
  let searchList = [];
  searchList.push(worldWideSelection);
  data.forEach((countryData) =>{
    searchList.push({
      name: countryData.country,
      value:  countryData.countryInfo.iso3,
    })
  })
 initDropdown(searchList);
}


const getIndividualCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
  .then((response)=>{
     return response.json();
  }).then((data)=>{
 
      showIndividualCountryDataInTable(data);
      
  })
}

//All countries data
const getCountriesData = () => {
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        //console.log(response);
        return response.json();
    }).then((data)=>{
        console.log(data);
        coronaGlobalData = data;
        setSearchList(data);
        showDataOnMap(data);
        showDataInTable(data);
    })
}

//One country's data
getCountryData = (countryIso) => {
  const url = "https://disease.sh/v3/covid-19/countries/" + countryIso;
  fetch(url)
  .then((response)=>{
     return response.json();
  }).then((data)=>{
    setMapCenter(data.countryInfo.lat, data.countryInfo.long, 3);
    console.log(data);
    setStatsData(data);
    showIndividualCountryDataInTable(data);
  })

}


//Get data for Pie Chart and Cards
const getWorldCoronaData = () =>{
  fetch("https://disease.sh/v2/all")
    .then((response)=>{
        console.log(response);
        return response.json();
    }).then((data)=>{
       console.log(data);
       buildPieChart(data);
       setStatsData(data);
       setMapCenter(mapCenter.lat, mapCenter.lng, 1);
    })
}


const setStatsData = (data) => {

  let addedActiveCases =numeral(data.todayCases).format('+0,0');
  let addedRecovered =numeral(data.todayRecovered).format('+0,0');
  let addedDeaths=numeral(data.todayDeaths).format('+0,0');

  let sumCases = data.todayCases + data.todayRecovered + data.todayDeaths;
  let addedCases =numeral(sumCases).format('+0,0');

  let totalCases =numeral(data.cases).format('0,0a');
  let totalActiveCases =numeral(data.active).format('0,0a');
  let totalRecovered =numeral(data.recovered).format('0,0a');
  let totalDeaths=numeral(data.deaths).format('0,0a');

  document.querySelector('.total-number').innerHTML = addedCases;
  document.querySelector('.active-number').innerHTML = addedActiveCases;
  document.querySelector('.recovered-number').innerHTML = addedRecovered ;
  document.querySelector('.deaths-number').innerHTML = addedDeaths;

  document.querySelector('.cases-total').innerHTML = `${totalCases} Total`;
  document.querySelector('.active-total').innerHTML = `${totalActiveCases} Total`;
  document.querySelector('.recovered-total').innerHTML = `${totalRecovered} Total` ;
  document.querySelector('.death-total').innerHTML = `${totalDeaths} Total`;
 }

const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response)=>{
     return response.json();
    }).then((data)=>{
      console.log(data);
        let chartDataCases = buildChartDataCases(data);
        let chartDataRecovered = buildChartDataRecovered(data);
        let chartDataDeaths = buildChartDataDeaths(data);
        showDataInChart(chartDataCases,chartDataRecovered,chartDataDeaths);
      
  })
}

const showIndividualCountryDataInTable = (data) =>
{
console.log("Worldwide selection value: ", worldWideSelection.value);
  // var input = document.getElementById('country-name').value;
     //var input = document.getElementById('country').value;
  
  // if(!input){
  //     return;
  // }
    
  if(worldWideSelection.value === 'www'){
      return;
  }

  //console.log(input);
  var html = '';
  var strCases = '';
  var strRecovered = '';
  var strDeaths = '';
  var strTests = '';
  let countryName='';
  let cases='';
  let deaths='';
  let tests='';
      data.forEach((country)=>{
          if(input === country.country){
          countryName = country.country;
          console.log(countryName);
          cases = country.cases;
          strCases = numeral(cases).format('0,0');
          recovered = country.recovered;
          strRecovered = numeral(recovered ).format('0,0');
          deaths = country.deaths;
          strDeaths = numeral(deaths).format('0,0');
          tests = country.tests;
          strTests = numeral(tests).format('0,0');
        
          html += `
              <tr>
                
                  <td>${countryName}</td>
                  <td>${strCases}</td>
                  <td>${strRecovered}</td>
                  <td>${strDeaths}</td>
                  <td>${strTests}</td>
              </tr>
            `
            document.getElementById('table-data').innerHTML = html; 
          }else{
            console.log("No luck baby!");
          }
   })
           
}



const showDataOnMap = (data, casesType="cases") => {
    
    data.map((country)=>{
        //Define center for countryCircle object
        let countryCenter = {
        lat: country.countryInfo.lat,
        lng: country.countryInfo.long,
        }

        
          // Add the circle for this city to the map-copied from Google circles
          var countryCircle = new google.maps.Circle({
            strokeColor: casesTypeColors[casesType],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: casesTypeColors[casesType],
            fillOpacity: 0.35,
            map: map,
            center: countryCenter,
            radius: Math.sqrt(country[casesType]) * 500 //instead of country.cases change to casesType
            //radius: Math.sqrt(country.casesPerOneMillion) * 15
          });

          //Push markers to global array at top so that we clear them later 
          mapCircles.push(countryCircle);
           
          let countryName = country.country;
          let cases = numeral(country.cases).format('0,0');
          let recovered = numeral(country.recovered).format('0,0');
          let deaths = numeral(country.deaths).format('0,0');
          let flag = country.countryInfo.flag;
          console.log("Country is: " + countryName  + "Cases is: ", deaths);
            /**   <img src="${flag}" YOU CAN DEFINE AN INLINE STYLE INSTEAD*/
          var html = `
                <div class="info-container">
                    <div class="info-flag" style="background-image: url(${flag})";>
                     
                    </div>
                    <div class="info-name">
                        ${countryName} Totals
                    </div>
                    <div class="info-confirmed">
                       Cases:  ${cases}
                    </div>
                    <div class="info-recovered">
                       Recovered:  ${recovered}
                    </div>
                    <div class="info-deaths">
                      Deaths:  ${deaths}
                    </div>

                </div>
          `
          var infoWindow = new google.maps.InfoWindow({
              content: html,
              position: countryCircle.center,
          })
          
      
        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            infoWindow.open(map);
        });

        google.maps.event.addListener(countryCircle, 'mouseout', function() {
            infoWindow.close();
        });
    })
}

const showDataInTable = (data) => {
    var html = '';
    var strCases = '';
    var strRecovered = '';
    var strDeaths = '';
    var strTests = '';
      data.forEach((country)=>{
          
          let countryName = country.country;
          let cases = country.cases;
          strCases = numeral(cases).format('0,0');
          let recovered = country.recovered;
          strRecovered = numeral(recovered ).format('0,0');
          let deaths = country.deaths;
         
          strDeaths = numeral(deaths).format('0,0');
          let tests = country.tests;
          strTests = numeral(tests).format('0,0');
            
          html += `
          <tr>
              <td>${countryName}</td>
              <td>${strCases}</td>
              <td>${strRecovered}</td>
              <td>${strDeaths}</td>
              <td>${strTests}</td>
          </tr>
        `
      document.getElementById('table-data').innerHTML = html;     
     })
}

const showDataInChart = (chartDataCases,chartDataRecovered,chartDataDeaths) => {

  var ctx = document.getElementById('myChart').getContext('2d');
  var timeFormat = 'MM/DD/YYYY';
  var chart = new Chart(ctx, {
        type: 'line',

        data: {
                datasets: [{
                label: 'Worldwide' ,
                backgroundColor: '#1d2c4d',
                borderColor: '#1d2c4d',
                data: chartDataCases,
            },
            {
              label: 'Recovered',
              backgroundColor: '#7dd71d',
              borderColor: '#7dd71d',
              data: chartDataRecovered,
            },
            {
              label: 'Deaths',
              backgroundColor: '#fb4443',
              borderColor: '#fb4443',
              data: chartDataDeaths,
            }
          ]
        },

        // Configuration options go here
        //Copied from https://embed.plnkr.co/JOI1fpgWIS0lvTeLUxUp/
        options: {
          maintainAspectRatio: false,
          //tooltips - The second you move over any part of the chart you see data
          tooltips: {
            mode: 'index',
            intersect: false
        },
          scales: {
              xAxes: [{
                  type:"time",
                  time:  {
                      format: timeFormat,
                      tooltipFormat: 'll',
                      unit: 'day',
                  },
                 
              }],
              
              yAxes: [{
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                    return numeral(value).format('0,0');
                    }
                }
            }]
          }
      }
  });
}

