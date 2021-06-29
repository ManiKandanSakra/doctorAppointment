import { Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConnectionService } from '../../connection.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router  } from '@angular/router';
declare var require:any;
var moment = require("moment");

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  modalRef: any;mrgSlots:any =[];url:any;mrgSlotList:any =[];eveSlotList:any =[];eveSlots:any =[];valueArray=[];keyArray=[];slotData:any = {slotDate:moment(new Date()).format('DD-MM-YYYY'),'from':'','to':''};
  bsInlineValue:Date = new Date();
  // bsInlineRangeValue: Date[];
  minDate:Date             = new Date();
  constructor(private router: Router,private modalService: BsModalService, private conn : ConnectionService, public notify:ToastrService) {
        this.minDate.setDate(this.minDate.getDate());
        // this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
  }

  ngOnInit(): void {
    console.log('URL ->',this.router.url);
    this.url = this.router.url;
    this.getSlots();
    this.getAssignedSlot();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // Get Slot Timer
  getSlots(){
    this.conn.getData('slots/slotTimer').subscribe((result:any)=>{
       // console.log('result -->',result.valueArray);
       // console.log('keyArray -->',result.keyArray);
       this.valueArray = result.valueArray;
       this.keyArray = result.keyArray;
    })
  }
  // Get Slot Timer


  // Select Date Function
  pickDate(event:any){
    var solDate = new Date(event);
    var date     = moment(solDate,"DD-MM-YYYY");
    this.slotData.slotDate = moment(date).format('DD-MM-YYYY');
    this.getAssignedSlot();
  }
  // Select Date Function


  // Get Assigned Sloat
    getAssignedSlot(){
      var sendData = {'date':this.slotData.slotDate};
      this.conn.postData('slots/getAssigned',sendData).subscribe((response:any)=>{
        console.log('response -->',response);
          if(response.status == true){
            var slotRes = response.result;
            this.mrgSlots = slotRes[0].mrgSlot;
            this.eveSlots = slotRes[0].eveSlot;
          }else{
            this.mrgSlots = [];
            this.eveSlots = [];
          }
      })
    }
  // Get Assigned Sloat


  // Create Slot
  createSlot(form:NgForm,template:any){
    let postData = form.value;
    var from = postData.fromTime;
    var to = postData.toTime;
    postData.date = this.slotData.slotDate;
    var startTime = moment(from, "HH:mm");
    var endTime = moment(to, "HH:mm");
    var Timediff = endTime.diff(startTime, 'minutes');
    if(Timediff > 30){
      this.notify.error("You can't create slot more then 30 minutes","Error");
      return;
    }else if(Timediff <= 0){
      this.notify.error("Invaild From and To","Error");
      return;
    }else{
      this.conn.postData('slots/createSlot',postData).subscribe((result:any)=>{
        if( result.status == true ){
          this.getAssignedSlot();
          this.modalRef.hide();
          form.reset();
          this.slotData.to = ''; 
          this.slotData.from = '';
          this.notify.success(result.msg,"Success");
        }
        else{
          this.notify.error(result.msg,'error')
        }
      })
    }
  }
  // Create Slot


}
