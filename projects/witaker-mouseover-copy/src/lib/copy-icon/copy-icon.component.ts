import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'witaker-copy-icon',
  templateUrl: './copy-icon.component.html',
  styleUrls: ['./copy-icon.component.scss'],
})
export class CopyIconComponent implements OnInit {
  iconPaths = [
    'M480.7,11H130.4c-11.3,0-20.4,9.1-20.4,20.4v60.3H31.5c-11.3,0-20.4,9.1-20.4,20.4v368.5c0,11.3,9.1,20.4,20.4,20.4     h350.3c11.3,0,20.4-9.1,20.4-20.4v-60.3h78.5c11.3,0,20.4-9.1,20.4-20.4V31.4C501.1,20.1,491.9,11,480.7,11z M361.3,460.2H51.9     V132.5h309.4V460.2z M460.2,379.5h-58.1V112.1c0-11.3-9.1-20.4-20.4-20.4h-231V51.8h309.4V379.5z',
    'm127.8,242.6h157.7c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-157.7c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4z',
    'm127.8,390.9h157.7c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-157.7c-11.3,0-20.4,9.1-20.4,20.4 0,11.2 9.1,20.4 20.4,20.4z',
  ];
  @Input() baseClass = "copy-icon"
  @Input() prominent = false;
  @Input() ready = false;

  constructor() {}

  ngOnInit(): void {}

  getClasses() {
    const classes = [this.baseClass];
    if (this.ready) {
      classes.push("ready");
    } else if (this.prominent) {
      classes.push("prominent");
    }
    return classes;
  }
}
