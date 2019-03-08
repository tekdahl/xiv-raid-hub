import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {AddEditCharacterComponent} from './add-edit-character/add-edit-character.component';
import {AddEditStaticComponent} from './add-edit-static/add-edit-static.component';
import {WatchlistComponent} from './watchlist.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {WatchlistRoutingModule} from './watchlist-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    WatchlistRoutingModule
  ],
  declarations: [
    WatchlistComponent,
    AddEditCharacterComponent,
    AddEditStaticComponent
  ],
  entryComponents: [AddEditCharacterComponent, AddEditStaticComponent]
})
export class WatchlistModule { }