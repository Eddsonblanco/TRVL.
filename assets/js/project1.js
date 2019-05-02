//hide widget on page load
$("#dump-safety-here").hide();
$("#dump-outdoor-here").hide();
$("#weather-here").hide();
$(".tripRow").hide();
$("#info").hide();
$("#dotOnLoad").hide();

//--------------------------------------WEATHER API ---------------------------------------->
function weatherApi(city){
var APIKey = "166a433c57516f51dfab1f7edaed8413";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
 "q=" + city + ",Burundi&units=imperial&appid=" + APIKey;

 console.log(queryURL);

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({
 url: queryURL,
 method: "GET"
})
 // We store all of the retrieved data inside of an object called "response"
 .then(function(response) {

   // Log the queryURL
   console.log(queryURL);

   // Log the resulting object
   console.log(response);

   // Transfer content to HTML

   $(".location").html("<h2>" + response.name + "</h2>").prepend('<i class="fas i fa-globe-americas"></i>');
   $("#CWeather").html(" Currently Weather").prepend('<i class="fas i fa-cloud-sun"></i>') 
   $(".wind").text(" Wind Speed: " + Math.floor(response.wind.speed)).prepend('<i class="fas i fa-wind"></i>') ; 
   $(".tmp-degree").text(" Temperature (F) " + Math.floor(response.main.temp) + "º").prepend('<i  class="fas i fa-temperature-high"></i>'); 
   $(".temperature-description").text( response.weather[0].description );

   $("#weather-here").show();
 });
};




//--------------------------------------onClick event---------------------------------------->
 $(document).on("click", "#btn-submit", function(event){
   event.preventDefault();
   var city = $("#destination").val().trim().split(" ").join("+");
  //  var citySafety = $("#destination").val().trim().split(" ").join("-");
   var cityOutdoors = $("#destination").val().trim().split(" ").join("-");
   var lower = cityOutdoors.toLowerCase();

   if (city === ""){
    alert("Must enter text in the box"); //NEED TO CHANGE TO SOMETHING OTHER THAN AN ALERT!!
    return false;
  }

   database.collection("cities").add({
     city: $("#destination").val().trim()
   });

   weatherApi(city);
   displayUnsplashImages(city);
   outdoorWidget(lower); 
  //  addCard(city);
  //safetyWidget(citySafety); (may add back at a later date)
  
  $("#destination").val("");

  // hide jumbotron on click
  $("header").fadeOut("slow");

  var cityTitle = city.toUpperCase();
  $('#tripName').html("YOUR TRIP TO " + cityTitle)
  
  $("#prevSearch").html("Previous Searches");
 
  $(".tripRow").show();
  $("#info").show();
  $("#dotOnLoad").show()
});

  //-----------deletes card on click---------------->
  $(document).on('click', '.delete-button', function(e){
    e.stopPropagation();
    $(this).closest("tr").remove();
    id = e.target.getAttribute("data-id");
    database.collection("cities").doc(id).delete();
    });

//--------------------------------------SAFETY WIDGET -------------------------------------->

// function safetyWidget(citySafety){
// //widget link changes via input
// $("a").attr("href", "https://teleport.org/cities/" + citySafety)

// //widget url changes via input 
// $('iframe').attr("id", "widget")
// $("#widget").attr('src',"https://teleport.org/cities/" + citySafety + "/widget/crime/?currency=USD")

// //display on click 
// $("#dump-safety-here").show();

// }

//--------------------------------------OUTDOORS WIDGET -------------------------------------->
function outdoorWidget(cityOutdoors){
  $("a.teleport-widget-link").attr("href", "https://teleport.org/cities/" + cityOutdoors)

//widget url changes via input 
$('iframe').attr("id", "widget")
$("#widget").attr('src', "https://teleport.org/cities/" + cityOutdoors + "/widget/outdoors/?currency=USD&citySwitcher=false")

//display on click 
$("#dump-outdoor-here").show();
   
}
//---------------------------------------------UNSPLASH API------------------------------------------------>
function displayUnsplashImages(city) {
  var queryURL = "https://api.unsplash.com/search/photos?page=1&query=" + city + "&client_id=98fa38e783accee54b2682447c53324d56d7375e2b0e7708a53172528b223ab7";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    $(".carousel-inner").empty();
    var results = response.results;
    for (var i = 0; i < results.length; i++) {
      var imgDiv = $("<div>");
      imgDiv.addClass("carousel-item");
      var showImage = $("<img>");
      showImage.attr("src", results[i].urls.regular +  "&w=1100&h=600");
      showImage.addClass("d-block");
      imgDiv.prepend(showImage);
 
      $(".carousel-inner").append(imgDiv);
    };
    $('.carousel-item').first().addClass('active');
  })
 }

//----------------------------------------FIREBASE----------------------------------->

var config = {
  apiKey: "AIzaSyCa4ZBcq_w_ZNknHJM4ZBKh1bWU8zzlnLU",
  authDomain: "trvl-93a60.firebaseapp.com",
  databaseURL: "https://trvl-93a60.firebaseio.com",
  projectId: "trvl-93a60",
  storageBucket: "trvl-93a60.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.firestore();

function displayCities(doc) {
  var newRow = $("<tr>").addClass("compare-city").attr("data-id", doc.id).append(
    $("<td>").text("You searched " + (doc.data().city)),
    $("<button>").text("x").addClass("delete-button").attr("data-id", doc.id),
    );
    $("#info").prepend(newRow)
    console.log(doc.data().city);
  }
 

  //-----------------KELLI'S CODE IN PROGRESS----------->
  // var tableRow= [];
  // console.log(tableRow);
  var newRow = $("<tr>").append(
    $("<td>").text((doc.data().city)),
    $("<button>").text("x").addClass("delete-button").attr("data-id", doc.id),
    );
    
// //-----------PRINT ONLY 5 TRIPS------------->
// for(let i=0; i <5; i++){
//     if(tableRow.length < 5){
//       $("#info").prepend(newRow)
//       tableRow.push(newRow)
//       console.log("works")
//     } else {
//       alert("over 5")
//       tableRow[0].empty();
//     }

//   }
// }
  database.collection("cities").onSnapshot(snapshot => {
    var changes = snapshot.docChanges();
    changes.forEach(change => {
      if (change.type == "added") {
        displayCities(change.doc);
      }
    })
  })

//---------------------PREVIOUS SEARCH CLICK-------------------//
$(document).on('click', '.compare-city', function(doc){
  var cityClick = (doc.data().city);
  console.log(cityClick);
})