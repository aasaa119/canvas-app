import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AreaSettingComponent } from './area-setting/area-setting.component';
import { AreaConfigComponent } from './area-config/area-config.component';

@NgModule({
  declarations: [
    AppComponent,
    AreaSettingComponent,
    AreaConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
