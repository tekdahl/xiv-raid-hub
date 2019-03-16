import { Component, OnInit } from '@angular/core';

import {Encounter} from 'src/app/shared/api/fflogs/models/Zone';
import {CharacterGroup} from 'src/app/shared/api/models/character-group';
import {Character} from 'src/app/shared/api/models/character';
import {ActivatedRoute} from '@angular/router';
import {WatchlistService} from 'src/app/pages/watchlist/watchlist.service';

@Component({
  selector: 'app-analyze-group',
  templateUrl: './analyze-group.component.html',
  styleUrls: ['./analyze-group.component.css']
})
export class AnalyzeGroupComponent implements OnInit {
  encounters: Encounter[];
  group: CharacterGroup;
  reportCharacter: Character; /*used to get reports for the whole group*/
  constructor(private route: ActivatedRoute, private wlService: WatchlistService) { }

  ngOnInit() {
    // Attempt to lookup the character ID in the url
    const groupId = this.route.snapshot.params.groupId;
    this.wlService.getStatic(groupId).subscribe(sStatic => {
      this.group = sStatic;
      // We'll use the first character from the group to get reports
      this.reportCharacter = this.group.characters[0];
    });
  }
  /**
   * Sets the encounters we want reports for.
   * @param encounters - The encounters to filter reports to.
   */
  filterReports(encounters: Encounter[]) {
    this.encounters = encounters;
  }
}
