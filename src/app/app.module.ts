import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, pt_BR } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TaskComponent } from './task/task.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import pt from '@angular/common/locales/pt';
import { TaskCardComponent } from './task/task-card/task-card.component';
import { MainService } from './common/service/main.service';
import { TaskService } from './common/service/task.service';

registerLocaleData(pt);


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const routes: Routes = [
  {
    path: '',
    component: TaskComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent,
    TaskCardComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: false }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DragDropModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NZ_I18N,
      useValue: pt_BR
    },
    DatePipe,
    MainService,
    TaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
