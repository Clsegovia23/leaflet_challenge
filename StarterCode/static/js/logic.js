// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
// JS variables are FUNCTION scoped
// JS Global Variables

d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function getColor(depth) {
    if (depth < 0) {
        return "#77FF33"
    } else if (depth < 10) {
        return "#6EAD2A"
    } else if (depth < 20) {
        return "#F6F92F"
    } else if (depth < 30) {
        return "#F9AC2F"
    } else if (depth < 40) {
        return "#F9471B"
    } else {
        return "#5D1200"
    }
};

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>Location: ${(feature.properties.place)}</p><p>Depth: ${(feature.geometry.coordinates[2])}`);
    }

    // size=features.properties.mag
    // color=feature.geometry.coordinates[2]


    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 3,
                fillOpacity: 0.85,
                stroke: true,
                color: "black",
                weight: 1,
                fillColor: getColor(feature.geometry.coordinates[2])
            })
        }
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.

    var gray = L.tileLayer("https://maps.omniscale.net/v2/grayscale-2510eeab/style.grayscale/{z}/{x}/{y}.png", {
        attribution: '&copy; 2022 &middot; <a href="https://maps.omniscale.com/" > Omniscale < /a> ' +
            '&middot; Map data: <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Depth of Epicenter</strong>'],
            example = [9, 15, 40, 60, 80, 99],
            categories = ['<10', '10-30', '31-50', '51-70', '71-90', '91+'];

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<i class = "circle" style = "background:' + getColor(example[i]) + '"></i> ' +
                    (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
        return div;
    };


    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        // layers: [street, earthquakes]
    });
    gray.addTo(myMap);
    earthquakes.addTo(myMap);
    legend.addTo(myMap);

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.


    // L.control.layers(baseMaps, overlayMaps, {
    //     collapsed: false
    // }).addTo(myMap);

    //

}