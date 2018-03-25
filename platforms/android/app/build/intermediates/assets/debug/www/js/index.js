
//AIzaSyAMhEmmBB-HOAguDVPpr2VujTnCXKZJzrk
//https://iserve-1521884084109.firebaseio.com/

/* file handler */

var getFileBlob = function (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            cb(xhr.response);
        });
        xhr.send();
};

var blobToFile = function (blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
};

var getFileObject = function(filePathOrUrl, cb) {
       getFileBlob(filePathOrUrl, function (blob) {
          cb(blobToFile(blob, filePathOrUrl));
       });
};


/* file handler end*/

function initFirebase(){
  var config = {
apiKey: "AIzaSyDLSdV7t6S3ZOf4-XPkbFpkDCT-DG8aOEI",
databaseURL:"https://iserve-1521884084109.firebaseio.com/",
authDomain:"iserve-1521884084109b.firebaseapp.com",
storageBucket:"gs://iserve-1521884084109.appspot.com"
};
firebase.initializeApp(config);
console.log("firebase initialized")
}
$(document).ready(function(){
initFirebase();
  $("#mapsparent").hide();
    $("#aboutus").hide();
    $("#letmeservepage").hide();
  controller = new slidebars();
     controller.init();
     console.log("intilized")
     $("#sidemenubtn").click(function(event){
       event.preventDefault();

       controller.toggle("id-1");
     })
     $("#getlocationbutton").click(function(event){
       alert("clicked")
       event.preventDefault();
       navigator.geolocation.getCurrentPosition(function(location){
         //alert(location.coords.latitude+" "+location.coords.longitude)
         lat_val=location.coords.latitude
         long_val=location.coords.longitude
         $("#formpage").hide();
         $("#mapsparent").show();
         alert(lat_val+" "+long_val)
         cords={'lat':lat_val,'lng':long_val}
         var map = new google.maps.Map(document.getElementById('mapsdiv'), {
         zoom: 16,
         center: cords,
       });
       var marker = new google.maps.Marker({
         position: cords,
         map: map
       });
       },function(err){
         alert("unable to get location")
       }
                                       );
     })
})
$("#saveinfo").click(function(event){
  event.preventDefault();
  foodpoint={'desc':$("#description").val(),'quantity':$("#howmuch").val(),'expiry':$("#expiry").val(),'location':cords,edibility:$("input[name='edible']:checked").val(),type:$("input[name='type']:checked").val(),'howto':$("#gettingthere").val(),'updatedon':String(Date()).slice(0,24)}
  console.log(foodpoint);
  latvalkey=String(cords.lat.toFixed(3)).replace(".","_")
  longvalkey=String(cords.lng.toFixed(3)).replace(".","_")
  datetime=String(Date()).slice(0,24);

  if(file){
    var storageRef=firebase.storage().ref("/images/"+latvalkey+longvalkey+datetime);
    var task=storageRef.put(file).then(function(snapshot){
      foodpoint.imgsrc=snapshot.downloadURL;
      //alert(snapshot.downloadURL);
      firebase.database().ref('foodpoints').child('fp'+latvalkey+longvalkey+datetime).set(foodpoint).then(function(snapshot){
        alert("You are amazing ! ")
        window.location.reload()
      })

    });
  }


  //save all data
})


$("#letmeservemenu").click(function(){
  $("#formpage").hide();
  $("#mapsparent").hide();
  $("#aboutus").hide();
  $("#letmeservepage").show();
  controller.toggle("id-1");

  $("#distancerange").on('input',function(){
$("#rangeval").html($(this).val());
  })

})
$("#fetchdata").click(function(){
  var foodsref = firebase.database().ref('foodpoints');
foodsref.on('value', function(snapshot) {

my_cords={lat:0.0,lng:0.0};
var r=parseInt($("#rangeval").val())%22;
 navigator.geolocation.getCurrentPosition(function(location){
   my_cords.lat=location.coords.latitude
   my_cords.lng=location.coords.longitude
   var map = new google.maps.Map(document.getElementById('outputmaps'), {
   zoom:5
 });
 var user_loc;

 count=0;
var infoWindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

 snapshot.forEach(function(childSnapshot) {
   var childData = childSnapshot.val();
     console.log("inrange")
     count+=1;
     var marker = new google.maps.Marker({
       position: childData.location,
       map: map,

       title:childData.desc
     });

     user_loc=childData.location
     //console.log(center)
     bounds.extend(marker.getPosition())
     map.fitBounds(bounds)
     google.maps.event.addListener(marker, 'click', (function(marker,childData) {
           return function() {
               infoWindow.setContent("<h6>"+childData.desc+"</h6> <img style='display:inline-block;float:right;' src='"+childData.imgsrc+" width='50px' height='50px'>"+childData.edibility+" - "+childData.quantity+"kg<br> Expiry in  "+childData.expiry+" days <br>"+childData.updatedon+"<br><a href='https://maps.google.com?q='"+childData.location.lat+","+childData.location.lng+">Take me there</a>");
               infoWindow.open(map, marker);
           }
       })(marker,childData));


 });
 console.log("setting center")
 console.log(my_cords)

 map.setCenter(my_cords)

 })






    // updates markers
  //  google.maps.event.trigger(map,'dragend');

});
})

$("#aboutpagemenu").click(function(){
  $("#aboutus").show();
  $("#letmeservepage").hide();
  $("#formpage").hide();
controller.toggle('id-1');
})

$("#uploadedimage").click(function(){
  navigator.camera.getPicture(function(result){
console.log(result);
var image = document.getElementById('uploadedimage');
getFileObject(result, function (fileObject) {
    file=fileObject;
});;
image.src =result;
alert(result)
},function(error){
  alert(error)
console.log(error);
} ,{
  quality:10,
  destinationType: Camera.DestinationType.FILE_URI
});
})
