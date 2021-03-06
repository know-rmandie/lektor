$.getJSON("./data/data-ville-durable.geojson", function(data) {
  var sources = "sources : " + data.metadata.source + " - " + data.metadata.date;
  var context = "map";
  var radius;
  var Couches = new Array;
  var tiles = {};
  for (i in fonds) {
    var couche = new L.TileLayer(fonds[i].url, {
      attribution: sources + fonds[i].attrib,
      minZoom: fonds[i].zMin,
      maxZoom: fonds[i].zMax,
      unloadInvisibleTiles: true
    });
    Couches[fonds[i].id] = couche;
    tiles[fonds[i].nom] = couche
  }(function($) {
    $(function() {
      setTimeout(function() {
        if (L) letsStart()
      }, 250)
    })
  })(jQuery);

  function letsStart() {
    if (document.location.href.match(/carteSeule/g)) {
        context = "full";
        knwrmdZoom = 9;
        $("body").addClass("carteSeule");
    }
    $(window).resize(function() {
      clearTimeout(window.resizedFinished);
      window.resizedFinished = setTimeout(function() {
        getWidth(context);
        $("#map").css("width", rW).css("height", rH)
      }, 250)
    });
    getWidth(context);
    console.log(rW)
    $("#map").css("width", rW).css("height", rH);
    if (!knwrmdZoom) knwrmdZoom = Math.sqrt(rW) / 3.75;
    carte = L.map("map").setView([knwrmdLat,
      knwrmdLong
    ], Math.round(knwrmdZoom));
    for (i in fonds) {
      var couche = new L.TileLayer(fonds[i].url, {
        attribution: sources + fonds[i].attrib,
        minZoom: fonds[i].zMin,
        maxZoom: fonds[i].zMax,
        unloadInvisibleTiles: true
      });
      Couches[fonds[i].id] = couche;
      tiles[fonds[i].nom] = couche
    }
    if (knwrmdFond == null) knwrmdFond = fonds[0].id;
    Couches[knwrmdFond].addTo(carte);
    var HtmlLeg = new Array;
    HtmlLeg["Labellisation"] = '<div style="background-color:white;border:1px solid #ddd;opacity:0.8;padding:5px">';
    HtmlLeg["Avancement"] = '<div style="background-color:white;border:1px solid #ddd;opacity:0.8;padding:5px">';
    var Labellisation = [{
      "id": "caap",
      "icone": "la0-aap",
      "string": "candidat aux appels \u00e0 projet (2009 et 2011)"
    }, {
      "id": "clab",
      "icone": "la1-clab",
      "string": "candidat au label"
    }, {
      "id": "elab",
      "icone": "la2-elab",
      "string": "<i>engag\u00e9</i> dans la d\u00e9marche de labellisation"
    }, {
      "id": "label",
      "icone": "la3-label",
      "string": "projet labellis\u00e9 \u00e9coquartier"
    }, {
      "id": "autres",
      "icone": "la9-autre",
      "string": "autres projets"
    }];
    var PinCat = new Array;
    for (i in Labellisation) {
      var url = Labellisation[i].icone + ".png";
      PinCat[Labellisation[i].id] = L.icon({
        iconUrl: "./img/" + url,
        iconRetinaUrl: "./img/" + url,
        iconSize: [20, 38],
        iconAnchor: [15, 38],
        popupAnchor: [-5, -39],
        shadowUrl: "./img/la-ombre.png",
        shadowRetinaUrl: "./img/la-ombre.png",
        shadowSize: [40, 20],
        shadowAnchor: [0, 20]
      });
      HtmlLeg["Labellisation"] += '<img src="./img/' + url + '" style="height:16px"/>&nbsp;' + Labellisation[i].string + "<br/>"
    }
    HtmlLeg["Labellisation"] += "</div>";
    var Avancement = [{
      "id": "intention",
      "icone": "av0-int",
      "string": "intention d'\u00e9coquartier"
    }, {
      "id": "études",
      "icone": "av1-etu",
      "string": "projet à l'étude"
    }, {
      "id": "projet",
      "icone": "av1-pro",
      "string": "\u00e9coquartier en projet"
    }, {
      "id": "chantier",
      "icone": "av2-chan",
      "string": "\u00e9coquartier en chantier"
    }, {
      "id": "r\u00e9alis\u00e9",
      "icone": "av3-real",
      "string": "\u00e9coquartier r\u00e9alis\u00e9"
    }, {
      "id": "abandonn\u00e9",
      "icone": "av0-aba",
      "string": "projet abandonn\u00e9"
    }, {
      "id": "inconnu",
      "icone": "avx-inc",
      "string": "avancement inconnu"
    }];
    // icones de la bibliothèque material associés aux avancements
    let MIcon = [];
      MIcon["intention"] = "lightbulb_outline";
      MIcon["études"] = "menu_book";
      MIcon["projet"] = "edit";
      MIcon["chantier"] = "fast_forward";
      MIcon["r\u00e9alis\u00e9"] = "done_outline";
      MIcon["abandonn\u00e9"] = "error";
      MIcon["inconnu"] = "help_outline";
    var PinAv = new Array;
    for (i in Avancement) {
      var url = Avancement[i].icone + ".png";
      PinAv[Avancement[i].id] = L.icon({
        iconUrl: "./img/" + url,
        iconRetinaUrl: "./img/" + url,
        iconSize: [29, 37],
        iconAnchor: [20, 37],
        popupAnchor: [-6, -32],
        shadowUrl: "./img/av-ombre.png",
        shadowRetinaUrl: "./img/av-ombre.png",
        shadowSize: [37, 23],
        shadowAnchor: [0, 20]
      });
      HtmlLeg["Avancement"] += '<img src="./img/' + url + '" style="height:20px"/>&nbsp;' + Avancement[i].string + "<br/>"
    }
    HtmlLeg["Avancement"] += "</div>";
    var ecoQlabel = L.markerClusterGroup({
      name: "ecoQlabel",
      maxClusterRadius: function() {
        return (clusterRadius - 50) / 9 * carte.getZoom() +
          50 - (clusterRadius - 50) / 9
      },
      iconCreateFunction: function(cluster) {
        var cC = cluster.getChildCount();
        var cS = Math.sqrt(cC) * carte.getZoom() * carte.getZoom() / 250 * clusterRadius;
        if (cS < 25) cS = 25;
        var cF = cS / 2;
        if (cF < 12) cF = 12;
        return new L.DivIcon({
          html: '<div style="width:' + cS + "px;height:" + cS + "px;font-size:" + cF + "px;background-color:hsla(270," + 2 * Math.sqrt(cC) * carte.getZoom() + '%,40%,0.5)"><div><span style="line-height:' + cS + 'px">' + cC + "</span></div></div>",
          className: "marker-cluster marker-cluster-" + cC,
          iconSize: new L.Point(cS,
            cS)
        })
      }
    });
    ecoQlabel.name = "ecoQlabel";
    var ecoQavancement = L.markerClusterGroup({
      name: "ecoQavancement",
      maxClusterRadius: function() {
        return (clusterRadius - 50) / 9 * carte.getZoom() + 50 - (clusterRadius - 50) / 9
      },
      iconCreateFunction: function(cluster) {
        var cC = cluster.getChildCount();
        var cS = Math.sqrt(cC) * carte.getZoom() * carte.getZoom() / 250 * clusterRadius;
        if (cS < 25) cS = 25;
        var cF = cS / 2;
        if (cF < 12) cF = 12;
        return new L.DivIcon({
          html: '<div style="width:' + cS + "px;height:" + cS + "px;font-size:" + cF + "px;background-color:hsla(170," + 2 * Math.sqrt(cC) *
            carte.getZoom() + '%,40%,0.5)"><div><span style="line-height:' + cS + 'px">' + cC + "</span></div></div>",
          className: "marker-cluster marker-cluster-" + cC,
          iconSize: new L.Point(cS, cS)
        })
      }
    });
    ecoQavancement.name = "ecoQavancement";
    var dataEQ = data.features;
    for (i in dataEQ)
      if (document.location.href.match(/tousProjets/g) || document.location.href.match(/adminView/g) || !dataEQ[i].properties.Acom.includes("archiv\u00e9")) {
        var html = "<h6>" + dataEQ[i].properties.commune + " - " + dataEQ[i].properties.name + "</h6>";
        if(MIcon[dataEQ[i].properties.Aetat]) html += '<i class="material-icons">' + MIcon[dataEQ[i].properties.Aetat] + '</i> '+ dataEQ[i].properties.Aetat + '<br/>';
        else html += '<i class="material-icons">help_outline</i> ?';
        /*
        html += '<i class="avct ' +
          dataEQ[i].properties.Aetat + '">' + dataEQ[i].properties.Aetat + "</i>";*/
        var ha = dataEQ[i].properties.Isurf,
          logts = dataEQ[i].properties.Ilogmt;
        if (ha == "NULL");
        else html += "<br/>" + ha + " ha, ";
        if (logts == "NULL");
        else html += "<br/>" + logts + " logements,";
        var inter = dataEQ[i].properties.Rter,
          intra = dataEQ[i].properties.Rtra;
        if (inter == "NULL");
        else html += "<br/>-&nbsp;<a href=" + inter + '" target="_blank">internet</a>';
        if (intra == "NULL" || document.location.href.match(/adminView/g) == null);
        else html += '<span class="intranet"><br/>-&nbsp;<a href="' +
          intra + '" target="_blank">intranet</a></span>';
        var iconeCat, iconeAv;
       if (!dataEQ[i].properties.Lcat || !PinCat[dataEQ[i].properties.Lcat]) {
iconeCat = PinCat["autres"];
}
        else iconeCat = PinCat[dataEQ[i].properties.Lcat];
        if (!dataEQ[i].properties.Aetat || !PinAv[dataEQ[i].properties.Aetat]) iconeAv = PinAv["inconnu"];
        else iconeAv = PinAv[dataEQ[i].properties.Aetat];
        var pointCat = (new L.marker([dataEQ[i].geometry.coordinates[1], dataEQ[i].geometry.coordinates[0]], {
          icon: iconeCat
        })).bindPopup(html);
        ecoQlabel.addLayer(pointCat);
        var pointAv = (new L.marker([dataEQ[i].geometry.coordinates[1],
          dataEQ[i].geometry.coordinates[0]
        ], {
          icon: iconeAv
        })).bindPopup(html);
        ecoQavancement.addLayer(pointAv)
      } var legende = L.control({
      position: "bottomleft"
    });
    legende.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
      div.setAttribute("id", "legende");
      div.innerHTML = "";
      return div
    };
    legende.addTo(carte);
    var couchesControl = {
      "Labellisation": ecoQlabel,
      "Avancement": ecoQavancement
    };
    var WMultip = new Array;
    WMultip["Labellisation"] = 4;
    WMultip["Avancement"] = 6;
    var coucheActive = "vide";
    if (document.location.href.match(/adminView/g)) {
      var onMapClick =
        function(e) {
          var coo = e.latlng;
          var cooTxt = coo.toString().split("(")[1].split(")")[0];
          if (listCoord === "") listCoord = "Derniers points cliqu\u00e9s :<br/>";
          listCoord += cooTxt + ";";
          document.getElementById("listCoord").innerHTML = listCoord;
          popup.setLatLng(coo).setContent("point : " + cooTxt).openOn(carte)
        };
      var popup = L.popup();
      var listCoord = "";
      carte.on("click", onMapClick);
      carte.on("dblclick", function() {
        listCoord = ""
      });
      var RgeIgn = L.tileLayer.wms("http://georef.application.i2/cartes/mapserv?", {
        layers: "fonds_nb",
        format: "image/png",
        transparent: true,
        attribution: "&copy; IGN 2014"
      });
      Couches["RgeIgn"] = RgeIgn;
      tiles["IGN (r\u00e9seau i\u00b2)"] = RgeIgn;
      var selecteur1 = L.control.layers(tiles);
      selecteur1.addTo(carte);
      var selecteur2 = L.control.layers(couchesControl);
      selecteur2.addTo(carte);
      document.getElementById("aide").setAttribute("style", "display:block")
    } else {
      var selecteur = L.control.layers(couchesControl);
      selecteur.addTo(carte)
    }

    function affLegende(nom) {
      document.getElementById("legende").innerHTML = HtmlLeg[nom]
    }
    var Overlays = new Array;
    Overlays["Labellisation"] = 0;
    Overlays["Avancement"] = 0;
    carte.on("baselayerchange", function(layer) {
      for (var i in couchesControl)
        if (i != layer.name && carte.hasLayer(couchesControl[i])) carte.removeLayer(couchesControl[i]);
      coucheActive = layer.name;
      affLegende(layer.name)
    });
    carte.addLayer(ecoQlabel)
  }
});
