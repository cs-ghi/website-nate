import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  subjects: {value:string, viewValue:string}[] = [
    {value: 'research', viewValue: 'Research Collaboration'},
    {value: 'tutoring', viewValue: 'Tutoring Service'},
    {value: 'discussion', viewValue:'Discussion'},
    {value: 'errata', viewValue: 'Errata'},
    {value: 'other', viewValue: 'Other'},
  ];

  // selectedSubject:String;

  form: FormGroup;
  name: FormControl = new FormControl("", [Validators.required]);
  email: FormControl = new FormControl("", [Validators.required, Validators.email]);
  message: FormControl = new FormControl("", [Validators.required, Validators.maxLength(256)]);
  subject: FormControl = new FormControl("");
  selectedSubject: FormControl = new FormControl("");

  honeypot: FormControl = new FormControl(""); // we will use this to prevent spam
  submitted: boolean = false; // show and hide the success message
  isLoading: boolean = false; // disable the submit button if we're loading
  responseMessage: string = ""; // the response message to show to the user
  myForm: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.form = this.formBuilder.group({
      name: this.name,
      email: this.email,
      message: this.message,
      subject: this.subject,
      selectedSubject: this.selectedSubject,
      honeypot: this.honeypot
    });
  }
  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(null),
      email: this.formBuilder.control(null),
      message: this.formBuilder.control(null),
      subject: this.formBuilder.control(null),
      selectedSubject: this.formBuilder.control(null),
    });
  }
  ngOnInit(): void {
  }


  onSubmit() {
    if (this.form.status == "VALID" && this.honeypot.value == "") {
      this.form.disable(); // disable the form if it's valid to disable multiple submissions
      var formData: any = new FormData();
      formData.append("name", this.form.get("name")?.value);
      formData.append("email", this.form.get("email")?.value);
      formData.append("message", this.form.get("message")?.value);
      formData.append("subject", this.form.get("subject")?.value);
      formData.append("selectedSubject", this.form.get("selectedSubject")?.value);
      this.isLoading = true; // sending the post request async so it's in progress
      this.submitted = false; // hide the response message on multiple submits
      this.http.post("https://script.google.com/macros/s/AKfycbxS-GLfzYefTw8JF1NukMi8wekuD1jINgZQPIHtCJPlLFvL0EVVvYKoaJQwRbtSND6pug/exec", formData).subscribe(
        (response: any) => {
          // choose the response message
          if (response["result"] == "success") {
            this.responseMessage = "Thanks for the message! I will get back to you soon!";
          }
          else {
            this.responseMessage = "Thanks for the message! I will get back to you soon!";
            // this.responseMessage = "Oops! Something went wrong... Reload the page and try again.";
          }
          this.form.enable(); // re enable the form after a success
          this.submitted = true; // show the response message
          this.isLoading = false; // re enable the submit button
          console.log(response);
        },
        (error) => {
          this.responseMessage = "Oops! An error occurred... Reload the page and try again.";
          this.form.enable(); // re enable the form after a success
          this.submitted = true; // show the response message
          this.isLoading = false; // re enable the submit button
          console.log(error);
        }
      );
    }
  }
}
