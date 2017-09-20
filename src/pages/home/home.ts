import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as GoogleMapsLoader from 'google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 private map;
 private marker;
 private infowindow;
 private messagewindow;
 private ballard = {lat: 47.671051, lng: -122.376663};
 private apiKey: string = 'AIzaSyBhAuvgrrFRZ6lFvgan-KsYeGVZ-VgoI9o'
 public IsBlurred: boolean;

 constructor(public navCtrl: NavController) {
 	setTimeout(() => {
 		this.IsBlurred=!this.IsBlurred;
 	},3000);
 	this.IsBlurred = true;
 	GoogleMapsLoader.KEY = this.apiKey;
var self = this;
	GoogleMapsLoader.load((google) => {

        this.map = new google.maps.Map(document.getElementById('map'), {
          center: this.ballard,
          zoom: 13,
          styles: [
          {elementType: 'geometry', stylers: [{color: '#e1e9c9'}]},
          	{
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#95D1D4'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#347b7f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#B1D495'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#bbc0aa'}]
            },{
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#3e481e'}]
            }
          ]
        });

        this.map.data.loadGeoJson('http://jessie.local/returnGeoJSON.php', null, (data) => {
          
          this.map.data.setStyle({
          	icon:{path: google.maps.SymbolPath.CIRCLE,
            scale: 5}});
         
        });

        this.infowindow = new google.maps.InfoWindow({
          content: document.getElementById('form')
        });

        this.messagewindow = new google.maps.InfoWindow({
          content: document.getElementById('message')
        });

        google.maps.event.addListener(this.map, 'click', (event) => {
          this.marker = new google.maps.Marker({
            position: event.latLng,
            map: this.map,
            icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5
          }
          });

          google.maps.event.addListener(this.marker, 'click', () => {
            this.infowindow.open(this.map, this.marker);
          });
        });
	});

 	  }

 public saveData(nameVal, addVal, typeVal) {
        var name = encodeURI(nameVal);
        var address = encodeURI(addVal);
        var type = typeVal;
        var latlng = this.marker.getPosition();
        var url = 'http://jessie.local/phpsqlinfo_addrow.php?name=' + name + '&address=' + address +
                  '&type=' + type + '&lat=' + latlng.lat() + '&lng=' + latlng.lng();

        this.downloadUrl(url, (data, responseCode) => {

          if (responseCode == 200 && data.length <= 1) {
            this.infowindow.close();
            this.messagewindow.open(this.map, this.marker);
          }
        });
      }
      public downloadUrl(url, callback) {
        var request = (<any>window).ActiveXObject ?
            new (<any>window).ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function() {
          if (request.readyState == 4) {
            request.onreadystatechange = this.doNothing;
            callback(request.responseText, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }

      public doNothing () {
      }

}
