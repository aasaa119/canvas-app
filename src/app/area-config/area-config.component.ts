import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { Lexer } from '@angular/compiler';

@Component({
  selector: 'app-area-config',
  templateUrl: './area-config.component.html',
  styleUrls: ['./area-config.component.css']
})
export class AreaConfigComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') myCanvas;
  @Input() areaNum;
  @Input() isDrag = true;

  public w = 0;
  public h = 0;

  private rotation = 0;

  public istapX = false;
  public istapY = false;

  private isXline = true;
  private isYline = true;

  /* エリア表示データ */
  public areaRect = [];
  public areaLine = [];

  constructor() { }

  ngOnInit() {
    // console.log(this);
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
      // エリア選択ライン描画
      for (const l of this.areaLine) {
        ctx.lineWidth = l.lw;
        ctx.strokeStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(l.x1 + l.ox, l.y1 + l.oy);
        ctx.lineTo(l.x2 + l.ox, l.y2 + l.oy);
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
      if (l.isMove === true) {
        if (l.x1 === l.x2) {   // 縦線
          l.ox = x - l.x1;
          if ((-this.w / 2) > l.ox) {
            l.ox = -this.w / 2;
          } else if (l.ox > (this.w / 2)) {
            l.ox = this.w / 2;
          }
          l.ox = Math.round(l.ox / 10) * 10;
          switch (l.name) {
            case '8': // 縦上
              if (this.isXline === true) {
                this.areaLine[8].ox = l.ox;
                this.areaLine[9].ox = l.ox;
                this.areaLine[10].x2 = (this.w / 2) + l.ox;
                this.areaLine[11].x1 = (this.w / 2) + l.ox;
                this.areaLine[5].x2 = (this.w / 2) + l.ox;
                this.areaLine[7].x1 = (this.w / 2) + l.ox;
              }
              this.areaLine[4].x2 = (this.w / 2) + l.ox;
              this.areaLine[6].x1 = (this.w / 2) + l.ox;
              break;
            case '9': // 縦下
              if (this.isXline === true) {
                this.areaLine[8].ox = l.ox;
                this.areaLine[9].ox = l.ox;
                this.areaLine[10].x2 = (this.w / 2) + l.ox;
                this.areaLine[11].x1 = (this.w / 2) + l.ox;
                this.areaLine[4].x2 = (this.w / 2) + l.ox;
                this.areaLine[6].x1 = (this.w / 2) + l.ox;
              }
              this.areaLine[5].x2 = (this.w / 2) + l.ox;
              this.areaLine[7].x1 = (this.w / 2) + l.ox;
              break;
            case '0': // 0:縦左上
            case '1': // 1:縦左下
            case '2': // 2:縦右上
            case '3': // 3:縦右下
          }


        } else {              // 横線
          l.oy = y - l.y1;
          if ((-this.h / 2) > l.oy) {
            l.oy = -this.h / 2;
          } else if (l.oy > (this.h / 2)) {
            l.oy = this.h / 2;
          }
          l.oy = Math.round(l.oy / 10) * 10;
          switch (l.name) {
            case '10':  // 横右
              if (this.isYline === true) {
                this.areaLine[8].y2 = (this.h / 2) + l.oy;
                this.areaLine[9].y1 = (this.h / 2) + l.oy;
                this.areaLine[10].oy = l.oy;
                this.areaLine[11].oy = l.oy;
                this.areaLine[2].y2 = (this.h / 2) + l.oy;
                this.areaLine[3].y1 = (this.h / 2) + l.oy;
              }
              this.areaLine[0].y2 = (this.h / 2) + l.oy;
              this.areaLine[1].y1 = (this.h / 2) + l.oy;
              break;
            case '11':  // 横左
              if (this.isYline === true) {
                this.areaLine[8].y2 = (this.h / 2) + l.oy;
                this.areaLine[9].y1 = (this.h / 2) + l.oy;
                this.areaLine[10].oy = l.oy;
                this.areaLine[11].oy = l.oy;
                this.areaLine[0].y2 = (this.h / 2) + l.oy;
                this.areaLine[1].y1 = (this.h / 2) + l.oy;
              }
              this.areaLine[2].y2 = (this.h / 2) + l.oy;
              this.areaLine[3].y1 = (this.h / 2) + l.oy;
              break;
            case '4': // 4:横左上
            case '5': // 5:横左下
            case '6': // 6:横右上
            case '7': // 7:横右下
          }

        }
        this.ariaNum4RectArea();
        console.log('X:', x + ' Y:', y);
      }
    }
    this.istapX = false;
    this.istapY = false;
    this.draw();
  }


  public ariaNum4RectArea() {
    const xlY = this.areaLine[10].oy;
    const xrY = this.areaLine[11].oy;
    const yuX = this.areaLine[8].ox;
    const ylX = this.areaLine[9].ox;

    const yluX = this.areaLine[0].ox;
    const yllX = this.areaLine[1].ox;
    const yruX = this.areaLine[2].ox;
    const yrlX = this.areaLine[3].ox;

    const xruY = this.areaLine[4].oy;
    const xrlY = this.areaLine[5].oy;
    const xluY = this.areaLine[6].oy;
    const xllY = this.areaLine[7].oy;

    console.log((this.w / 2) + (yuX) - (yruX));

    this.areaRect[0].x = 0 + (yluX);
    this.areaRect[0].y = 0 + (xruY);
    this.areaRect[0].w = (this.w / 2) + (yuX) - (yluX);
    this.areaRect[0].h = (this.h / 2) + (xlY) - (xruY);

    this.areaRect[1].x = (this.w / 2) + (yuX);
    this.areaRect[1].y = 0 + (xluY);
    this.areaRect[1].w = (this.w / 2) - (yuX) + (yruX);
    this.areaRect[1].h = (this.h / 2) + (xrY) - (xluY);

    this.areaRect[2].x = 0 + (yllX);
    this.areaRect[2].y = (this.h / 2) + (xlY) ;
    this.areaRect[2].w = (this.w / 2) + (ylX) - (yllX);
    this.areaRect[2].h = (this.h / 2) - (xlY) + (xrlY);

    this.areaRect[3].x = (this.w / 2) + (ylX);
    this.areaRect[3].y = (this.h / 2) + (xrY);
    this.areaRect[3].w = (this.w / 2) - (ylX) + (yrlX);
    this.areaRect[3].h = (this.h / 2) - (xrY) + (xllY);
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
        if ((((l.x1 + l.ox - 10) < x) && (x < (l.x1 + l.ox + 10))) && ((l.y1 < y) && (y < l.y2))) {
          this.istapX = true;
          l.isMove = true;
          break;
        }
      } else {  // 横線
        if ((((l.y1 + l.oy - 10) < y) && (y < (l.y1 + l.oy + 10))) && ((l.x1 < x) && (x < l.x2))) {
          this.istapY = true;
          l.isMove = true;
          break;
        }
      }
    }
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
        if ((((l.x1 + l.ox - 10) < x) && (x < (l.x1 + l.ox + 10))) && ((l.y1 < y) && (y < l.y2))) {
          if (this.istapX === true) {
            console.log('tapx ' + 'X:', x + ' Y:', y);
            this.handleTapX();
          }
          break;
        }
      } else {  // 横線
        if ((((l.y1 + l.oy - 10) < y) && (y < (l.y1 + l.oy + 10))) && ((l.x1 < x) && (x < l.x2))) {
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
    if (this.isYline === true) {
      if (this.isXline === false) {
        this.isXline = true;
        this.areaLine[8].color = 'rgba(0,0,0,1)';
        this.areaLine[9].color = 'rgba(0,0,0,1)';
      } else {
        this.isXline = false;
        this.areaLine[8].color = 'rgba(255,0,0,1)';
        this.areaLine[9].color = 'rgba(0,0,255,1)';
      }
    }
  }

  public areaNum4YTap() {
    if (this.isXline === true) {
      if (this.isYline === false) {
        this.isYline = true;
        this.areaLine[10].color = 'rgba(0,0,0,1)';
        this.areaLine[11].color = 'rgba(0,0,0,1)';
      } else {
        this.isYline = false;
        this.areaLine[10].color = 'rgba(255,0,0,1)';
        this.areaLine[11].color = 'rgba(0,0,255,1)';
      }
    }
  }

  handleEvent(event) {
    if (this.isDrag === true) {
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
  }


  ngAfterViewInit() {

    const canvas = this.myCanvas.nativeElement;
    canvas.addEventListener('touchstart', this, false);
    canvas.addEventListener('touchend', this, false);
    canvas.addEventListener('touchmove', this, false);

    this.w = canvas.width;
    this.h = canvas.height;

    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    this.areaRect = [
      { x: 0, y: 0, w: this.w / 2, h: this.h / 2, color: 'rgba(255,0,0,0.2)' },   // エリア１
      { x: this.w / 2, y: 0, w: this.w / 2, h: this.h / 2, color: 'rgba(0,255,0,0.2)' },   // エリア２
      { x: 0, y: this.h / 2, w: this.w / 2, h: this.h / 2, color: 'rgba(255,255,0,0.2)' }, // エリア３
      { x: this.w / 2, y: this.h / 2, w: this.w / 2, h: this.h / 2, color: 'rgba(0,0,255,0.2)' }    // エリア４
    ];

    this.areaLine = [
      { name: '0', x1: w0, y1: h0, x2: w0, y2: h2, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 0:縦左上
      { name: '1', x1: w0, y1: h2, x2: w0, y2: h1, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 1:縦左下
      { name: '2', x1: w1, y1: h0, x2: w1, y2: h2, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 2:縦左下
      { name: '3', x1: w1, y1: h2, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 3:縦右下
      { name: '4', x1: w0, y1: h0, x2: w2, y2: h0, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 4:横左上
      { name: '5', x1: w0, y1: h1, x2: w2, y2: h1, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 5:横左下
      { name: '6', x1: w2, y1: h0, x2: w1, y2: h0, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' }, // 6:横右上
      { name: '7', x1: w2, y1: h1, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4 , isMove: false, color: 'rgba(128,128,128,1)' },  // 7:横右下
      { name: '8', x1: w2, y1: h0, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6 , isMove: false, color: 'rgba(0,0,0,1)' },  // 縦上
      { name: '9', x1: w2, y1: h2, x2: w2, y2: h1, ox: 0, oy: 0, lw: 6 , isMove: false, color: 'rgba(0,0,0,1)' },  // 縦下
      { name: '10', x1: w0, y1: h2, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6 , isMove: false, color: 'rgba(0,0,0,1)' },  // 横右
      { name: '11', x1: w2, y1: h2, x2: w1, y2: h2, ox: 0, oy: 0, lw: 6 , isMove: false, color: 'rgba(0,0,0,1)' },   // 横左
    ];

    console.log(this.areaNum);

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
