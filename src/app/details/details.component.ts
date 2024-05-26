import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housinglocation';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';

import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

import {ThemePalette} from '@angular/material/core';
import {MatChip, MatChipsModule} from '@angular/material/chips';

export interface ChipColor {
  name: string;
  color: ThemePalette;
}


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo"
        alt="Exterior photo of {{housingLocation?.name}}"/>
      <section class="listing-description">
        <h2 class="listing-heading">{{housingLocation?.name}}</h2>
        <p class="listing-location">{{housingLocation?.city}}, {{housingLocation?.state}}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>

        <ul>
          <li>Units available: {{housingLocation?.availableUnits}}</li>
          <mat-chip-listbox class="mat-mdc-chip-set-stacked" aria-label="Color selection">
          @for (chip of availableColors; track chip) {
            <mat-chip-option selected [color]="chip.color">{{chip.name}}</mat-chip-option>
          }
        </mat-chip-listbox>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <mat-form-field>
            <mat-label>Input</mat-label>
            <input matInput>
          </mat-form-field>

          <label for="last-name">Last Name</label>
          <mat-form-field>
            <mat-label>Input</mat-label>
            <input matInput>
          </mat-form-field>

          <label for="email">Email</label>
          <div class="example-container">
            <mat-form-field>
              <mat-label>Enter your email</mat-label>
              <input matInput
                    placeholder="pat@example.com"
                    [formControl]="email"
                    (blur)="updateErrorMessage()"
                    required>
              @if (email.invalid) {
                <mat-error>{{errorMessage}}</mat-error>
              }
            </mat-form-field>
          </div>
          <button mat-raised-button color="primary">Apply Now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  availableColors: ChipColor[] = [
    {name: 'Wifi', color: undefined},
    {name: 'Laundry', color: 'primary'},
  ];
  
  email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = '';

  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  });

  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingLocation = this.housingService.getHousingLocationById(housingLocationId);

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );
  }
}