import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { MediaUploadComponent } from '../media-upload/media-upload.component';
import { RadioBtnComponent } from '../radio-btn/radio-btn.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
// import { TimePickerComponent } from '../time-picker/time-picker.component';
import { DateTimePickerComponent } from '../date-time-picker/date-time-picker.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,NgxMaterialTimepickerModule, NgSelectModule, DropdownComponent, MediaUploadComponent, RadioBtnComponent, CheckboxComponent, DatePickerComponent, DateTimePickerComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css'
})
export class DrawerComponent {

  showErrMsg: any= false;
  radioBtnCount: any = 0;

@Input() currField: any;
@Input() isPreviewForm: any;
@Input() currForm: any;

@Output() closeDrawerEvent = new EventEmitter<boolean>();
@Output() formPropsEvent = new EventEmitter<any>()

  inputProps = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('',),
    placeholder: new FormControl(''),
    required: new FormControl(''),
  })

  currFormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    placeholder: new FormControl(''),
    required: new FormControl(''),
  })

  closePanel(){
    this.closeDrawerEvent.emit(true);
  }

  submitForm(){
    
    if(!this.inputProps.invalid){
      this.showErrMsg = false;
      this.formPropsEvent.emit(this.inputProps.value);
      this.closePanel();
    }else{
      this.showErrMsg = true;
    
    }
  }

  increaseOptionCount(type: any){
    if(type === 'radio'){
      this.radioBtnCount++
    }
  }

  decreaseOptionCount(type: any){
    if(type === 'radio'){
      this.radioBtnCount--
    }
  }

}
