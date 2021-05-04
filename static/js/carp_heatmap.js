var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    hash: true,
    scrollZoom: true,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

d3.csv("static/data/carp_members.csv", function(response){
    
    var heatArray = [];

    for (var i = 0; i < response.length; i++) {
        heatArray.push([response[i].lat, response[i].lng]);
    }

    var heat = L.heatLayer(heatArray, {
        radius: 45,
        blur: 60
    });
    
    d3.csv("static/data/Dignity_Master_Location_List_latlng.csv", function(data){
        
    // Create a new marker cluster group
    var markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        singleMarkerMode: false,
            disableClusteringAtZoom: 18,
            polygonOptions: {
                color: '#dbd2c5',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
            },
    
            iconCreateFunction: function(cluster) {
                var count = cluster.getChildCount();
                
                var digits = (count+'').length;
        
                return new L.DivIcon({
                    html: count,
                    className:'cluster2 digits-'+digits,
                    iconSize: null
                });
            },});
        
            var dignityIcon = L.icon.glyph ({ 
                prefix: 'mdi', 
                glyph: 'leaf' });
    
    // Loop through data
    for (var i = 0; i < data.length; ++i) {

        var popup = data[i].Location_Name + "<br>" + data[i].Physical_Address + "<br>" + data[i].Physical_City + ", " + data[i].Physical_State + "  " + data[i].Physical_Zip

        var m = L.marker([data[i].lat, data[i].lng], {icon: dignityIcon})
        .bindPopup(popup);

        markers.addLayer(m);
    }
    
    createMap(heat, markers)
    })
});


function createMap(heat, markers){
    var baseMaps = {
    "Street Map": streetMap
};

var overlayMaps = {
    "CARP Members": heat,
    "Dignity Stores": markers
};

var mymap = L.map("map", {
    center: [53.0221996, -95.859165],
    zoom: 4.4,
    layers: [streetMap, heat, markers]
}); 

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(mymap);
}