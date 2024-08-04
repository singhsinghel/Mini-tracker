const socket=io(); //gives a connection request to server

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
       const {latitude,longitude}=position.coords;
       socket.emit('send-location',{latitude , longitude});
    }
    ,(error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0 //no cache
    }
)
}
else {
    console.error('Geolocation is not supported by this browser.');
}
const map=L.map('map').setView([0,0],17); 
//L is an instance of leafnote. L.map('map') asks for permission of location. setView sets the coordinates and zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Ankit"
}).addTo(map);

const markers={};
socket.on('receive-location',(data)=>{
 const {id,latitude,longitude}=data;
 map.setView([latitude,longitude]);
 if(markers[id]){
    markers[id].setLatLang([latitude,longitude]);
 }
 else{
    markers[id]=L.marker([latitude,longitude]).addTo(map);
 }
});

socket.on('user-disc',(id)=>{
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
})