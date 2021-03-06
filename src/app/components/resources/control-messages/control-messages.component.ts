import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-control-messages',
  template: `<div class="alert alert-danger" *ngIf="errorMessage !== null">
    {{ errorMessage }}
  </div>`,
})
export class ControlMessagesComponent {
  @Input() control: FormControl;

  public get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        this.control.touched
      ) {
        return ValidationService.getValidatorErrorMessage(
          propertyName,
          this.control.errors[propertyName]
        );
      }
    }
    return null;
  }
}
