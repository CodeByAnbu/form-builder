import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DrawerComponent } from './components/drawer/drawer.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { RadioBtnComponent } from './components/radio-btn/radio-btn.component';
import { MediaUploadComponent } from './components/media-upload/media-upload.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxMaterialTimepickerModule, CdkDropList, CdkDrag, CdkDragPlaceholder, NgSelectModule, CommonModule, DrawerComponent, DropdownComponent, CheckboxComponent, RadioBtnComponent, MediaUploadComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'poc';

  isDrawerOpen: any = false;
  selectedInput: any;
  isPreviewForm: any = false;

  formList: any = []  // current form list

  currFormHeader: any =  []

  currForm: any = []

  originalFormFields = [
    {
      name: "Text",
      fields: [
        { name: "", description: "Add a description about this field", required: null, heading: "Single Line Text", subHeading: "Single Line Text", type: 'text', label: 'Edit your Label Name', placeholder: 'Enter text', options: [], multiSelect: false },
        { name: "", description: "Add a description about this field", required: null, heading: "Multi Line Text", subHeading: "Multi Line Text", type: 'textarea', label: 'Textarea', placeholder: 'Enter subHeading', options: [], multiSelect: false },
        { name: "", description: "Add a description about this field", required: null, heading: "Integer", subHeading: "Integer", type: 'number', label: 'Number', placeholder: 'Enter number', options: [], multiSelect: false }
      ]
    },
    {
      name: "Date",
      fields: [
        { name: "", description: "Add a description about this field", required: null, heading: "Date", subHeading: "Select date from datepicker.", type: 'date', label: 'Date Picker', options: [], multiSelect: false },
        { name: "", description: "Add a description about this field", required: null, heading: "Time", subHeading: "Select time from datepicker.", type: 'time', label: 'Time Picker', options: [], multiSelect: false },
        { name: "", description: "Add a description about this field", required: null, heading: "Date & Time", subHeading: "Select date & time from datepicker.", type: 'Date & time', label: 'Date & Time Picker', options: [], multiSelect: false },
      ]
    },
    {
      name: "Multi",
      fields: [
        { name: "", description: "Add a description about this field", required: null, heading: "Single selection", subHeading: "Select single option", type: 'radio', label: 'Radio Button', options: [], multiSelect: false },
        { name: "", description: "Add a description about this field", required: null, heading: "Multi selection", subHeading: "Select multiple options.", type: 'checkbox', label: 'Checkbox', options: [], multiSelect: false },
        { name: "", description: "Add a description about this field", required: null, heading: "Dropdown", subHeading: "Select option from dropdown", type: 'select', label: 'Dropdown', options: [], multiSelect: false },
      ]
    },
    {
      name: "Media",
      fields: [
        { name: "", description: "Add a description about this field", required: null, heading: "Upload", subHeading: "Upload documents/media files", type: 'upload', label: 'Upload', options: [], multiSelect: false }
      ]
    }
  ];
  
  formFields: any = []; 
  searchText: string = '';
  SampleOption: any = [{id: 1, name: "Option 1"}, {id: 2, name: "Option 2"}]
  
  searchFields(e: any){
    this.formFields = [];
    const input = e.target as HTMLInputElement;
    const regex = /[^a-zA-Z0-9 ]/g; // Regular expression to match numbers and colon
    let searchTerm = e.target.value;

    if (regex.test(input.value)) {
      input.value = input.value.replace(regex, '');
    }

    if (searchTerm.length >= 3) {
      const isLetter = /^[a-zA-Z\s]+$/.test(searchTerm); // Allow letters and spaces

      if(isLetter){
        this.formFields = this.originalFormFields
        .map(category => ({
          ...category,
          fields: category.fields.filter(field =>
            field.heading.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }))
        .filter(category => category.fields.length > 0);

      }
    }else{
      this.formFields = JSON.parse(JSON.stringify(this.originalFormFields));
    }

  
  }

  drop(event: any) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const draggedField = { ...event.item.data }; 
      this.currForm.splice(event.currentIndex, 0, draggedField);
    }
    this.saveForm();
  }

  openDrawer(field: any){
    this.selectedInput = field
    this.isDrawerOpen = true;
    this.isPreviewForm = false;
  }

  deleteForm(field: any){
    localStorage.removeItem(field.id);
    const index = this.formList.findIndex((item: any) => item.id === field.id);

    if (index !== -1) {
        this.formList.splice(index, 1);
    }
    this.currFormHeader = [];
    this.currForm = [];
    this.saveForm();
    this.originalFormFields = this.getFormList();
    this.formList = this.getFormList();
  }

  closeDrawer(){
    this.isDrawerOpen = false;
    this.selectedInput = null;
    this.isPreviewForm = false;
  }

  createNewForm(){ 
    const formList: any = this.getFormList();
    const id = formList.length > 0 ? formList[formList.length - 1].id + 1 : 1;
    const newFormHeader = {
      id: id,
      name: "Form Name",
      description: "Add description ...",
      type: 'form-header',
      fields: []
    }
    
    this.formList.push(newFormHeader);
    this.currFormHeader = [];
    this.currFormHeader.push(newFormHeader);
    this.currForm = [];
    this.saveForm()
  }

  deleteField(index: any){
    this.currForm.splice(index, 1);
    this.saveForm();
  }

  openForm(form: any){
    const formList: any = this.getFormList();
    this.currForm = this.getForm(form);
    this.currFormHeader = formList.filter((item: any) => item.id === form.id)
  }

  getDrawerFormProps(props: any){
    if(this.selectedInput.type == 'form-header'){
      const currFormHeader = this.formList.find((item: any) => item.id === this.selectedInput.id)
      currFormHeader.name = props.name,
      currFormHeader.description = props.description,
      this.currFormHeader[0].name = props.name,
      this.currFormHeader[0].description = props.description
    }else{
    this.selectedInput.label = props.name,
    this.selectedInput.description = props.description,
    this.selectedInput.placeholder = props.placeholder,
    this.selectedInput.required = props.required
    }
    this.saveForm();
  }

  saveForm(){
   localStorage.setItem('formList', JSON.stringify(this.formList));
   localStorage.setItem(this.currFormHeader[0].id, JSON.stringify(this.currForm));
  }

  getForm(form: any){
    return JSON.parse(localStorage.getItem(form.id) || '[]');
  }

  getFormList(){
    return JSON.parse(localStorage.getItem('formList') || '[]');
  }

  previewForm(){
    this.isPreviewForm = true;
    this.isDrawerOpen = true;
  }

  ngOnInit(){
    this.formFields = JSON.parse(JSON.stringify(this.originalFormFields));
    if(!localStorage.getItem('formList') || JSON.parse(localStorage.getItem('formList') || '[]').length === 0){
      localStorage.setItem('formList', JSON.stringify([]));
    }else{
      this.formList = this.getFormList();
    }
    // this.saveForm();
  }
}
