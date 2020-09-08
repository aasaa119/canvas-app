import { Component, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import { Lexer } from '@angular/compiler';
import { toUnicode } from 'punycode';

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
        if (r.ishide === false) {
          ctx.fillStyle = r.color;
          ctx.fillRect(r.x, r.y, r.w, r.h);
        }
      }
      // エリア選択ライン描画
      for (const l of this.areaLine) {
        if (l.ishide === false) {
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
  }

  public touchMove(event) {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left;
    const y = touchY - rect.top;

    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    for (const l of this.areaLine) {
      if (l.isMove === true && l.ishide === false) {
        if (l.x1 === l.x2) {   // 縦線
          switch (l.name) {
            case '8': // 縦上
              l.ox = x - l.x1;
              if ((-w2) > l.ox) {
                l.ox = -w2;
              } else if (l.ox > (w2)) {
                l.ox = w2;
              }
              l.ox = Math.round(l.ox / 10) * 10;
              if (this.isXline === true) {
                this.areaLine[8].ox = l.ox;
                this.areaLine[9].ox = l.ox;
                this.areaLine[10].x2 = (w2) + l.ox;
                this.areaLine[11].x1 = (w2) + l.ox;
                this.areaLine[5].x2 = (w2) + l.ox;
                this.areaLine[7].x1 = (w2) + l.ox;
              }
              this.areaLine[4].x2 = (w2) + l.ox;
              this.areaLine[6].x1 = (w2) + l.ox;
              break;
            case '9': // 縦下
              l.ox = x - l.x1;
              if ((-this.w / 2) > l.ox) {
                l.ox = -this.w / 2;
              } else if (l.ox > (this.w / 2)) {
                l.ox = this.w / 2;
              }
              l.ox = Math.round(l.ox / 10) * 10;
              if (this.isXline === true) {
                this.areaLine[8].ox = l.ox;
                this.areaLine[9].ox = l.ox;
                this.areaLine[10].x2 = (w2) + l.ox;
                this.areaLine[11].x1 = (w2) + l.ox;
                this.areaLine[4].x2 = (w2) + l.ox;
                this.areaLine[6].x1 = (w2) + l.ox;
              }
              this.areaLine[5].x2 = (w2) + l.ox;
              this.areaLine[7].x1 = (w2) + l.ox;
              break;
            case '0': // 0:縦左上
              l.ox = x - l.x1;
              if ((w0) > l.ox) {
                l.ox = w0;
              } else if (l.ox > w1) {
                l.ox = w1;
              }
              l.ox = Math.round(l.ox / 10) * 10;
              break;
            case '1': // 1:縦左下
              l.ox = x - l.x1;
              if ((w0) > l.ox) {
                l.ox = w0;
              } else if (l.ox > w1) {
                l.ox = w1;
              }
              l.ox = Math.round(l.ox / 10) * 10;
              break;
            case '2': // 2:縦右上
              l.ox = x - l.x1;
              if ((w0) < l.ox) {
                l.ox = w0;
              } else if (l.ox < -w1) {
                l.ox = -w1;
              }
              l.ox = Math.round(l.ox / 10) * 10;
              break;
            case '3': // 3:縦右下
              l.ox = x - l.x1;
              if ((w0) < l.ox) {
                l.ox = w0;
              } else if (l.ox < -w1) {
                l.ox = -w1;
              }
              l.ox = Math.round(l.ox / 10) * 10;
              break;
          }
        } else {              // 横線
          switch (l.name) {
            case '10':  // 横右
              if (this.isYline === true) {
                l.oy = y - l.y1;
                if ((-this.h / 2) > l.oy) {
                  l.oy = -this.h / 2;
                } else if (l.oy > (this.h / 2)) {
                  l.oy = this.h / 2;
                }
                l.oy = Math.round(l.oy / 10) * 10;
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
              l.oy = y - l.y1;
              if ((-this.h / 2) > l.oy) {
                l.oy = -this.h / 2;
              } else if (l.oy > (this.h / 2)) {
                l.oy = this.h / 2;
              }
              l.oy = Math.round(l.oy / 10) * 10;
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
              l.oy = y - l.y1;
              if (h0 > l.oy) {
                l.oy = h0;
              } else if (l.oy > h1) {
                l.oy = h1;
              }
              l.oy = Math.round(l.oy / 10) * 10;
              break;
            case '5': // 5:横左下
              l.oy = y - l.y1;
              if (h0 < l.oy) {
                l.oy = h0;
              } else if (l.oy < -h1) {
                l.oy = -h1;
              }
              l.oy = Math.round(l.oy / 10) * 10;
              break;
            case '6': // 6:横右上
              l.oy = y - l.y1;
              if (h0 > l.oy) {
                l.oy = h0;
              } else if (l.oy > h1) {
                l.oy = h1;
              }
              l.oy = Math.round(l.oy / 10) * 10;
              break;
            case '7': // 7:横右下
              l.oy = y - l.y1;
              if (h0 < l.oy) {
                l.oy = h0;
              } else if (l.oy < -h1) {
                l.oy = -h1;
              }
              l.oy = Math.round(l.oy / 10) * 10;
              break;
          }

        }
        this.rectArea();
        // console.log('X:', x + ' Y:', y);
      }
    }
    this.istapX = false;
    this.istapY = false;
    this.draw();
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
      if (l.ishide === false) {
        // 縦線か横線かのチェック
        if (l.x1 === l.x2) {   // 縦線
          // console.log('tapx ' + 'X:', l.x1 + l.ox + ' Y:', y);
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
      if (l.ishide === false) {
        // 縦線か横線かのチェック
        if (l.x1 === l.x2) {   // 縦線
          if ((((l.x1 + l.ox - 10) < x) && (x < (l.x1 + l.ox + 10))) && ((l.y1 < y) && (y < l.y2))) {
            if (this.istapX === true) {
              // console.log('tapx ' + 'X:', x + ' Y:', y);
              this.handleTapX();
            }
            break;
          }
        } else {  // 横線
          if ((((l.y1 + l.oy - 10) < y) && (y < (l.y1 + l.oy + 10))) && ((l.x1 < x) && (x < l.x2))) {
            if (this.istapY === true) {
              // console.log('tapy ' + 'X:', x + ' Y:', y);
              this.handleTapY();
            }
            break;
          }
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
      this.areaNum2Tap();
    } else if (this.areaNum === 3) {
      this.areaNum3Tap();
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
      this.areaNum2Tap();
    } else if (this.areaNum === 3) {
      this.areaNum3Tap();
    } else {
      this.areaNum4YTap();
    }
    // this.textArea();
    // this.rectArea();
    // this.layer.getStage().draw();
  }

  public setAreaRect(num: number, x: number, y: number, w: number, h: number) {
    this.areaRect[num].x = x;
    this.areaRect[num].y = y;
    this.areaRect[num].w = w;
    this.areaRect[num].h = h;
  }


  // エリア数 2 の時のタップ処理
  public areaNum2Tap() {
    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    if (this.rotation === 0) {
      this.rotation = 1;
      // 縦→横変換
      // エリア表示
      this.setAreaRect(0, w0, h0, w1, h2);
      this.setAreaRect(1, w0, h2, w1, h2);

      // エリア設定ライン
      this.areaLine[8].ishide = true;
      this.areaLine[9].ishide = true;
      this.areaLine[10].ishide = false;
      this.areaLine[11].ishide = false;

      // テキスト表示
      // this.ta1.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 2 - 10, y: (this.canvasHeight / 4) * 1 - 10 });
      // this.ta2.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 2 - 10, y: (this.canvasHeight / 4) * 3 - 10 });
    } else {
      this.rotation = 0;
      // 横→縦
      this.setAreaRect(0, w0, h0, w2, h1);
      this.setAreaRect(1, w2, h0, w2, h1);

      // エリア設定ライン
      this.areaLine[8].ishide = false;
      this.areaLine[9].ishide = false;
      this.areaLine[10].ishide = true;
      this.areaLine[11].ishide = true;

      // テキスト表示
      // this.ta1.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 1 - 10, y: (this.canvasHeight / 4) * 2 - 10 });
      // this.ta2.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 3 - 10, y: (this.canvasHeight / 4) * 2 - 10 });
    }
  }

  // エリア数 3 のタップ処理
  public areaNum3Tap() {
    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    if (this.rotation === 0) {
      this.rotation = 1;
      // エリア表示
      this.setAreaRect(0, w0, h0, w2, h2);
      this.setAreaRect(1, w2, h0, w2, h1);
      this.setAreaRect(2, w0, h2, w2, h2);

      // // エリア設定ライン
      this.areaLine[8].ishide = false;
      this.areaLine[9].ishide = false;
      this.areaLine[10].ishide = false;
      this.areaLine[11].ishide = true;

      // テキスト表示
      // this.ta1.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 1 - 10, y: (this.canvasHeight / 4) * 1 - 10 });
      // this.ta2.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 3 - 10, y: (this.canvasHeight / 4) * 2 - 10 });
      // this.ta3.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 1 - 10, y: (this.canvasHeight / 4) * 3 - 10 });

    } else if (this.rotation === 1) {
      this.rotation = 2;
      // // エリア表示
      this.setAreaRect(0, w0, h0, w2, h2);
      this.setAreaRect(1, w2, h0, w2, h2);
      this.setAreaRect(2, w0, h2, w1, h2);

      // // エリア設定ライン
      this.areaLine[8].ishide = false;
      this.areaLine[9].ishide = true;
      this.areaLine[10].ishide = false;
      this.areaLine[11].ishide = false;

      // テキスト表示
      // this.ta1.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 1 - 10, y: (this.canvasHeight / 4) * 1 - 10 });
      // this.ta2.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 3 - 10, y: (this.canvasHeight / 4) * 1 - 10 });
      // this.ta3.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 2 - 10, y: (this.canvasHeight / 4) * 3 - 10 });

    } else if (this.rotation === 2) {
      this.rotation = 3;
      // エリア表示
      this.setAreaRect(0, w0, h0, w2, h1);
      this.setAreaRect(1, w2, h0, w2, h2);
      this.setAreaRect(2, w2, h2, w2, h2);

      // // エリア設定ライン
      this.areaLine[8].ishide = false;
      this.areaLine[9].ishide = false;
      this.areaLine[10].ishide = true;
      this.areaLine[11].ishide = false;

      // テキスト表示
      // this.ta1.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 1 - 10, y: (this.canvasHeight / 4) * 2 - 10 });
      // this.ta2.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 3 - 10, y: (this.canvasHeight / 4) * 1 - 10 });
      // this.ta3.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 3 - 10, y: (this.canvasHeight / 4) * 3 - 10 });
    } else {
      this.rotation = 0;
      // エリア表示
      this.setAreaRect(0, w0, h0, w1, h2);
      this.setAreaRect(1, w0, h2, w2, h2);
      this.setAreaRect(2, w2, h2, w2, h2);

      // // エリア設定ライン
      this.areaLine[8].ishide = true;
      this.areaLine[9].ishide = false;
      this.areaLine[10].ishide = false;
      this.areaLine[11].ishide = false;

      // テキスト表示
      // this.ta1.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 2 - 10, y: (this.canvasHeight / 4) * 1 - 10 });
      // this.ta2.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 1 - 10, y: (this.canvasHeight / 4) * 3 - 10 });
      // this.ta3.getStage().absolutePosition({ x: (this.canvasWidth / 4) * 3 - 10, y: (this.canvasHeight / 4) * 3 - 10 });
    }
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


  public rectArea() {
    const xlY = this.areaLine[10].oy;
    const xrY = this.areaLine[11].oy;
    const yuX = this.areaLine[8].ox;
    const ylX = this.areaLine[9].ox;

    if (this.areaNum === 1) {
    } else if (this.areaNum === 2) {
      this.ariaNum2RectArea(xlY, xrY, yuX, ylX);
    } else if (this.areaNum === 3) {
      this.ariaNum3RectArea(xlY, xrY, yuX, ylX);
    } else {
      this.ariaNum4RectArea(xlY, xrY, yuX, ylX);
    }
  }


  public ariaNum2RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {

    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    if (this.rotation === 0) {
      this.setAreaRect(0, w0, h0, w2 + yuX, h1);
      this.setAreaRect(1, w2 + yuX, h0, w2 - yuX, h1);
    } else {
      this.setAreaRect(0, w0, h0, w1, h2 + xlY);
      this.setAreaRect(1, w0, h2 + xlY, w1, h2 - xlY);
    }
  }
  public ariaNum3RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {

    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    if (this.rotation === 0) {
      this.setAreaRect(0, w0, h0, w1, h2 + xlY);
      this.setAreaRect(1, w0, h2 + xlY, w2 + (ylX) , h2 - xlY);
      this.setAreaRect(2, w2 + ylX, h2 + xrY, w2 - ylX, h2 - xrY);
    } else if (this.rotation === 1) {
      this.setAreaRect(0, w0, h0, w2 + yuX, h2 + xlY);
      this.setAreaRect(1, w2 + yuX, h0 , w2 - (yuX) , h1);
      this.setAreaRect(2, w0 , h2 + xlY, w2 + ylX, h2 - xlY);
    } else if (this.rotation === 2) {
      this.setAreaRect(0, w0, h0, w2 + (yuX), h2 + (xlY));
      this.setAreaRect(1, w2 + (yuX), h0 , w2 - (yuX) , h2 + (xrY));
      this.setAreaRect(2, w0 , h2 + (xlY), w1 , h2 - (xlY));
    } else {
      this.setAreaRect(0, w0, h0, w2 + (yuX), h1);
      this.setAreaRect(1, w2 + (yuX), h0 , w2 - (yuX) , h2 + (xrY));
      this.setAreaRect(2, w2  + (ylX) , h2 + (xlY), w2  - (ylX) , h2 - (xlY));
    }
  }
  public ariaNum4RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {

    const yluX = this.areaLine[0].ox;
    const yllX = this.areaLine[1].ox;
    const yruX = this.areaLine[2].ox;
    const yrlX = this.areaLine[3].ox;

    const xruY = this.areaLine[4].oy;
    const xrlY = this.areaLine[5].oy;
    const xluY = this.areaLine[6].oy;
    const xllY = this.areaLine[7].oy;

    this.setAreaRect(0, 0 + (yluX), 0 + (xruY), (this.w / 2) + (yuX) - (yluX), (this.h / 2) + (xlY) - (xruY));
    this.setAreaRect(1, (this.w / 2) + (yuX), 0 + (xluY), (this.w / 2) - (yuX) + (yruX), (this.h / 2) + (xrY) - (xluY));
    this.setAreaRect(2, 0 + (yllX), (this.h / 2) + (xlY), (this.w / 2) + (ylX) - (yllX), (this.h / 2) - (xlY) + (xrlY));
    this.setAreaRect(3, (this.w / 2) + (ylX), (this.h / 2) + (xrY), (this.w / 2) - (ylX) + (yrlX), (this.h / 2) - (xrY) + (xllY));
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



    switch (this.areaNum) {
      case 1:
        this.areaRect = [
          { x: w0, y: h0, w: w1, h: h1, ishide: false, color: 'rgba(255,0,0,0.2)' },   // エリア１
          { x: w0, y: h2, w: w1, h: h2, ishide: true, color: 'rgba(0,255,0,0.2)' },   // エリア２
          { x: w2, y: h2, w: w2, h: h2, ishide: true, color: 'rgba(255,255,0,0.2)' },  // エリア３
          { x: w2, y: h2, w: w2, h: h2, ishide: true, color: 'rgba(0,0,255,0.2)' }    // エリア４
        ];
        this.areaLine = [
          { name: '0', x1: w0, y1: h0, x2: w0, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 0:縦左上
          { name: '1', x1: w0, y1: h2, x2: w0, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 1:縦左下
          { name: '2', x1: w1, y1: h0, x2: w1, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 2:縦左下
          { name: '3', x1: w1, y1: h2, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 3:縦右下
          { name: '4', x1: w0, y1: h0, x2: w2, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 4:横左上
          { name: '5', x1: w0, y1: h1, x2: w2, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 5:横左下
          { name: '6', x1: w2, y1: h0, x2: w1, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 6:横右上
          { name: '7', x1: w2, y1: h1, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' },  // 7:横右下
          { name: '8', x1: w2, y1: h0, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦上
          { name: '9', x1: w2, y1: h2, x2: w2, y2: h1, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦下
          { name: '10', x1: w0, y1: h2, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },  // 横右
          { name: '11', x1: w2, y1: h2, x2: w1, y2: h2, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },   // 横左
        ];
        break;
      case 2:
        this.areaRect = [
          { x: w0, y: h0, w: w2, h: h1, ishide: false, color: 'rgba(255,0,0,0.2)' },   // エリア１
          { x: w2, y: h0, w: w2, h: h1, ishide: false, color: 'rgba(0,255,0,0.2)' },   // エリア２
          { x: w2, y: h2, w: w2, h: h2, ishide: true, color: 'rgba(255,255,0,0.2)' },  // エリア３
          { x: w2, y: h2, w: w2, h: h2, ishide: true, color: 'rgba(0,0,255,0.2)' }    // エリア４
        ];
        this.areaLine = [
          { name: '0', x1: w0, y1: h0, x2: w0, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 0:縦左上
          { name: '1', x1: w0, y1: h2, x2: w0, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 1:縦左下
          { name: '2', x1: w1, y1: h0, x2: w1, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 2:縦左下
          { name: '3', x1: w1, y1: h2, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 3:縦右下
          { name: '4', x1: w0, y1: h0, x2: w2, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 4:横左上
          { name: '5', x1: w0, y1: h1, x2: w2, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 5:横左下
          { name: '6', x1: w2, y1: h0, x2: w1, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 6:横右上
          { name: '7', x1: w2, y1: h1, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' },  // 7:横右下
          { name: '8', x1: w2, y1: h0, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦上
          { name: '9', x1: w2, y1: h2, x2: w2, y2: h1, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦下
          { name: '10', x1: w0, y1: h2, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },  // 横右
          { name: '11', x1: w2, y1: h2, x2: w1, y2: h2, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },   // 横左
        ];
        break;
      case 3:
        this.areaRect = [
          { x: w0, y: h0, w: w1, h: h2, ishide: false, color: 'rgba(255,0,0,0.2)' },   // エリア１
          { x: w0, y: h2, w: w2, h: h2, ishide: false, color: 'rgba(0,255,0,0.2)' },   // エリア２
          { x: w2, y: h2, w: w2, h: h2, ishide: false, color: 'rgba(255,255,0,0.2)' },  // エリア３
          { x: w2, y: h2, w: w2, h: h2, ishide: true, color: 'rgba(0,0,255,0.2)' }    // エリア４
        ];
        this.areaLine = [
          { name: '0', x1: w0, y1: h0, x2: w0, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 0:縦左上
          { name: '1', x1: w0, y1: h2, x2: w0, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 1:縦左下
          { name: '2', x1: w1, y1: h0, x2: w1, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 2:縦左下
          { name: '3', x1: w1, y1: h2, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 3:縦右下
          { name: '4', x1: w0, y1: h0, x2: w2, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 4:横左上
          { name: '5', x1: w0, y1: h1, x2: w2, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 5:横左下
          { name: '6', x1: w2, y1: h0, x2: w1, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 6:横右上
          { name: '7', x1: w2, y1: h1, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' },  // 7:横右下
          { name: '8', x1: w2, y1: h0, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: true, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦上
          { name: '9', x1: w2, y1: h2, x2: w2, y2: h1, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦下
          { name: '10', x1: w0, y1: h2, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 横右
          { name: '11', x1: w2, y1: h2, x2: w1, y2: h2, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },   // 横左
        ];
        break;
      case 4:
        this.areaRect = [
          { x: w0, y: h0, w: w2, h: h2, ishide: false, color: 'rgba(255,0,0,0.2)' },   // エリア１
          { x: w2, y: h0, w: w2, h: h2, ishide: false, color: 'rgba(0,255,0,0.2)' },   // エリア２
          { x: w0, y: h2, w: w2, h: h2, ishide: false, color: 'rgba(255,255,0,0.2)' },  // エリア３
          { x: w2, y: h2, w: w2, h: h2, ishide: false, color: 'rgba(0,0,255,0.2)' }    // エリア４
        ];
        this.areaLine = [
          { name: '0', x1: w0, y1: h0, x2: w0, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 0:縦左上
          { name: '1', x1: w0, y1: h2, x2: w0, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 1:縦左下
          { name: '2', x1: w1, y1: h0, x2: w1, y2: h2, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 2:縦左下
          { name: '3', x1: w1, y1: h2, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 3:縦右下
          { name: '4', x1: w0, y1: h0, x2: w2, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 4:横左上
          { name: '5', x1: w0, y1: h1, x2: w2, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 5:横左下
          { name: '6', x1: w2, y1: h0, x2: w1, y2: h0, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' }, // 6:横右上
          { name: '7', x1: w2, y1: h1, x2: w1, y2: h1, ox: 0, oy: 0, lw: 4, ishide: false, isMove: false, color: 'rgba(128,128,128,1)' },  // 7:横右下
          { name: '8', x1: w2, y1: h0, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦上
          { name: '9', x1: w2, y1: h2, x2: w2, y2: h1, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 縦下
          { name: '10', x1: w0, y1: h2, x2: w2, y2: h2, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },  // 横右
          { name: '11', x1: w2, y1: h2, x2: w1, y2: h2, ox: 0, oy: 0, lw: 6, ishide: false, isMove: false, color: 'rgba(0,0,0,1)' },   // 横左
        ];
        break;
    }
    // console.log(this.areaNum);

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
