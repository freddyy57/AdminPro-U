import { Component, OnInit } from '@angular/core';
declare function init_plugins();

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: [`
  .error-box {
    height: 100%;
    position: fixed;
    background: url(../../../assets/images/background/error-bg.jpg) no-repeat 50% 60% #fff;
    width: 100%;
}
.error-body {
    padding-top: 5%;
}
.error-body h1 {
  font-size: 210px;
  font-weight: 900;
  text-shadow: 4px 4px 0 #ffffff, 6px 6px 0 #263238;
  line-height: 210px;
}
@media (max-width: 767px) {
    .error-box {
        position: relative;
        padding-bottom: 235px;
    }
    .error-body {
        padding-top: 10%;
    }
    .error-body h1 {
      font-size: 100px;
      font-weight: 600;
      line-height: 100px;
  }
}
  `]
})
export class NopagefoundComponent implements OnInit {

  anio: number = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
    init_plugins();
  }

}
