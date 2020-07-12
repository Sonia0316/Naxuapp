import { Component, HostListener, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { PromptComponent } from '../prompt/prompt.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  deferredPrompt: any;
  showButton = false;
  constructor(
    private platform: Platform,
    private bottomSheet: MatBottomSheet
  ) {}

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e) {
    e.preventDefault();
    if (this.platform.ANDROID) {
      this.deferredPrompt = e;
      this.showButton = true;
    }
  }
  public ngOnInit(): void {
    if (this.platform.IOS) {
      const isInStandaloneMode =
        'standalone' in window.navigator && window.navigator['standalone'];
      if (!isInStandaloneMode) {
        this.openPromptComponent('ios');
      }
    }
  }
  public async addToHomeScreen() {
    this.deferredPrompt.prompt();
    const choiceResult = await this.deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      this.deferredPrompt = null;
      this.showButton = false;
    }
  }
  private openPromptComponent(mobileType: 'ios' | 'android') {
    this.bottomSheet.open(PromptComponent, {
      data: { mobileType, promptEvent: this.deferredPrompt },
    });
  }
}
