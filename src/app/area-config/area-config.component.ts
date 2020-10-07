import { Component, ViewChild, OnInit, AfterViewInit, OnChanges, Input , SimpleChanges } from '@angular/core';
import { Lexer } from '@angular/compiler';
import { toUnicode } from 'punycode';


@Component({
  selector: 'app-area-config',
  templateUrl: './area-config.component.html',
  styleUrls: ['./area-config.component.css']
})
export class AreaConfigComponent implements OnInit, AfterViewInit , OnChanges {

  @ViewChild('myCanvas') myCanvas: any;
  @Input() inDoorMode: number;      // 室内機No
  @Input() areaNum: number;        // 接続エリア数
  @Input() isDrag: boolean;

  public w = 0;     // 描画エリア
  public h = 0;     // 描画エリア

  public img;

  public gridx = 40;      // X軸グリッドサイズ
  public gridy = 40;      // Y軸グリッドサイズ
  public offsetX = 20;    // X描画エリアオフセット 描画エリアの左右にマージンを設ける
  public offsetY = 20;    // Y描画エリアオフセット 描画エリアの上下にマージンを設ける
  public touchsize = 10;  // Lineをタッチした時の閾値ライン座標 ±touchsizeでタッチを判断する

  private rotation = 0;   // 接続エリア数が 2or3の時の描画モード

  public istapX = false;
  public istapY = false;
  private isXline = true;
  private isYline = true;

