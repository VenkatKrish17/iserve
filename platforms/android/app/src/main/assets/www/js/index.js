
//AIzaSyAMhEmmBB-HOAguDVPpr2VujTnCXKZJzrk
//https://iserve-1521884084109.firebaseio.com/



function initFirebase(){
  var config = {
apiKey: "AIzaSyDLSdV7t6S3ZOf4-XPkbFpkDCT-DG8aOEI",
databaseURL:"https://iserve-1521884084109.firebaseio.com/",
authDomain:"iserve-1521884084109b.firebaseapp.com",
};
firebase.initializeApp(config);
alert("firebase initialized")
}
$(document).ready(function(){
initFirebase();
  $("#mapsparent").hide();
  var controller = new slidebars();
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
  foodpoint={'desc':$("#description").val(),'location':cords,edibility:$("input[name='edible']:checked").val(),type:$("input[name='type']:checked").val(),'howto':$("#gettingthere").val(),'updatedon':new Date()}
  console.log(foodpoint);
  latvalkey=String(cords.lat.toFixed(3)).replace(".","_")
  longvalkey=String(cords.lng.toFixed(3)).replace(".","_")
  firebase.database().ref('foodpoints/fp'+latvalkey+longvalkey).set(foodpoint)
  alert("You are amazing ! ")
  window.location.reload()
  //save all data
})


$("#letmeservemenu").click(function(){
  $("#formpage").hide();
  $("#mapsparent").hide();
  $("#letmeservepage").show();
  controller.toggle("id-1");

  $("#distancerange").change(function(){
$("#rangeval").html($(this).val());
  })
})
