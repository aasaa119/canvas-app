import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'canvas-app';

  /** 選択されたエリア番号 */
  area: number;

  /** エリア選択 */
  firstLoad = true;

  /** */
  areaNumber = 4;
  indoor = 1;

  /**
   * 選択されたエリア番号を取得する
   */
  getAreaNum() {
    // this.area = this.melremoLibraryService.getArea();
    console.log('getエリア : ' + this.area);
    return this.area;
  }

  /**
   *
   */
  areaNum0() {
    this.areaNumber = 0;
  }
  areaNum1() {
    this.areaNumber = 1;
  }
  areaNum2() {
    this.areaNumber = 2;
  }
  areaNum3() {
    this.areaNumber = 3;
  }
  areaNum4() {
    this.areaNumber = 4;
  }

  /**
   * 次へボタン押下時の処理
   */
  nextButtonTapped() {
    this.firstLoad = false;
    if ( this.indoor < 4 ) {
      this.indoor++;
    }
    console.log('エリア数：' + this.indoor);
  }

  prevButtonTapped() {
    this.firstLoad = false;
    if ( this.indoor > 1 ) {
      this.indoor--;
    }
    console.log('エリア数：' + this.indoor);
  }

}
