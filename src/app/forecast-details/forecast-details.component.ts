import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WeatherService } from '../service/weather.service';
import { ForecastData } from './forecastData';


@Component({
  selector: 'app-forecast-details',
  templateUrl: './forecast-details.component.html',
  styleUrls: ['./forecast-details.component.scss']
})

export class ForecastDetailsComponent implements OnInit, OnDestroy {

  zipCode!: string;
  days!: string;
  forCastDataForZip: any;
  private subscription = new Subscription();
  filteredForeCastList = [];
  storeForecast:any;
  constructor(
    private activatedroute: ActivatedRoute,
    private weatherService: WeatherService
  ) {
    this.activatedroute.params.subscribe((data) => {
      this.zipCode = data['zipcode'];
      this.days = data['days'];
    });
  }


  ngOnInit() {
    let data:any = localStorage.getItem('forecastDetails')
    data = JSON.parse(data)
    if(!!localStorage.getItem('forecastDetails')){
      if(this.zipCode == data.zipcode){
        this.forCastDataForZip = data.forecastDetails
      }else{
        this.getFiveDaysForecast(this.zipCode);
      }
    }
    else{
      this.getFiveDaysForecast(this.zipCode);
    }

  }

  // get 5days forecast details
  getFiveDaysForecast(zipCode: any) {
    if(zipCode.length == 6){
      this.subscription.add(this.weatherService.getForeCastWeatherDetails(this.zipCode,this.days).subscribe(forecastDetails => {
        this.forCastDataForZip = forecastDetails;
        this.forCastDataForZip.list.forEach((forecastData: ForecastData) => {
          forecastData.dt_txt = new Date(forecastData.dt * 1000);
        });
        this.storeForecast = {
          zipcode: zipCode,
          forecastDetails: this.forCastDataForZip
        }
        localStorage.setItem('forecastDetails',JSON.stringify(this.storeForecast))
      }));
    }
    else if(zipCode.length == 5){
      this.subscription.add(this.weatherService.getUSForeCastWeatherDetails(this.zipCode).subscribe(forecastDetails => {
        this.forCastDataForZip = forecastDetails;
        this.forCastDataForZip.list.forEach((forecastData: ForecastData) => {
          forecastData.dt_txt = new Date(forecastData.dt * 1000);
        });
      }));
    }
  }

  //unsubscribe the Obsevable
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}