  /* エリア表示データ */
  public areaRect = [
    { x: 0, y: 0, w: 0, h: 0, isHide: false, isTouch: false, area: 0  },  // エリア１
    { x: 0, y: 0, w: 0, h: 0, isHide: false, isTouch: false, area: 0  },  // エリア２
    { x: 0, y: 0, w: 0, h: 0, isHide: false, isTouch: false, area: 0  },  // エリア３
    { x: 0, y: 0, w: 0, h: 0, isHide: false, isTouch: false, area: 0  }   // エリア４
  ];
  public areaLine = [
    { n: 0, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 0:縦左上
    { n: 1, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 1:縦左下
    { n: 2, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 2:縦右上
    { n: 3, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 3:縦右下
    { n: 4, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 4:横左上
    { n: 5, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 5:横左下
    { n: 6, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' }, // 6:横右上
    { n: 7, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'gray' },  // 7:横右下
    { n: 8, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'black' },  // 8:縦上
    { n: 9, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'black' },  // 9:縦下
    { n: 10, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'black' },  // 10:横右
    { n: 11, x1: 0, y1: 0, x2: 0, y2: 0, ox: 0, oy: 0, isDragEnable: true , isHide: false, isMove: false, color: 'black' },   // 11:横左
  ];

  public areaColor = ['rgba(255,255,255,0.0)', 'rgba(0,255,0,0.2)', 'rgba(0,0,255,0.2)', 'rgba(255,0,0,0.2)', 'rgba(255,255,0,0.2)'];

  constructor() { }

  ngOnInit() {
    console.log('ngOnInit()');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('[ngOnChanges] execute');
    // SimpleChanges を使って変更前の値と変更後の値、そして変更されているかをログ出力する
    // tslint:disable-next-line: forin
    for (const prop in changes) {
      const change = changes[prop];
      console.log(`${prop}: ${change.firstChange}, ${change.previousValue} => ${change.currentValue}`);

      if ( prop === 'areaNum') {
        this.ngAfterViewInit();
      } else if ( prop === 'inDoorMode') {
        // 室内機設定が変わった時

        let isSet = false;

        for (const r of this.areaRect) {
          if ( r.area === change.previousValue) {
            isSet = true;
          }
        }


        if ( isSet === false ) {
          // 室内機の設定を保留する
        } else {

        }



        // if ( this.areaNum === 1 ) {
        //   for (const r of this.areaRect) {
        //     if ( r.area === 1) {
        //       isSet = true;
        //     }
        //   }
        // } else if ( this.areaNum === 2 ) {
        //   if (this.rotation === 0 ) {
        //   } else {

        //   }
        // } else if ( this.areaNum === 3 ) {
        //   if (this.rotation === 0 ) {
        //   } else if ( this.rotation === 1 ) {
        //   } else if ( this.rotation === 2 ) {
        //   } else {
        //   }
        // } else if ( this.areaNum === 4 ) {
        // }

        console.log('isSet: ' + isSet);


        // let isChange = false;



        // for (const r of this.areaRect) {
        //   console.log('r.area: ' + r.area);
        //   console.log('change.previousValue: ' + change.previousValue);
        //   if ( change.previousValue === r.area) {
        //     isChange = true;
        //   }
        // }
        // if ( isChange === false) {
        //     this.inDoorMode = change.previousValue;
        //     console.log('this.InDoorMode: ' + this.inDoorMode);
        // }
        this.draw();
      }
    }
    console.log('ngOnChanges()');
  }
  public drawLine(ctx: any , x1: number , y1: number , x2: number , y2: number ) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }


  public drawGred(ctx: any) {
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.lineWidth = 1;
    // 横線描画
    ctx.setLineDash([4, 6]);
    for (let i = 0; i <= this.h; i += this.gridy) {
      this.drawLine(ctx , 0 + this.offsetX , i + this.offsetY , this.w + this.offsetX , i + this.offsetY );
    }
    // 縦線描画
    for (let i = 0; i <= this.w; i += this.gridx) {
      this.drawLine(ctx , i + this.offsetX , 0 + this.offsetY , i + this.offsetX , this.h + this.offsetY );
    }
    ctx.setLineDash([1]);
  }

  public drawArea(ctx: any) {
    for (const r of this.areaRect) {
      if (r.isHide === false) {
        ctx.fillStyle = this.areaColor[r.area];
        ctx.fillRect(r.x + this.offsetX, r.y + this.offsetY, r.w, r.h);
      }
    }
  }

  public drawAreaLine(ctx: any) {
    for (const l of this.areaLine) {
      if (l.isHide === false) {
        ctx.lineWidth = (l.n < 8 ) ? 4 : 6;
        ctx.strokeStyle = l.color;
        if (l.isMove === true) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
        }
        this.drawLine(ctx ,
          l.x1 + l.ox + this.offsetX ,
          l.y1 + l.oy + this.offsetY ,
          l.x2 + l.ox + this.offsetX ,
          l.y2 + l.oy + this.offsetY );
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    }
  }

  public draw() {
    const canvas = this.myCanvas.nativeElement;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      // 再描画の為消去
      ctx.clearRect(0, 0, this.w + (this.offsetX * 2), this.h + (this.offsetY * 2));
      // グリット描画
      this.drawGred(ctx);
      // エリア描画
      this.drawArea(ctx);
      // エリア選択ライン描画
      this.drawAreaLine(ctx);
    }
  }

  public yLineOffsetX(l: { ox: number; x1: number; }, x: number, min: number, max: number): number {
    l.ox = x - l.x1;
    console.log(l.ox);
    console.log('max:' + max);
    console.log('min:' + min);
    if ( min > l.ox ) {
      l.ox = min;
    } else if ( l.ox > max ) {
      l.ox = max;
    }
    console.log(l.ox);
    l.ox = Math.round(l.ox / this.gridx) * this.gridx;
    return(l.ox);
  }

  // 縦上
  public yuMove(l, x) {
    const w2 = this.w / 2;
    let min = 0;
    let max = 0;

    if ( this.areaNum === 1 ) {
      // 非表示のため処理無し
    } else if (this.areaNum === 2) {
      if (this.rotation === 0 ) {
        min = - w2  + ( this.areaLine[0].ox + this.gridx);
        max = w2 + ( this.areaLine[2].ox - this.gridx);
      } else {
        // 非表示のため処理無し
      }
    } else if (this.areaNum === 3) {
      if (this.rotation === 0 ) {
        // 非表示のため処理無し
      } else if ( this.rotation === 1 ) {
        if ( this.areaLine[0].ox > this.areaLine[1].ox) {
          min = - w2  + ( this.areaLine[0].ox + this.gridx);
        } else {
          min = - w2  + ( this.areaLine[1].ox + this.gridx);
        }
        max = w2 + ( this.areaLine[2].ox - this.gridx);
      } else if ( this.rotation === 2 ) {
        min = - w2  + ( this.areaLine[0].ox + this.gridx);
        max = w2 + ( this.areaLine[2].ox - this.gridx);
      } else if ( this.rotation === 3 ) {
        min = - w2  + ( this.areaLine[0].ox + this.gridx);
        if ( this.areaLine[2].ox < this.areaLine[3].ox ) {
          max = w2 + ( this.areaLine[2].ox - this.gridx);
        } else {
          max = w2 + ( this.areaLine[3].ox - this.gridx);
        }
      } else {

      }
    } else {
      if (this.isXline === true) {
        if ( this.areaLine[0].ox > this.areaLine[1].ox ) {
          min = - w2  + ( this.areaLine[0].ox + this.gridx);
        } else {
          min = - w2  + ( this.areaLine[1].ox + this.gridx);
        }
        if ( this.areaLine[2].ox < this.areaLine[3].ox ) {
          max = w2 + ( this.areaLine[2].ox - this.gridx);
        } else {
          max = w2 + ( this.areaLine[3].ox - this.gridx);
        }
      } else {
        min = - w2  + ( this.areaLine[0].ox + this.gridx);
        max = w2 + ( this.areaLine[2].ox - this.gridx);
      }
    }

    const ox =  this.yLineOffsetX(l, x, min , max );
    if (this.isXline === true) {
      this.areaLine[8].ox = ox;
      this.areaLine[10].x2 = (w2) + ox;
      this.areaLine[11].x1 = (w2) + ox;
      this.areaLine[5].x2 = (w2) + ox;
      this.areaLine[7].x1 = (w2) + ox;
    }
    this.areaLine[4].x2 = (w2) + ox;
    this.areaLine[6].x1 = (w2) + ox;
  }
  // 縦下
  public ylMove(l, x) {
    const w2 = this.w / 2;
    let max = 0;
    let min = 0;

    if ( this.areaNum === 1 ) {
      // 非表示のため処理無し
    } else if (this.areaNum === 2) {
      if (this.rotation === 0 ) {
        min = - w2  + ( this.areaLine[1].ox + this.gridx);
        max = w2 + ( this.areaLine[3].ox - this.gridx);
      } else {
        // 非表示のため処理無し
      }
    } else if (this.areaNum === 3) {
      if (this.rotation === 0 ) {
        min = - w2  + ( this.areaLine[1].ox + this.gridx);
        max = w2 + ( this.areaLine[3].ox - this.gridx);
      } else if ( this.rotation === 1 ) {
        if ( this.areaLine[0].ox > this.areaLine[1].ox) {
          min = - w2  + ( this.areaLine[0].ox + this.gridx);
        } else {
          min = - w2  + ( this.areaLine[1].ox + this.gridx);
        }
        max = w2 + ( this.areaLine[3].ox - this.gridx);
      } else if ( this.rotation === 2 ) {
        // 非表示のため処理なし
      } else if ( this.rotation === 3 ) {
        min = - w2  + ( this.areaLine[1].ox + this.gridx);
        if ( this.areaLine[2].ox < this.areaLine[3].ox ) {
          max = w2 + ( this.areaLine[2].ox - this.gridx);
        } else {
          max = w2 + ( this.areaLine[3].ox - this.gridx);
        }
      } else {

      }
    } else {
      if (this.isXline === true) {
        if ( this.areaLine[0].ox > this.areaLine[1].ox ) {
          min = - w2  + ( this.areaLine[0].ox + this.gridx);
        } else {
          min = - w2  + ( this.areaLine[1].ox + this.gridx);
        }
        if ( this.areaLine[2].ox < this.areaLine[3].ox ) {
          max = w2 + ( this.areaLine[2].ox - this.gridx);
        } else {
          max = w2 + ( this.areaLine[3].ox - this.gridx);
        }
      } else {
        min = - w2  + ( this.areaLine[1].ox + this.gridx);
        max = w2 + ( this.areaLine[3].ox - this.gridx);
      }

    }

    const ox =  this.yLineOffsetX(l, x, min , max );
    if (this.isXline === true) {
      this.areaLine[9].ox = ox;
      this.areaLine[10].x2 = (w2) + ox;
      this.areaLine[11].x1 = (w2) + ox;
      this.areaLine[4].x2 = (w2) + ox;
      this.areaLine[6].x1 = (w2) + ox;
    }
    this.areaLine[5].x2 = (w2) + ox;
    this.areaLine[7].x1 = (w2) + ox;
  }

  public sameBlankLineY( line , num2R, num3R , ox) {
    if ( this.areaNum === 1 ) {
      this.areaLine[line].ox = ox;
    } else if ((this.areaNum === 2) && (this.rotation === num2R )) {
      this.areaLine[line].ox = ox;
    } else if ((this.areaNum === 3) && (this.rotation === num3R )) {
      this.areaLine[line].ox = ox;
    }
  }

  // ブランクLine
  // 縦左上
  public yluMove(l, x) {
    const w0 = 0; const w2 = this.w / 2;
    const min: number = -w0;
    let max: number;
    if ( this.areaNum === 1 ) {
      max = this.areaLine[2].x1 + this.areaLine[2].ox - this.gridx;
    } else if ( this.areaNum === 2 ) {
      if (this.rotation === 0 ) {
        max = this.areaLine[8].x1 + (this.areaLine[8].ox - this.gridx);
      } else {
        max = this.areaLine[2].x1 + this.areaLine[2].ox - this.gridx;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        max = this.areaLine[2].x1 + this.areaLine[2].ox - this.gridx;
      } else if ( this.rotation === 1 ) {
        max = this.areaLine[8].x1 + (this.areaLine[8].ox - this.gridx);
      } else if ( this.rotation === 2 ) {
        max = this.areaLine[8].x1 + (this.areaLine[8].ox - this.gridx);
      } else if ( this.rotation === 3 ) {
        max = this.areaLine[8].x1 + (this.areaLine[8].ox - this.gridx);
      } else {

      }
    } else {
      max = w2 + (this.areaLine[8].ox - this.gridx);
    }
    const ox =  this.yLineOffsetX(l, x, min, max);
    this.sameBlankLineY( 1 , 0 , 3 , ox);
  }

  // 縦左下
  public yllMove(l, x) {
    const w0 = 0; const w2 = this.w / 2;
    const min = - w0;
    let max: number;
    if ( this.areaNum === 1 ) {
      max = this.areaLine[3].x1 + this.areaLine[3].ox - this.gridx;
    } else if ( this.areaNum === 2 ) {
      if (this.rotation === 0 ) {
        max = this.areaLine[9].x1 + (this.areaLine[8].ox - this.gridx);
      } else {
        max = this.areaLine[3].x1 + this.areaLine[3].ox - this.gridx;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        max = this.areaLine[9].x1 + (this.areaLine[8].ox - this.gridx);
      } else if ( this.rotation === 1 ) {
        max = this.areaLine[9].x1 + (this.areaLine[8].ox - this.gridx);
      } else if ( this.rotation === 2 ) {
        max = this.areaLine[3].x1 + this.areaLine[3].ox - this.gridx;
      } else if ( this.rotation === 3 ) {
        max = this.areaLine[9].x1 + (this.areaLine[8].ox - this.gridx);
      } else {

      }
    } else {
      max = w2 + (this.areaLine[9].ox - this.gridx);
    }
    const ox =  this.yLineOffsetX(l, x, min, max);
    this.sameBlankLineY( 0 , 0 , 3 , ox);
  }

  // 縦右上
  public yruMove(l, x) {
    const w0 = 0; const w2 = this.w / 2; const w1 = this.w;
    let min: number;
    const max = w0;

    if ( this.areaNum === 1 ) {
      min = -w1 + (this.areaLine[0].x1 + this.areaLine[0].ox) + this.gridx;
    } else if ( this.areaNum === 2 ) {
      if (this.rotation === 0 ) {
        min = - this.areaLine[8].x1 + ( this.areaLine[8].ox + this.gridx);
      } else {
        min = -w1 + (this.areaLine[0].x1 + this.areaLine[0].ox) + this.gridx;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        min = -w1 + (this.areaLine[0].x1 + this.areaLine[0].ox) + this.gridx;
      } else if ( this.rotation === 1 ) {
        min = - this.areaLine[8].x1 + ( this.areaLine[8].ox + this.gridx);
      } else if ( this.rotation === 2 ) {
        min = - this.areaLine[8].x1 + ( this.areaLine[8].ox + this.gridx);
      } else if ( this.rotation === 3 ) {
        min = - this.areaLine[8].x1 + ( this.areaLine[8].ox + this.gridx);
      } else {

      }
    } else {
      min = - this.areaLine[8].x1 + ( this.areaLine[8].ox + this.gridx);
    }

    const ox =  this.yLineOffsetX(l, x, min, max);
    this.sameBlankLineY( 3 , 0 , 1 , ox);
  }

  public yrlMove(l, x) {
    const w0 = 0; const w2 = this.w / 2; const w1 = this.w;
    let min: number;
    const max = w0;

    if ( this.areaNum === 1 ) {
      min = -w1 + (this.areaLine[1].x1 + this.areaLine[1].ox) + this.gridx;
    } else if ( this.areaNum === 2 ) {
      if (this.rotation === 0 ) {
        min = - this.areaLine[9].x1 + ( this.areaLine[9].ox + this.gridx);
      } else {
        min = -w1 + (this.areaLine[1].x1 + this.areaLine[1].ox) + this.gridx;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        min = - this.areaLine[9].x1 + ( this.areaLine[9].ox + this.gridx);
      } else if ( this.rotation === 1 ) {
        min = - this.areaLine[9].x1 + ( this.areaLine[9].ox + this.gridx);
      } else if ( this.rotation === 2 ) {
        min = -w1 + (this.areaLine[1].x1 + this.areaLine[1].ox) + this.gridx;
      } else if ( this.rotation === 3 ) {
        min = - this.areaLine[9].x1 + ( this.areaLine[9].ox + this.gridx);
      } else {

      }
    } else {
      min = - this.areaLine[9].x1 + ( this.areaLine[9].ox + this.gridx);
    }

    const ox =  this.yLineOffsetX(l, x, min, max);
    this.sameBlankLineY( 2 , 0 , 1 , ox);
  }

  public xLineOffsetY(l: { oy: number; y1: number; }, x: number, min: number, max: number): number {
    l.oy = x - l.y1;
    if ( min > l.oy ) {
      l.oy = min;
    } else if ( l.oy > max ) {
      l.oy = max;
    }
    l.oy = Math.round(l.oy / this.gridy) * this.gridy;
    return(l.oy);
  }

  public xlMove(l, y) {
    const h2 = this.h / 2;

    let min = 0;
    let max = 0;

    if ( this.areaNum === 1 ) {
      // 処理無し
    } else if (this.areaNum === 2) {
      if (this.rotation === 0 ) {
        // 非表示のため処理なし
      } else {
        min = - h2  + ( this.areaLine[4].oy + this.gridy);
        max = h2 + ( this.areaLine[5].oy - this.gridy);
      }
    } else if (this.areaNum === 3) {
      if (this.rotation === 0 ) {
        min = - h2  + ( this.areaLine[4].oy + this.gridy);
        if ( this.areaLine[5].oy < this.areaLine[7].oy ) {
          max = h2 + ( this.areaLine[5].oy - this.gridy);
        } else {
          max = h2 + ( this.areaLine[7].oy - this.gridy);
        }
      } else if ( this.rotation === 1 ) {
        min = - h2  + ( this.areaLine[4].oy + this.gridy);
        max = h2 + ( this.areaLine[5].oy - this.gridy);
      } else if ( this.rotation === 2 ) {
        if ( this.areaLine[4].oy > this.areaLine[6].oy) {
          min = - h2  + ( this.areaLine[4].oy + this.gridy);
        } else {
          min = - h2  + ( this.areaLine[6].oy + this.gridy);
        }
        max = h2 + ( this.areaLine[7].oy - this.gridy);
      } else if ( this.rotation === 3 ) {
        // 非表示のため処理なし
      } else {

      }
    } else {
      if (this.isYline === true) {
        if ( this.areaLine[4].oy > this.areaLine[6].oy) {
          min = - h2  + ( this.areaLine[4].oy + this.gridy);
        } else {
          min = - h2  + ( this.areaLine[6].oy + this.gridy);
        }
        if ( this.areaLine[5].oy < this.areaLine[7].oy ) {
          max = h2 + ( this.areaLine[5].oy - this.gridy);
        } else {
          max = h2 + ( this.areaLine[7].oy - this.gridy);
        }
      } else {
        min = - h2  + ( this.areaLine[4].oy + this.gridy);
        max = h2 + ( this.areaLine[5].oy - this.gridy);
      }
    }

    const oy =  this.xLineOffsetY(l, y, min, max);
    if (this.isYline === true) {
      this.areaLine[8].y2 = (h2) + oy;
      this.areaLine[9].y1 = (h2) + oy;
      this.areaLine[10].oy = oy;
      this.areaLine[11].oy = oy;
      this.areaLine[2].y2 = (h2) + oy;
      this.areaLine[3].y1 = (h2) + oy;
    }
    this.areaLine[0].y2 = (h2) + oy;
    this.areaLine[1].y1 = (h2) + oy;
  }

  public xrMove(l, y) {
    const h2 = this.h / 2;
    let min = 0;
    let max = 0;

    if ( this.areaNum === 1 ) {
      // 処理無し
    } else if (this.areaNum === 2) {
      if (this.rotation === 0 ) {

      } else {
        min = - h2  + ( this.areaLine[6].oy + this.gridy);
        max = h2 + ( this.areaLine[7].oy - this.gridy);
      }
    } else if (this.areaNum === 3) {
      if (this.rotation === 0 ) {
        min = - h2  + ( this.areaLine[6].oy + this.gridy);
        if ( this.areaLine[5].oy < this.areaLine[7].oy ) {
          max = h2 + ( this.areaLine[5].oy - this.gridy);
        } else {
          max = h2 + ( this.areaLine[7].oy - this.gridy);
        }
      } else if ( this.rotation === 1 ) {
        // 非表示のため処理なし
      } else if ( this.rotation === 2 ) {
        if ( this.areaLine[4].oy > this.areaLine[6].oy) {
          min = - h2  + ( this.areaLine[4].oy + this.gridy);
        } else {
          min = - h2  + ( this.areaLine[6].oy + this.gridy);
        }
        max = h2 + ( this.areaLine[7].oy - this.gridy);
      } else if ( this.rotation === 3 ) {
        min = - h2  + ( this.areaLine[6].oy + this.gridy);
        max = h2 + ( this.areaLine[7].oy - this.gridy);
      } else {

      }
    } else {
      if (this.isYline === true) {
        if ( this.areaLine[4].oy > this.areaLine[6].oy) {
          min = - h2  + ( this.areaLine[4].oy + this.gridy);
        } else {
          min = - h2  + ( this.areaLine[6].oy + this.gridy);
        }
        if ( this.areaLine[5].oy < this.areaLine[7].oy ) {
          max = h2 + ( this.areaLine[5].oy - this.gridy);
        } else {
          max = h2 + ( this.areaLine[7].oy - this.gridy);
        }
      } else {
        min = - h2  + ( this.areaLine[6].oy + this.gridy);
        max = h2 + ( this.areaLine[7].oy - this.gridy);
      }
    }
    const oy =  this.xLineOffsetY(l, y, min, max);
    if (this.isYline === true) {
      this.areaLine[8].y2 = (h2) + oy;
      this.areaLine[9].y1 = (h2) + oy;
      this.areaLine[10].oy = oy;
      this.areaLine[11].oy = oy;
      this.areaLine[0].y2 = (h2) + oy;
      this.areaLine[1].y1 = (h2) + oy;
    }
    this.areaLine[2].y2 = (h2) + oy;
    this.areaLine[3].y1 = (h2) + oy;
  }


  public sameBlankLineX( line , num2R, num3R , oy) {
    if ( this.areaNum === 1 ) {
      this.areaLine[line].oy = oy;
    } else if ((this.areaNum === 2) && (this.rotation === num2R )) {
      this.areaLine[line].oy = oy;
    } else if ((this.areaNum === 3) && (this.rotation === num3R )) {
      this.areaLine[line].oy = oy;
    }
  }

  // 横左上(4)
  public xluMove(l, y) {
    const h0 = 0 ; const h1 = this.h; const h2 = this.h / 2;
    const min = h0;
    let max: number;

    if ( this.areaNum === 1 ) {
      max = (this.areaLine[5].y1 + this.areaLine[5].oy) - this.gridy;
    } else if ( this.areaNum === 2 ) {
      if (this.rotation === 0 ) {
        max = (this.areaLine[5].y1 + this.areaLine[5].oy) - this.gridy;
      } else {
        max = this.areaLine[10].y1 + this.areaLine[10].oy - this.gridy;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        max = this.areaLine[10].y1 + this.areaLine[10].oy - this.gridy;
      } else if ( this.rotation === 1 ) {
        max = this.areaLine[10].y1 + this.areaLine[10].oy - this.gridy;
      } else if ( this.rotation === 2 ) {
        max = this.areaLine[10].y1 + this.areaLine[10].oy - this.gridy;
      } else if ( this.rotation === 3 ) {
        max = (this.areaLine[5].y1 + this.areaLine[5].oy) - this.gridy;
      } else {

      }
    } else {
      max = this.areaLine[10].y1 + this.areaLine[10].oy - this.gridy;
    }
    const oy =  this.xLineOffsetY(l, y, min, max);
    this.sameBlankLineX( 6 , 1 , 0 , oy);
  }

  // 横左下(5)
  public xllMove(l, y) {
    const h0 = 0 ; const h1 = this.h;
    let min: number;
    const max = h0;
    if ( this.areaNum === 1 ) {
      min = -h1 + (this.areaLine[4].y1 + this.areaLine[4].oy) + this.gridy;
    } else if ( this.areaNum === 2 ) {
      if ( this.rotation === 0 ) {
        min = -h1 + (this.areaLine[4].y1 + this.areaLine[4].oy) + this.gridy;
      } else {
        min = -(this.areaLine[10].y1) + this.areaLine[10].oy + this.gridy;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        min = -(this.areaLine[10].y1) + this.areaLine[10].oy + this.gridy;
      } else if ( this.rotation === 1 ) {
        min = -(this.areaLine[10].y1) + this.areaLine[10].oy + this.gridy;
      } else if ( this.rotation === 2 ) {
        min = -(this.areaLine[10].y1) + this.areaLine[10].oy + this.gridy;
      } else if ( this.rotation === 3 ) {
        min = -h1 + (this.areaLine[4].y1 + this.areaLine[4].oy) + this.gridy;
      } else {

      }
    } else {
      min = -(this.areaLine[10].y1) + this.areaLine[10].oy + this.gridy;
    }
    const oy =  this.xLineOffsetY(l, y, min, max);
    this.sameBlankLineX( 7 , 1 , 2 , oy);
  }

  // 横右上(6)
  public xruMove(l, y) {
    const h0 = 0 ; const h1 = this.h; const h2 = this.h / 2;
    const min = h0;
    let max: number;

    if ( this.areaNum === 1 ) {
      max = (this.areaLine[7].y1 + this.areaLine[7].oy) - this.gridy;
    } else if ( this.areaNum === 2 ) {
      if (this.rotation === 0 ) {
        max = (this.areaLine[7].y1 + this.areaLine[7].oy) - this.gridy;
      } else {
        max = this.areaLine[11].y1 + this.areaLine[11].oy - this.gridy;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        max = this.areaLine[11].y1 + this.areaLine[11].oy - this.gridy;
      } else if ( this.rotation === 1 ) {
        max = (this.areaLine[7].y1 + this.areaLine[7].oy) - this.gridy;
      } else if ( this.rotation === 2 ) {
        max = this.areaLine[11].y1 + this.areaLine[11].oy - this.gridy;
      } else if ( this.rotation === 3 ) {
        max = this.areaLine[11].y1 + this.areaLine[11].oy - this.gridy;
      } else {
        max = this.areaLine[11].y1 + this.areaLine[11].oy - this.gridy;
      }
    } else {
      max = this.areaLine[11].y1 + this.areaLine[11].oy - this.gridy;
    }
    const oy =  this.xLineOffsetY(l, y, min, max);
    this.sameBlankLineX( 4 , 1 , 0 , oy);
  }
  // 横右下(7)
  public xrlMove(l, y) {
    const h0 = 0 ; const h1 = this.h;
    let min: number;
    const max = h0;
    if ( this.areaNum === 1 ) {
      min = -h1 + (this.areaLine[6].y1 + this.areaLine[6].oy) + this.gridy;
    } else if ( this.areaNum === 2 ) {
      if ( this.rotation === 0 ) {
        min = -h1 + (this.areaLine[6].y1 + this.areaLine[6].oy) + this.gridy;
      } else {
        min = -(this.areaLine[11].y1) + this.areaLine[11].oy + this.gridy;
      }
    } else if ( this.areaNum === 3 ) {
      if (this.rotation === 0 ) {
        min = -(this.areaLine[11].y1) + this.areaLine[11].oy + this.gridy;
      } else if ( this.rotation === 1 ) {
        min = -h1 + (this.areaLine[6].y1 + this.areaLine[6].oy) + this.gridy;
      } else if ( this.rotation === 2 ) {
        min = -(this.areaLine[11].y1) + this.areaLine[11].oy + this.gridy;
      } else if ( this.rotation === 3 ) {
        min = -(this.areaLine[11].y1) + this.areaLine[11].oy + this.gridy;
      } else {

      }
    } else {
      min = -(this.areaLine[11].y1) + this.areaLine[11].oy + this.gridy;
    }
    const oy =  this.xLineOffsetY(l, y, min, max);
    this.sameBlankLineX( 5 , 1 , 2 , oy);
  }


  public touchMove(event) {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left - this.offsetX;
    const y = touchY - rect.top - this.offsetY;

    for (const l of this.areaLine) {
      if (l.isMove === true && l.isHide === false) {
        if (l.x1 === l.x2) {   // 縦線
          switch (l.n) {
            case 8: // 縦上
              this.yuMove(l, x);
              break;
            case 9: // 縦下
              this.ylMove(l, x);
              break;
            case 0: // 0:縦左上
              this.yluMove(l, x);
              break;
            case 1: // 1:縦左下
              this.yllMove(l, x);
              break;
            case 2: // 2:縦右上
              this.yruMove(l, x);
              break;
            case 3: // 3:縦右下
              this.yrlMove(l, x);
              break;
          }
        } else {              // 横線
          switch (l.n) {
            case 10:  // 横左
              this.xlMove(l, y);
              break;
            case 11:  // 横右
              this.xrMove(l, y);
              break;
            case 4: // 4:横左上
              this.xluMove(l, y);
              break;
            case 5: // 5:横左下
              this.xllMove(l, y);
              break;
            case 6: // 6:横右上
              this.xruMove(l, y);
              break;
            case 7: // 7:横右下
              this.xrlMove(l, y);
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

  public areaTouchStart(x: number , y: number ): boolean {
    for (const r of this.areaRect ) {
      if ( r.isHide === false ) {
        if ( (r.x < x ) && ( x < (r.x + r.w)) ) {
          if ( (r.y < y ) && ( y < (r.y + r.h)) ) {
            r.isTouch = true;
            return(true);
          }
        }
      }
    }
    return(false);
  }


  public lineTouchStart(x: number, y: number): boolean {
    let isTouch = false;

    // ライン上のタッチイベントかをチェックする
    for (const l of this.areaLine) {
      if (l.isHide === false && l.isDragEnable === true) {
        // 縦線か横線かのチェック
        if (l.x1 === l.x2) {   // 縦線
          // console.log('tapx ' + 'X:', l.x1 + l.ox + ' Y:', y);
          if ((((l.x1 + l.ox - this.touchsize) < x) && (x < (l.x1 + l.ox + this.touchsize))) && ((l.y1 < y) && (y < l.y2))) {
            if ((l.n === 8) || (l.n === 9)) {
              this.istapX = true;
            }
            l.isMove = true;
            isTouch = true;
            switch (l.n) {
              case 8: // 縦上
                if (this.isXline === true) {
                  this.areaLine[9].isMove = true;
                }
                break;
              case 9: // 縦下
                if (this.isXline === true) {
                  this.areaLine[8].isMove = true;
                }
                break;
              case 0: // 0:縦左上
                if (this.areaNum === 1) {
                  this.areaLine[1].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 0)) {
                  this.areaLine[1].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 3)) {
                  this.areaLine[1].isMove = true;
                }
                break;
              case 1: // 1:縦左下
                if (this.areaNum === 1) {
                  this.areaLine[0].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 0)) {
                  this.areaLine[0].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 3)) {
                  this.areaLine[0].isMove = true;
                }
                break;
              case 2: // 2:縦右上
                if (this.areaNum === 1) {
                  this.areaLine[3].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 0)) {
                  this.areaLine[3].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 1)) {
                  this.areaLine[3].isMove = true;
                }
                break;
              case 3: // 3:縦右下
                if (this.areaNum === 1) {
                  this.areaLine[2].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 0)) {
                  this.areaLine[2].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 1)) {
                  this.areaLine[2].isMove = true;
                }
                break;
            }
            break;
          }
        } else {  // 横線
          if ((((l.y1 + l.oy - this.touchsize) < y) && (y < (l.y1 + l.oy + this.touchsize))) && ((l.x1 < x) && (x < l.x2))) {
            if ((l.n === 10) || (l.n === 11)) {
              this.istapY = true;
            }
            l.isMove = true;
            isTouch = true;
            switch (l.n) {
              case 10:  // 横左
                if (this.isYline === true) {
                  this.areaLine[11].isMove = true;
                }
                break;
              case 11:  // 横右
                if (this.isYline === true) {
                  this.areaLine[10].isMove = true;
                }
                break;
              case 4: // 4:横左上
                if (this.areaNum === 1) {
                  this.areaLine[6].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 1)) {
                  this.areaLine[6].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 0)) {
                  this.areaLine[6].isMove = true;
                }
                break;
              case 5: // 5:横左下
                if (this.areaNum === 1) {
                  this.areaLine[7].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 1)) {
                  this.areaLine[7].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 2)) {
                  this.areaLine[7].isMove = true;
                }
                break;
              case 6: // 6:横右上
                if (this.areaNum === 1) {
                  this.areaLine[4].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 1)) {
                  this.areaLine[4].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 0)) {
                  this.areaLine[4].isMove = true;
                }
                break;
              case 7: // 7:横右下
                if (this.areaNum === 1) {
                  this.areaLine[5].isMove = true;
                } else if ((this.areaNum === 2) && (this.rotation === 1)) {
                  this.areaLine[5].isMove = true;
                } else if ((this.areaNum === 3) && (this.rotation === 2)) {
                  this.areaLine[5].isMove = true;
                }
                break;
            }
            break;
          }
        }
      }
    }
    return(isTouch);
  }



  public touchStart(event) {
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left - this.offsetX;
    const y = touchY - rect.top - this.offsetY;
    if ( this.lineTouchStart(x , y ) === true) {
    } else if ( this.areaTouchStart(x, y) === true) {
    }
    this.draw();
  }


  public touchEnd(event) {
    const rect = event.target.getBoundingClientRect();
    const touchX = Math.round(event.changedTouches[0].pageX);
    const touchY = Math.round(event.changedTouches[0].pageY);
    // 要素内におけるタッチ位置を計算
    const x = touchX - rect.left - this.offsetX;
    const y = touchY - rect.top - this.offsetY;
    // console.log(this);
    // エリアタッチの検出
    let isTouch = false;
    for (const r of this.areaRect ) {
      if ( r.isHide === false && r.isTouch === true ) {
        if ( (r.x < x ) && ( x < (r.x + r.w)) && (r.y < y ) && ( y < (r.y + r.h)) ) {
          if ( r.area === 0 ) {
            console.log(this.inDoorMode);
            r.area = this.inDoorMode;
            isTouch = true;
          }
        }
      }
    }
    if ( isTouch === true ) {
      for (const r of this.areaRect ) {
        if ( r.isHide === false && r.isTouch === false ) {
          if ( r.area === this.inDoorMode ) {
          r.area = 0;
          }
        }
      }
    }
    // ライン上のタッチイベントかをチェックする
    for (const l of this.areaLine) {
      if (l.isHide === false) {
        // 縦線か横線かのチェック
        if (l.x1 === l.x2) {   // 縦線
          if ((((l.x1 + l.ox - this.touchsize) < x) && (x < (l.x1 + l.ox + this.touchsize))) && ((l.y1 < y) && (y < l.y2))) {
            if (this.istapX === true) {
              // console.log('tapx ' + 'X:', x + ' Y:', y);
              this.handleTapX();
            }
            break;
          }
        } else {  // 横線
          if ((((l.y1 + l.oy - this.touchsize) < y) && (y < (l.y1 + l.oy + this.touchsize))) && ((l.x1 < x) && (x < l.x2))) {
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
    for (const r of this.areaRect) {
      r.isTouch = false;
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
  }

  public setAreaRect(num: number, x: number, y: number, w: number, h: number) {
    this.areaRect[num].x = x;
    this.areaRect[num].y = y;
    this.areaRect[num].w = w;
    this.areaRect[num].h = h;
  }

  public setAreaRectColor(num: number, area: number , isHide: boolean, x: number, y: number, w: number, h: number) {
    this.areaRect[num].area = area;
    this.areaRect[num].isHide = isHide;
    this.areaRect[num].x = x;
    this.areaRect[num].y = y;
    this.areaRect[num].w = w;
    this.areaRect[num].h = h;
  }

  public setAreaLine(num: number , isHide: boolean , x1: number , y1: number , x2: number , y2: number) {
    this.areaLine[num].isHide = isHide;
    this.areaLine[num].x1 = x1;
    this.areaLine[num].y1 = y1;
    this.areaLine[num].x2 = x2;
    this.areaLine[num].y2 = y2;
  }

  public areaLineHide(isline8: boolean, isline9: boolean, isline10: boolean, isline11: boolean) {
    this.areaLine[8].isHide = isline8;
    this.areaLine[9].isHide = isline9;
    this.areaLine[10].isHide = isline10;
    this.areaLine[11].isHide = isline11;
  }
  // エリア数 2 の時のタップ処理
  public areaNum2Tap() {
    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    this.setAreaLine(0, false , w0, h0, w0, h2);
    this.setAreaLine(1, false , w0, h2, w0, h1);
    this.setAreaLine(2, false , w1, h0, w1, h2);
    this.setAreaLine(3, false , w1, h2, w1, h1);
    this.setAreaLine(4, false , w0, h0, w2, h0);
    this.setAreaLine(5, false , w0, h1, w2, h1);
    this.setAreaLine(6, false , w2, h0, w1, h0);
    this.setAreaLine(7, false , w2, h1, w1, h1);
    this.setAreaLine(8, false , w2, h0, w2, h2);
    this.setAreaLine(9, false , w2, h2, w2, h1);
    this.setAreaLine(10, false , w0, h2, w2, h2);
    this.setAreaLine(11, false , w2, h2, w1, h2);

    if (this.rotation === 0) {
      this.rotation = 1;
      // 縦→横変換
      // エリア表示
      this.setAreaRect(0, w0, h0, w1, h2);
      this.setAreaRect(1, w0, h2, w1, h2);
      // エリア設定ライン
      this.areaLineHide(true , true , false , false);
    } else {
      this.rotation = 0;
      // 横→縦
      this.setAreaRect(0, w0, h0, w2, h1);
      this.setAreaRect(1, w2, h0, w2, h1);
      // エリア設定ライン
      this.areaLineHide(false, false, true, true);
    }
    for (const l of this.areaLine) {
      l.ox = 0;
      l.oy = 0;
    }
    this.rectArea();
  }

  // エリア数 3 のタップ処理
  public areaNum3Tap() {
    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;


    this.setAreaLine(0, false , w0, h0, w0, h2);
    this.setAreaLine(1, false , w0, h2, w0, h1);
    this.setAreaLine(2, false , w1, h0, w1, h2);
    this.setAreaLine(3, false , w1, h2, w1, h1);
    this.setAreaLine(4, false , w0, h0, w2, h0);
    this.setAreaLine(5, false , w0, h1, w2, h1);
    this.setAreaLine(6, false , w2, h0, w1, h0);
    this.setAreaLine(7, false , w2, h1, w1, h1);
    this.setAreaLine(8, false , w2, h0, w2, h2);
    this.setAreaLine(9, false , w2, h2, w2, h1);
    this.setAreaLine(10, false , w0, h2, w2, h2);
    this.setAreaLine(11, false , w2, h2, w1, h2);

    if (this.rotation === 0) {
      this.rotation = 1;
      // エリア表示
      this.setAreaRect(0, w0, h0, w2, h2);
      this.setAreaRect(1, w2, h0, w2, h1);
      this.setAreaRect(2, w0, h2, w2, h2);
      // // エリア設定ライン
      this.areaLineHide(false, false , false , true);
    } else if (this.rotation === 1) {
      this.rotation = 2;
      // // エリア表示
      this.setAreaRect(0, w0, h0, w2, h2);
      this.setAreaRect(1, w2, h0, w2, h2);
      this.setAreaRect(2, w0, h2, w1, h2);
      // // エリア設定ライン
      this.areaLineHide(false , true , false , false);
    } else if (this.rotation === 2) {
      this.rotation = 3;
      // エリア表示
      this.setAreaRect(0, w0, h0, w2, h1);
      this.setAreaRect(1, w2, h0, w2, h2);
      this.setAreaRect(2, w2, h2, w2, h2);
      // // エリア設定ライン
      this.areaLineHide(false, false, true, false);
    } else {
      this.rotation = 0;
      // エリア表示
      this.setAreaRect(0, w0, h0, w1, h2);
      this.setAreaRect(1, w0, h2, w2, h2);
      this.setAreaRect(2, w2, h2, w2, h2);
      // // エリア設定ライン
      this.areaLineHide(true, false, false, false);
    }
    for (const l of this.areaLine) {
      l.ox = 0;
      l.oy = 0;
    }
    this.rectArea();
  }

  // エリア数 4 の横ライン(X)タップ処理
  public areaNum4XTap() {
    if (this.isYline === true) {
      if (this.isXline === false) {
        if ( this.areaLine[8].ox === this.areaLine[9].ox ) {
          this.isXline = true;
          this.areaLine[8].color = 'rgba(0,0,0,1)';
          this.areaLine[9].color = 'rgba(0,0,0,1)';
        }
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
        if ( this.areaLine[10].oy === this.areaLine[11].oy ) {
          this.isYline = true;
          this.areaLine[10].color = 'rgba(0,0,0,1)';
          this.areaLine[11].color = 'rgba(0,0,0,1)';
        }
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
      this.ariaNum1RectArea(xlY, xrY, yuX, ylX);
    } else if (this.areaNum === 2) {
      this.ariaNum2RectArea(xlY, xrY, yuX, ylX);
    } else if (this.areaNum === 3) {
      this.ariaNum3RectArea(xlY, xrY, yuX, ylX);
    } else {
      this.ariaNum4RectArea(xlY, xrY, yuX, ylX);
    }
  }

  public ariaNum1RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {
    const w0 = 0; const w1 = this.w; const w2 = this.w / 2;
    const h0 = 0; const h1 = this.h; const h2 = this.h / 2;

    const yluX = this.areaLine[0].ox;
    const yllX = this.areaLine[1].ox;
    const yruX = this.areaLine[2].ox;
    const yrlX = this.areaLine[3].ox;

    const xruY = this.areaLine[4].oy;
    const xrlY = this.areaLine[5].oy;
    const xluY = this.areaLine[6].oy;
    const xllY = this.areaLine[7].oy;

    this.setAreaRect(0, w0 + yluX, h0 + xruY, w1 - yluX + yruX, h1 - xruY + xrlY);
  }

  public ariaNum2RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {
    const w0 = 0; const w1 = this.w; const w2 = this.w / 2;
    const h0 = 0; const h1 = this.h; const h2 = this.h / 2;

    const yluX = this.areaLine[0].ox;
    const yllX = this.areaLine[1].ox;
    const yruX = this.areaLine[2].ox;
    const yrlX = this.areaLine[3].ox;

    const xruY = this.areaLine[4].oy;
    const xrlY = this.areaLine[5].oy;
    const xluY = this.areaLine[6].oy;
    const xllY = this.areaLine[7].oy;

    if (this.rotation === 0) {
      this.setAreaRect(0, w0 + yluX , h0 + xruY, w2 + yuX - yluX, h1 - xruY + xrlY);
      this.setAreaRect(1, w2 + yuX, h0 + xluY, w2 - yuX + yruX, h1 - xluY + xllY);
    } else {
      this.setAreaRect(0, w0 + yluX, h0 + xruY, w1 - yluX + yruX, h2 + xlY - xruY );
      this.setAreaRect(1, w0 + yllX, h2 + xlY , w1 - yllX + yrlX, h2 - xlY + xrlY);
    }
  }
  public ariaNum3RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {
    const w0 = 0; const w1 = this.w; const w2 = this.w / 2;
    const h0 = 0; const h1 = this.h; const h2 = this.h / 2;

    const yluX = this.areaLine[0].ox;
    const yllX = this.areaLine[1].ox;
    const yruX = this.areaLine[2].ox;
    const yrlX = this.areaLine[3].ox;

    const xruY = this.areaLine[4].oy;
    const xrlY = this.areaLine[5].oy;
    const xluY = this.areaLine[6].oy;
    const xllY = this.areaLine[7].oy;

    if (this.rotation === 0) {
      this.setAreaRect(0, w0 + yluX, h0 + xruY, w1 - yluX + yruX, h2 + xlY - xruY );
      this.setAreaRect(1, w0 + (yllX), (h2) + (xlY), (w2) + (ylX) - (yllX), (h2) - (xlY) + (xrlY));
      this.setAreaRect(2, (w2) + (ylX), (h2) + (xrY), (w2) - (ylX) + (yrlX), (h2) - (xrY) + (xllY));
    } else if (this.rotation === 1) {
      this.setAreaRect(0, w0 + (yluX), h0 + (xruY), (w2) + (yuX) - (yluX), (h2) + (xlY) - (xruY));
      this.setAreaRect(1, w2 + yuX, h0 + xluY, w2 - yuX + yruX, h1 - xluY + xllY);
      this.setAreaRect(2, w0 + (yllX), (h2) + (xlY), (w2) + (ylX) - (yllX), (h2) - (xlY) + (xrlY));
    } else if (this.rotation === 2) {
      this.setAreaRect(0, w0 + (yluX), h0 + (xruY), (w2) + (yuX) - (yluX), (h2) + (xlY) - (xruY));
      this.setAreaRect(1, (w2) + (yuX), h0 + (xluY), (w2) - (yuX) + (yruX), (h2) + (xrY) - (xluY));
      this.setAreaRect(2, w0 + yllX, h2 + xlY , w1 - yllX + yrlX, h2 - xlY + xrlY);
    } else {
      this.setAreaRect(0, w0 + yluX , h0 + xruY, w2 + yuX - yluX, h1 - xruY + xrlY);
      this.setAreaRect(1, (w2) + (yuX), h0 + (xluY), (w2) - (yuX) + (yruX), (h2) + (xrY) - (xluY));
      this.setAreaRect(2, (w2) + (ylX), (h2) + (xrY), (w2) - (ylX) + (yrlX), (h2) - (xrY) + (xllY));
    }
  }
  public ariaNum4RectArea(xlY: any, xrY: any, yuX: any, ylX: any) {
    const w0 = 0; const w1 = this.w; const w2 = this.w / 2;
    const h0 = 0; const h1 = this.h; const h2 = this.h / 2;

    const yluX = this.areaLine[0].ox;
    const yllX = this.areaLine[1].ox;
    const yruX = this.areaLine[2].ox;
    const yrlX = this.areaLine[3].ox;

    const xruY = this.areaLine[4].oy;
    const xrlY = this.areaLine[5].oy;
    const xluY = this.areaLine[6].oy;
    const xllY = this.areaLine[7].oy;

    this.setAreaRect(0, w0 + (yluX), h0 + (xruY), (w2) + (yuX) - (yluX), (h2) + (xlY) - (xruY));
    this.setAreaRect(1, (w2) + (yuX), h0 + (xluY), (w2) - (yuX) + (yruX), (h2) + (xrY) - (xluY));
    this.setAreaRect(2, w0 + (yllX), (h2) + (xlY), (w2) + (ylX) - (yllX), (h2) - (xlY) + (xrlY));
    this.setAreaRect(3, (w2) + (ylX), (h2) + (xrY), (w2) - (ylX) + (yrlX), (h2) - (xrY) + (xllY));
  }


  ngAfterViewInit() {

    console.log('ngAfterViewInit()');
    console.log(this.inDoorMode);
    console.log(this.areaNum);
    console.log(this.isDrag);

    this.inDoorMode = 1;

    const canvas = this.myCanvas.nativeElement;
    canvas.addEventListener('touchstart', this, false);
    canvas.addEventListener('touchend', this, false);
    canvas.addEventListener('touchmove', this, false);

    this.w = canvas.width - (this.offsetX * 2);
    this.h = canvas.height - (this.offsetY * 2);

    const w0 = 0;
    const h0 = 0;
    const w1 = this.w;
    const w2 = this.w / 2;
    const h1 = this.h;
    const h2 = this.h / 2;

    switch (this.areaNum) {
      case 0:
        break;
      case 1:
        this.setAreaRectColor(0, 0, false, w0, h0, w1, h1);
        this.setAreaRectColor(1, 0, true, w0, h2, w1, h2);
        this.setAreaRectColor(2, 0, true, w2, h2, w2, h2);
        this.setAreaRectColor(3, 0, true, w2, h2, w2, h2);
        this.setAreaLine(0, false , w0, h0, w0, h2 );
        this.setAreaLine(1, false , w0, h2, w0, h1 );
        this.setAreaLine(2, false , w1, h0, w1, h2 );
        this.setAreaLine(3, false , w1, h2, w1, h1 );
        this.setAreaLine(4, false , w0, h0, w2, h0 );
        this.setAreaLine(5, false , w0, h1, w2, h1 );
        this.setAreaLine(6, false , w2, h0, w1, h0 );
        this.setAreaLine(7, false , w2, h1, w1, h1 );
        this.setAreaLine(8, true, w2, h0, w2, h2 );
        this.setAreaLine(9, true, w2, h2, w2, h1 );
        this.setAreaLine(10, true, w0, h2, w2, h2 );
        this.setAreaLine(11, true, w2, h2, w1, h2 );
        break;
      case 2:
        this.setAreaRectColor(0, 0, false, w0, h0, w0, h2);
        this.setAreaRectColor(1, 0, false, w2, h0, w2, h1);
        this.setAreaRectColor(2, 0, true, w2, h2, w2, h2);
        this.setAreaRectColor(3, 0, true, w2, h2, w2, h2);
        this.setAreaLine(0, false , w0, h0, w0, h2);
        this.setAreaLine(1, false , w0, h2, w0, h1);
        this.setAreaLine(2, false , w1, h0, w1, h2);
        this.setAreaLine(3, false , w1, h2, w1, h1);
        this.setAreaLine(4, false , w0, h0, w2, h0);
        this.setAreaLine(5, false , w0, h1, w2, h1);
        this.setAreaLine(6, false , w2, h0, w1, h0);
        this.setAreaLine(7, false , w2, h1, w1, h1);
        this.setAreaLine(8, false , w2, h0, w2, h2);
        this.setAreaLine(9, false , w2, h2, w2, h1);
        this.setAreaLine(10, true , w0, h2, w2, h2);
        this.setAreaLine(11, true , w2, h2, w1, h2);
        break;
      case 3:
        this.setAreaRectColor(0, 0, false, w0, h0, w1, h2);
        this.setAreaRectColor(1, 0, false, w0, h2, w2, h2);
        this.setAreaRectColor(2, 0, false, w2, h2, w2, h2);
        this.setAreaRectColor(3, 0, true, w2, h2, w2, h2);
        this.setAreaLine(0, false , w0, h0, w0, h2);
        this.setAreaLine(1, false , w0, h2, w0, h1);
        this.setAreaLine(2, false , w1, h0, w1, h2);
        this.setAreaLine(3, false , w1, h2, w1, h1);
        this.setAreaLine(4, false , w0, h0, w2, h0);
        this.setAreaLine(5, false , w0, h1, w2, h1);
        this.setAreaLine(6, false , w2, h0, w1, h0);
        this.setAreaLine(7, false , w2, h1, w1, h1);
        this.setAreaLine(8, true , w2, h0, w2, h2);
        this.setAreaLine(9, false , w2, h2, w2, h1);
        this.setAreaLine(10, false , w0, h2, w2, h2);
        this.setAreaLine(11, false , w2, h2, w1, h2);
        break;
      case 4:
        this.setAreaRectColor(0, 0, false, w0, h0, w2, h2);
        this.setAreaRectColor(1, 0, false, w2, h0, w2, h2);
        this.setAreaRectColor(2, 0, false, w0, h2, w2, h2);
        this.setAreaRectColor(3, 0, false, w2, h2, w2, h2);
        this.setAreaLine(0, false , w0, h0, w0, h2);
        this.setAreaLine(1, false , w0, h2, w0, h1);
        this.setAreaLine(2, false , w1, h0, w1, h2);
        this.setAreaLine(3, false , w1, h2, w1, h1);
        this.setAreaLine(4, false , w0, h0, w2, h0);
        this.setAreaLine(5, false , w0, h1, w2, h1);
        this.setAreaLine(6, false , w2, h0, w1, h0);
        this.setAreaLine(7, false , w2, h1, w1, h1);
        this.setAreaLine(8, false , w2, h0, w2, h2);
        this.setAreaLine(9, false , w2, h2, w2, h1);
        this.setAreaLine(10, false , w0, h2, w2, h2);
        this.setAreaLine(11, false , w2, h2, w1, h2);
        break;
    }
    // console.log(this.areaNum);

    this.img = new Image();
    this.img.src = 'assets/maru.png';

    this.draw();
  }
}
