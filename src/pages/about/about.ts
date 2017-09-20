import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public push: Push) {

  	this.push.register().then((t: PushToken) => {
	  return this.push.saveToken(t);
	}).then((t: PushToken) => {
	  console.log('Token saved:', t.token);
	});
	this.push.rx.notification()
	  .subscribe((msg) => {
	    alert(msg.title + ': ' + msg.text);
	  });
  }

}
