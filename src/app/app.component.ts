import { by,element } from 'protractor';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'canvas-app';

  /** 選択されたエリア番号 */
  area : number;

  /** エリア選択 */
  firstLoad = true;

  /** */
  areaNumber:number = 5;

  /**
   * 選択されたエリア番号を取得する
   */
  getAreaNum(){
    // this.area = this.melremoLibraryService.getArea();
    console.log('getエリア : ' + this.area);
    return this.area;
  }

  /**
   * 次へボタン押下時の処理
   */
  nextButtonTapped(){
    this.firstLoad = false;
    if(this.areaNumber>1){
      this.areaNumber--;
    }

    // console.log(by.tagName('app-hero-parent'));
    console.log('エリア数：' + this.areaNumber);
  }

}
