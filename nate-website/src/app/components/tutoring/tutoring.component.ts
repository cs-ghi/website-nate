import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-tutoring',
    templateUrl: 'tutoring.component.html',
    styleUrls: ['./tutoring.component.scss'],
    standalone: false
})
export class TutoringComponent implements OnInit {
  tutoringForm: FormGroup;
  submitted = false;

  mathTypes = [
    'Algebra',
    'Geometry',
    'Trigonometry',
    'Pre-Calculus',
    'Calculus I',
    'Calculus II',
    'Calculus III',
    'Linear Algebra',
    'Differential Equations',
    'Statistics',
    'Complex Analysis',
    'Real Analysis',
    'Abstract Algebra',
    'Topology',
    'Other'
  ];

  goals = [
    'Homework Help',
    'Test Preparation',
    'Concept Understanding',
    'Long-term Academic Support',
    'Competition Preparation',
    'Research Guidance',
    'Other'
  ];

  constructor(private formBuilder: FormBuilder) {
    this.tutoringForm = this.formBuilder.group({
      name: ['', Validators.required],
      contactPreference: ['email', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      mathType: ['', Validators.required],
      goal: ['', Validators.required],
      additionalInfo: [''],
      currentLevel: [''],
      availability: ['']
    });
  }

  ngOnInit(): void {
    // Update validators based on contact preference
    this.tutoringForm.get('contactPreference')?.valueChanges.subscribe(value => {
      const emailControl = this.tutoringForm.get('email');
      const phoneControl = this.tutoringForm.get('phone');
      
      if (value === 'email') {
        emailControl?.setValidators([Validators.required, Validators.email]);
        phoneControl?.clearValidators();
      } else {
        phoneControl?.setValidators([Validators.required]);
        emailControl?.clearValidators();
      }
      
      emailControl?.updateValueAndValidity();
      phoneControl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.tutoringForm.valid) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', this.tutoringForm.value);
      alert('Thank you for your interest! I will contact you soon.');
      this.tutoringForm.reset();
      this.submitted = false;
    }
  }

  get formControls() {
    return this.tutoringForm.controls;
  }
}

