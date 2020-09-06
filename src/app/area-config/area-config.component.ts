import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Lexer } from '@angular/compiler';

@Component({
  selector: 'app-area-config',
  templateUrl: './area-config.component.html',
  styleUrls: ['./area-config.component.css']
})
export class AreaConfigComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') myCanvas;

  public w = 300;
  public h = 200;

  private areaNum = 4;
  private rotation = 0;

  public istapX = false;
  public istapY = false;

  private isXline = true;
  private isYline = true;

  /* エリア表示データ */
  public areaRect = [
    { x: 0, y: 0, w: this.w / 2, h: this.h / 2, color: 'rgba(255,0,0,0.2)' },   // エリア１
    { x: this.w / 2, y: 0, w: this.w / 2, h: this.h / 2, color: 'rgba(0,255,0,0.2)' },   // エリア２
    { x: 0, y: this.h / 2, w: this.w / 2, h: this.h / 2, color: 'rgba(255,255,0,0.2)' }, // エリア３
    { x: this.w / 2, y: this.h / 2, w: this.w / 2, h: this.h / 2, color: 'rgba(0,0,255,0.2)' }    // エリア４
  ];

  public areaLine = [
    { x1: this.w / 2, y1: 0, x2: this.w / 2, y2: this.h / 2, ox: 0 , oy: 0, isMove: false , color: 'rgba(0,0,0,1)' },  // 縦上
    { x1: this.w / 2, y1: this.h / 2, x2: this.w / 2, y2: this.h, ox: 0 , oy: 0, isMove: false , color: 'rgba(0,0,0,1)' },  // 縦下
    { x1: 0, y1: this.h / 2, x2: this.w / 2, y2: this.h / 2, ox: 0 , oy: 0, isMove: false , color: 'rgba(0,0,0,1)' },  // 横右
    { x1: this.w / 2, y1: this.h / 2, x2: this.w, y2: this.h / 2, ox: 0 , oy: 0, isMove: false , color: 'rgba(0,0,0,1)' }   // 横左
  ];

  public blankLine = [
    { x1: 0, y1: 0, x2: 0, y2: this.h / 2, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 0:縦左上
    { x1: 0, y1: this.h / 2, x2: 0, y2: this.h, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 1:縦左下
    { x1: this.w, y1: 0, x2: this.w, y2: this.h / 2, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 2:縦左下
    { x1: this.w, y1: this.h / 2, x2: this.w, y2: this.h, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 3:縦右下
    { x1: 0, y1: 0, x2: this.w / 2, y2: 0, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 4:横左上
    { x1: 0, y1: this.h, x2: this.w / 2, y2: this.h, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 5:横左下
    { x1: this.w / 2, y1: 0, x2: this.w, y2: 0, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }, // 6:横右上
    { x1: this.w / 2, y1: this.h, x2: this.w, y2: this.h, ox: 0 , oy: 0, isMove: false , color: 'rgba(128,128,128,1)' }  // 7:横右下
  ];


  constructor() { }

  ngOnInit() {
  }

  public draw() {

    const canvas = this.myCanvas.nativeElement;

    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, this.w, this.h);
      // グリット描画
      ctx.strokeStyle = 'rgba(200,200,200,1)';
      ctx.lineWidth = 1;
      // 横線描画
      for (let i = 0; i <= this.h; i += 10) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(this.w, i); ctx.closePath(); ctx.stroke();
      }
      // 縦線描画
      for (let i = 0; i <= this.w; i += 10) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, this.h); ctx.closePath(); ctx.stroke();
      }
      // エリア描画
      for (const r of this.areaRect) {
        ctx.fillStyle = r.color;
        ctx.fillRect(r.x, r.y, r.w, r.h);
      }

      // ブランクエリア選択ライン描画
      ctx.lineWidth = 10;
      for (const l of this.blankLine) {
        ctx.strokeStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(l.x1 + l.ox , l.y1 + l.oy);
        ctx.lineTo(l.x2 + l.ox , l.y2 + l.oy);
        ctx.closePath();
        ctx.stroke();
      }

      // エリア選択ライン描画
      ctx.lineWidth = 10;
      for (const l of this.areaLine) {
        ctx.strokeStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(l.x1 + l.ox , l.y1 + l.oy);
        ctx.lineTo(l.x2 + l.ox , l.y2 + l.oy);
        ctx.closePath();
        ctx.stroke();
      }
    }

  }

  public touchMove(event) {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left;
    const y = touchY - rect.top;

    for (const l of this.areaLine) {
      if ( l.isMove === true ) {
        if (l.x1 === l.x2) {   // 縦線
          l.ox = x - l.x1;
          console.log(l.ox);
          if ((-this.w / 2) > l.ox ) {
            l.ox = -this.w / 2;
          } else if ( l.ox > (this.w / 2) ) {
            l.ox = this.w / 2;
          }

          if (this.isXline === true ) {
            this.areaLine[0].ox = l.ox;
            this.areaLine[1].ox = l.ox;
            this.areaLine[2].x2 = (this.w / 2) + l.ox;
            this.areaLine[3].x1 = (this.w / 2) + l.ox;
          }
        } else {              // 横線
          l.oy = y - l.y1;
          if ((-this.h / 2) > l.oy ) {
            l.oy = -this.h / 2;
          } else if ( l.oy > (this.h / 2) ) {
            l.oy = this.h / 2;
          }
          if (this.isYline === true ) {
            this.areaLine[0].y2 = (this.h / 2) + l.oy;
            this.areaLine[1].y1 = (this.h / 2) + l.oy;
            this.areaLine[2].oy = l.oy;
            this.areaLine[3].oy = l.oy;
          }
        }
        this.ariaNum4RectArea(this.areaLine[2].oy, this.areaLine[3].oy , this.areaLine[0].ox , this.areaLine[1].ox);
        console.log('X:', x + ' Y:', y);
      }
    }

    for (const l of this.blankLine) {
      if ( l.isMove === true ) {
        if (l.x1 === l.x2) {   // 縦線
          l.ox = x - l.x1;
          console.log(l.ox);
          if ((-this.w / 2) > l.ox ) {
            l.ox = -this.w / 2;
          } else if ( l.ox > (this.w / 2) ) {
            l.ox = this.w / 2;
          }
          // if (this.isXline === true ) {
          //   this.areaLine[0].ox = l.ox;
          //   this.areaLine[1].ox = l.ox;
          //   this.areaLine[2].x2 = (this.w / 2) + l.ox;
          //   this.areaLine[3].x1 = (this.w / 2) + l.ox;
          // }
        } else {              // 横線
          l.oy = y - l.y1;
          if ((-this.h / 2) > l.oy ) {
            l.oy = -this.h / 2;
          } else if ( l.oy > (this.h / 2) ) {
            l.oy = this.h / 2;
          }
          // if (this.isYline === true ) {
          //   this.areaLine[0].y2 = (this.h / 2) + l.oy;
          //   this.areaLine[1].y1 = (this.h / 2) + l.oy;
          //   this.areaLine[2].oy = l.oy;
          //   this.areaLine[3].oy = l.oy;
          // }
        }
        console.log('X:', x + ' Y:', y);
      }
    }

    this.istapX = false;
    this.istapY = false;
    this.draw();
  }


  public ariaNum4RectArea( xlY: any , xrY: any , yuX: any , ylX: any ) {
    this.areaRect[0].x = 0;
    this.areaRect[0].y = 0;
    this.areaRect[0].w = (this.w / 2) + (yuX);
    this.areaRect[0].h = (this.h / 2) + (xlY);
    this.areaRect[1].x = (this.w / 2) + (yuX);
    this.areaRect[1].y = 0;
    this.areaRect[1].w = (this.w / 2) - (yuX);
    this.areaRect[1].h = (this.h / 2) + (xrY);
    this.areaRect[2].x = 0;
    this.areaRect[2].y = (this.h / 2) + (xlY);
    this.areaRect[2].w = (this.w / 2) + (ylX);
    this.areaRect[2].h = (this.h / 2) - (xlY);
    this.areaRect[3].x = (this.w / 2) + (ylX);
    this.areaRect[3].y = (this.h / 2) + (xrY);
    this.areaRect[3].w = (this.w / 2) - (ylX);
    this.areaRect[3].h = (this.h / 2) - (xrY);
  }
  public isXlineArea(line , x  , y) {
    if ((((line.x1 + line.ox - 5) < x) && (x < (line.x1 + line.xo + 5))) && (((line.y1 + line.oy) < y) && (y < (line.y2 + line.oy)))) {
      return true;
    } else {
      return false;
    }
  }


  public touchStart(event) {
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left;
    const y = touchY - rect.top;
    // console.log(this);
    // ライン上のタッチイベントかをチェックする
    for (const l of this.areaLine) {
      // 縦線か横線かのチェック
      if (l.x1 === l.x2) {   // 縦線
        console.log('tapx ' + 'X:', l.x1 + l.ox + ' Y:', y);
        if ((((l.x1 + l.ox - 5) < x) && (x < (l.x1 + l.ox + 5))) && ((l.y1 < y) && (y < l.y2))) {
          this.istapX = true;
          l.isMove = true;
          break;
        }
      } else {  // 横線
        if ((((l.y1 + l.oy - 5) < y) && (y < (l.y1 + l.oy + 5))) && ((l.x1 < x) && (x < l.x2))) {
          this.istapY = true;
          l.isMove = true;
          break;
        }
      }
    }
    for (const l of this.blankLine) {
      // 縦線か横線かのチェック
      if (l.x1 === l.x2) {   // 縦線
        // console.log('tapx ' + 'X:', l.x1 + l.ox + ' Y:', y);
        if ((((l.x1 + l.ox - 5) < x) && (x < (l.x1 + l.ox + 5))) && ((l.y1 < y) && (y < l.y2))) {
          // this.istapX = true;
          l.isMove = true;
          break;
        }
      } else {  // 横線
        if ((((l.y1 + l.oy - 5) < y) && (y < (l.y1 + l.oy + 5))) && ((l.x1 < x) && (x < l.x2))) {
          // this.istapY = true;
          l.isMove = true;
          break;
        }
      }
    }
    // console.log('X:', x + ' Y:', y);
  }


  public touchEnd(event) {
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left;
    const y = touchY - rect.top;
    // console.log(this);
    // ライン上のタッチイベントかをチェックする
    for (const l of this.areaLine) {
      // 縦線か横線かのチェック
      if (l.x1 === l.x2) {   // 縦線
        if ((((l.x1 + l.ox - 5) < x) && (x < (l.x1 + l.ox + 5))) && ((l.y1 < y) && (y < l.y2))) {
          if (this.istapX === true) {
            console.log('tapx ' + 'X:', x + ' Y:', y);
            this.handleTapX();
          }
          break;
        }
      } else {  // 横線
        if ((((l.y1 + l.oy - 5) < y) && (y < (l.y1 + l.oy + 5))) && ((l.x1 < x) && (x < l.x2))) {
          if (this.istapY === true) {
            console.log('tapy ' + 'X:', x + ' Y:', y);
            this.handleTapY();
          }
          break;
        }
      }
    }
    this.istapX = false;
    this.istapY = false;
    for (const l of this.areaLine) {
      l.isMove = false;
    }
    for (const l of this.blankLine) {
      l.isMove = false;
    }
    this.draw();
  }

  public handleTapX() {
    if (this.areaNum === 1) {
      // エリア数 1の時は処理なし
    } else if (this.areaNum === 2) {
      // this.areaNum2Tap();
    } else if (this.areaNum === 3) {
      // this.areaNum3Tap();
    } else {
      this.areaNum4XTap();
    }
    // this.textArea();
    // this.rectArea();
    // this.layer.getStage().draw();
  }

  public handleTapY() {
    if (this.areaNum === 1) {
    } else if (this.areaNum === 2) {
      // this.areaNum2Tap();
    } else if (this.areaNum === 3) {
      // this.areaNum3Tap();
    } else {
      this.areaNum4YTap();
    }
    // this.textArea();
    // this.rectArea();
    // this.layer.getStage().draw();
  }



  // エリア数 4 の横ライン(X)タップ処理
  public areaNum4XTap() {
    // const yu = this.yu.getStage().absolutePosition();
    // const yl = this.yl.getStage().absolutePosition();
    // const xl = this.xl.getStage().absolutePosition();
    // const xr = this.xr.getStage().absolutePosition();

    if (this.isYline === true) {
      if (this.isXline === false) {
        // if (xl.y < (xr.y + this.strokeWidth) && xl.y > (xr.y - this.strokeWidth)) {
        this.isXline = true;
        //   this.xr.getStage().absolutePosition(xl);
        //   this.xl.getStage().stroke('black');
        //   this.xr.getStage().stroke('black');
        // }
        this.areaLine[0].color = 'rgba(0,0,0,1)' ;
        this.areaLine[1].color = 'rgba(0,0,0,1)' ;
      } else {
        // if (yu.x === yl.x) {
        this.isXline = false;
      //     this.xl.getStage().stroke('red');
      //     this.xr.getStage().stroke('blue');
      //   }
        this.areaLine[0].color = 'rgba(255,0,0,1)' ;
        this.areaLine[1].color = 'rgba(0,0,255,1)' ;
      }
    }
  }

  public areaNum4YTap() {
    // const yu = this.yu.getStage().absolutePosition();
    // const yl = this.yl.getStage().absolutePosition();
    // const xl = this.xl.getStage().absolutePosition();
    // const xr = this.xr.getStage().absolutePosition();

    if (this.isXline === true) {
      if (this.isYline === false) {
        // if (yu.x < (yl.x + 10) && yu.x > (yl.x - 10)) {
        this.isYline = true;
        //   this.yl.getStage().absolutePosition(yu);
        //   this.yu.getStage().stroke('black');
        //   this.yl.getStage().stroke('black');
        // }
        this.areaLine[2].color = 'rgba(0,0,0,1)' ;
        this.areaLine[3].color = 'rgba(0,0,0,1)' ;
      } else {
        // if (xl.y === xr.y) {
        this.isYline = false;
        //   this.yu.getStage().stroke('red');
        //   this.yl.getStage().stroke('blue');
        // }
        this.areaLine[2].color = 'rgba(255,0,0,1)' ;
        this.areaLine[3].color = 'rgba(0,0,255,1)' ;
      }
    }
  }

  handleEvent(event) {
    switch (event.type) {
      case 'touchstart':
        this.touchStart(event);
        break;
      case 'touchend':
        this.touchEnd(event);
        break;
      case 'touchmove':
        this.touchMove(event);
        break;
    }
  }


  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    canvas.addEventListener('touchstart', this, false);
    canvas.addEventListener('touchend', this, false);
    canvas.addEventListener('touchmove', this, false);
    this.draw();

    // const c = this.canvas.getElementById('stage');
    // console.log(this.can);
    // if (this.myCanvas.nativeElement.getContext) {
    //   const img01 = new Image();
    //   //img01.src = 'assets/img/cat.jpg';
    //   // img01.onload = () => {
    //     ctx.drawImage(img01, 0, 0 , 300 , 200 );
    //     ctx.fillStyle = 'rgba(255,0,0,0.2)';
    //     ctx.fillRect( 0 , 0, 150, 100);
    //     ctx.fillStyle = 'rgba(0,256,0,0.2)';
    //     ctx.fillRect( this.areaRect[0].x , 0, 150, 100);
    //     ctx.fillStyle = 'rgba(255,255,0,0.2)';
    //     ctx.fillRect( 0 , 100, 150, 100);
    //     ctx.fillStyle = 'rgba(0,0,255,0.2)';
    //     ctx.fillRect( 150 , 100, 150, 100);
    // };
  }
}
