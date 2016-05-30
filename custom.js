
var map = L.map('map').setView([-40.966, 172.763], 6);


L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//map colors

function getColor(d) {
    return d > 5000000 ? '#1CCAC0' :
           d > 4000000 ? '#41D2AA' :
           d > 3000000  ? '#66DA95' :
           d > 2000000  ? '#8BE280' :
           d > 1000000   ? '#B0EA6B' :
           d > 500000   ? '#D5F256' :
           d > 100000   ? '#FAFB41' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.population),
        weight: 2,
        opacity: 1,
        color: '#d7d7d7',
        dashArray: '7',
        fillOpacity: 0.7
    };
}

//Interaction layer

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties); //update info box hover
}

var geojson; //make into a varible so we can reset the layer style

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>NZ Sheep population 2015</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.population + ' sheeps '
        : 'Hover over a region');
};

info.addTo(map);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [100000, 500000, 1000000, 2000000, 3000000, 4000000, 5000000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
geojson = L.geoJson(regions, {
	style: style,
    onEachFeature: onEachFeature // Add listerner to our region layers
}).addTo(map);	      



