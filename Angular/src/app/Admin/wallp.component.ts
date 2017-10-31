import { Component, OnInit } from '@angular/core';
import {HttpService} from '../Shared/http.service';

@Component({
  selector: 'pdf-wallp',
  templateUrl: './wallp.component.html',
  styleUrls: ['./wallp.component.css']
})
export class WallpComponent implements OnInit {

  file: any;
  wname: any;

  constructor(
    private http: HttpService
  ) {

  }

  onSubmit(data: any, name: any) {
    this.file = data.substr(23);
    this.wname = name;
    console.log(name);
  }

  sendWall() {
    let request: any;
    request = {
      data: this.file,
      name: this.wname
    };
    console.log(request);
    this.http.sendWallPaper(request)
      .subscribe(
        (result) => {
          console.log(result);
          alert('Wallpaper added! Clear and upload the next one.');
        }
      );
  }

  ngOnInit() {
  }

}
