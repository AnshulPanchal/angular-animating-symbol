import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
declare var google: any;

@Component({
  selector: 'animating-symbol',
  templateUrl: './animating-symbol.component.html',
})
export class AnimatingSymbolComponent implements AfterViewInit {
  map: google.maps.Map;
  tripPolyline: any;
  lat: number = 23.61;
  lgt: number = 80.49;
  zoomLevel: number = 3.5;
  startInterval = null;
  count: number = 0;
  timeToTraverse :number= 20;
  icon :any;

  constructor()
   {
   }

  ngAfterViewInit() {
    this.initializeMap();
    var driverPath = [
      new google.maps.LatLng(12.9177, 77.6233),
      new google.maps.LatLng(12.9226, 77.6174),
      new google.maps.LatLng(12.9225, 77.6227),
      new google.maps.LatLng(12.9308, 77.6199),
      new google.maps.LatLng(12.9385, 77.6308)
    ];
   this.createPolyline(driverPath);
  }

  initializeMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 12.9177, lng: 77.6233 },
      zoom: 14
    });
   this.icon = {
    path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z',
    scale: 0.45,
    strokeOpacity: 1,
    fillOpacity: 1,

    fillColor: '#FF0000',
    strokeWeight: 1,
    anchor: new google.maps.Point(25, 50)
  };
  }


  createPolyline(tripCoordinates) {
    this.tripPolyline = new google.maps.Polyline({
      path: tripCoordinates,
      geodesic: true,
      strokeColor: '#0000FF',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      icons: []

    });
    this.tripPolyline.setMap(this.map);
  }

  // Use the DOM setInterval() function to change the offset of the symbol new MarkerIcon,
  // at fixed intervals.
  animateCircle(line) {
    line.icons = [{
      icon: this.icon
    }];
    this.startInterval = window.setInterval(() => {
      this.count = (this.count + 1) % 200;
      let icons = line.get('icons');
      icons[0].offset = (this.count / 2) + '%';
      if (icons[0].offset == '0%') {
        this.stopVehicle();
        return;
      }
      line.set('icons', icons);
    }, 50);
  }

  calculateSpeed(time, line) {
    let timeValue = time; //time in seconds
    let updateCountInterval = 50;
    let cycles = timeValue / updateCountInterval;  //here cycles value is the number of cycles to complete 100% offset value of icon

    let valueOfOneCycle = 100 / cycles;
    let divideCountValue = 1 / valueOfOneCycle;   //here this value refers to 2 which is the value which will divide the count value to set offset value

    let modulusCountValue = divideCountValue * 100;
    this.startVehicleMovement(line, divideCountValue, modulusCountValue);
  }

  startVehicleMovement(line, divideCountValue, modulusCountValue) {
    line.icons = [{
      icon: this.icon,
      optimized: false
    }];
    this.startInterval = window.setInterval(() => {
      this.count = (this.count + 1) % modulusCountValue;
      let icons = line.get('icons');
      icons[0].offset = (this.count / divideCountValue) + '%';
      if (icons[0].offset == '0%') {
        this.stopVehicle();
        return;
      }
      line.set('icons', icons);
    }, 50);
  }

  startVehicle() {
    let timeInMiliSec  = this.timeToTraverse *1000//converts seconds to miliseconds
    this.calculateSpeed(timeInMiliSec, this.tripPolyline);
  }

  pauseVehicle() {
    if (this.startInterval) {
      clearInterval(this.startInterval);
    }
    this.startInterval = null;
  }

  stopVehicle() {
    if (this.startInterval) {
      clearInterval(this.startInterval);
    }

    this.startInterval = null;
    this.count = 0;
    let icons = this.tripPolyline.get('icons');
    icons[0].offset = '0%';
    this.tripPolyline.set('icons', icons);

  }

  ngOnDestroy() {
    if (this.startInterval) {
      clearInterval(this.startInterval);
    }
  }

}