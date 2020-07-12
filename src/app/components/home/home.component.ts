import { Component, HostListener } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  deferredPrompt: any;
  showButton = false;
  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showButton = true;
  }
  public async addToHomeScreen() {
    this.deferredPrompt.prompt();
    const choiceResult = await this.deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      this.deferredPrompt = null;
      this.showButton = false;
    } else {
      console.log('User dismissed the A2HS prompt');
    }
  }
}
