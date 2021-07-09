$(function(){
  var map = L.map('mapdiv', {
    minZoom: 6,
    maxZoom: 18,
  });
  var layer = L.tileLayer(
    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
       opacity: 0.6,
       attribution: '<a href="http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html" target="_blank">国土地理院</a>'
  });

  layer.addTo(map);

  var icon_color = ['red', 'darkred', 'lightred', 'orange', 'beige', 'green',
                    'darkgreen', 'lightgreen', 'blue', 'darkblue', 'lightblue',
                    'purple', 'darkpurple', 'pink', 'cadetblue', 'gray', 'lightgray'];

  var current_7 = '';
  var icon_n = 0;

  $.getJSON( 'poi.geojson', function(data) {
    var poiLayer = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {

        Object.keys(feature.properties).forEach( function(k){
          if( k == '七福神めぐりの名称' ) {
            if( feature.properties[k] != current_7 ) {
              current_7 = feature.properties[k];
              icon_n = Math.floor( Math.random() * icon_color.length );
            }
          }
        });

        return L.marker(latlng, {
          icon: L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'circle-o',
            markerColor: icon_color[icon_n]
          })
        }).bindPopup(
          function() {
            tr = '<table border>';
            Object.keys(feature.properties).forEach( function(k){
              var v = feature.properties[k];
              if( typeof(v) == 'string' && v.indexOf('http') === 0) {
                tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   '<a href="' + v + '" target="_blank">' + 
                   v + '</a>' +
                   '</td></tr>';
              } else if ( typeof(v) == 'string' && v != '' ) {
                tr = tr + 
                   '<tr><td style="white-space: nowrap;">' + 
                   k + 
                   '</td><td style="white-space: nowrap;">' +
                   feature.properties[k] + 
                   '</td></tr>';
              }
            });
            return tr + '</table>';
          }
        );
      }
    }).addTo(map);

    map.fitBounds(poiLayer.getBounds());
  });

  L.easyButton('fa fa-info fa-lg',
    function() {
      $('#about').modal('show');
    },
    'このサイトについて',
    null, {
      position:  'bottomright'
    }).addTo(map);

});
