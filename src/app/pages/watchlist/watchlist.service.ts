import { Injectable } from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {Character} from 'src/app/shared/api/models/character';
import {StorageKeys} from 'src/app/shared/importExport/StorageKeys';
import {CharacterGroup} from 'src/app/shared/api/models/character-group';
import {Utils} from 'src/app/shared/Utils';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  characters: BehaviorSubject<Character[]>;
  statics: BehaviorSubject<CharacterGroup[]>;
  comparisonTargets: BehaviorSubject<Character[]>;
  comparisonGroups: BehaviorSubject<CharacterGroup[]>;
  constructor() { }

  /**
   * Returns a particular character from your friends, otherwise
   * @param characterId - The character id of the friend to return.
   */
  getFriend(characterId: number) {
    return this.getFriends().pipe(
      take(1),
      map( friends => friends.find(friend => friend.id === characterId))
    );
  }
  /**
   * Returns an observable of the list of friends for the current user.
   */
  getFriends() {
    // Initialize the characters from storage, or default to []
    if (!this.characters) {
      const storedCharacters = localStorage.getItem(StorageKeys.friends);
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      this.characters = new BehaviorSubject<Character[]>(characters);
    }
    return this.characters;
  }
  /**
   * Adds the character to the current users friends.
   * @param character - The character to add.
   */
  addFriend(character: Character) {
    // Add this character to the existing array and save it to storage
    const existingCharacters = this.characters.getValue();
    existingCharacters.push(character);
    // Keep characters sorted by name
    existingCharacters.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    localStorage.setItem(StorageKeys.friends, JSON.stringify(existingCharacters));
    // Update the character subject
    this.characters.next(existingCharacters);
  }

  /**
   * Updates the specified character in the friend list, if found (matches on id).
   * @param character - The character to update.
   */
  updateFriend(character: Character) {
    // Update this character in the existing array and save it to storage
    const existingCharacters = this.characters.getValue();
    const existingCharacterIndex = existingCharacters.findIndex(c => c.id === character.id);
    const foundMatch = existingCharacterIndex >= 0;
    if (foundMatch) {
      existingCharacters.splice(existingCharacterIndex, 1, character);
      localStorage.setItem(StorageKeys.friends, JSON.stringify(existingCharacters));
      // Update the character subject
      this.characters.next(existingCharacters);
    }
    return foundMatch;
  }
  /**
   * Deletes the character with the specified id from the friend list, if found.
   * @param characterId - The character id to delete.
   */
  deleteFriend(characterId: number) {
    const existingCharacters = this.characters.getValue();
    const existingCharacterIndex = existingCharacters.findIndex(c => c.id === characterId);
    const foundMatch = existingCharacterIndex >= 0;
    if (foundMatch) {
      existingCharacters.splice(existingCharacterIndex, 1);
      localStorage.setItem(StorageKeys.friends, JSON.stringify(existingCharacters));
      // Update the character subject
      this.characters.next(existingCharacters);
    }
    return foundMatch;
  }
  getStatic(groupId: string) {
    return this.getStatics().pipe(
      take(1),
      map( statics => statics.find(sStatic => sStatic.id === groupId))
    );
  }
  /**
   * Returns an observable of the list of statics for the current user.
   */
  getStatics() {
    // Initialize the characters from storage, or default to []
    if (!this.statics) {
      const storedStatics = localStorage.getItem(StorageKeys.statics);
      const statics = storedStatics ? JSON.parse(storedStatics) : [];
      this.statics = new BehaviorSubject<CharacterGroup[]>(statics);
    }
    return this.statics;
  }

  /**
   * Adds the static to the existing list of statics.
   * @param nStatic - The static to add.
   */
  addStatic(nStatic: CharacterGroup) {
    // Assign an ID to the new static
    nStatic.id = Utils.newGuid();
    // Add this static to the existing array and save it to storage
    const existingStatics = this.statics.getValue();
    existingStatics.push(nStatic);
    // Keep statics sorted by name
    existingStatics.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    localStorage.setItem(StorageKeys.statics, JSON.stringify(existingStatics));
    // Update the character subject
    this.statics.next(existingStatics);
  }

  /**
   * Updates the specified static in the list of statics, if found (matches on id).
   * @param uStatic - The updated static.
   */
  updateStatic(uStatic: CharacterGroup) {
    // Update this character in the existing array and save it to storage
    const existingStatics = this.statics.getValue();
    const existingStaticIndex = existingStatics.findIndex(c => c.id === uStatic.id);
    const foundMatch = existingStaticIndex >= 0;
    if (foundMatch) {
      existingStatics.splice(existingStaticIndex, 1, uStatic);
      localStorage.setItem(StorageKeys.statics, JSON.stringify(existingStatics));
      // Update the character subject
      this.statics.next(existingStatics);
    }
    return foundMatch;
  }

  /**
   * Deletes the static with the specified id.
   * @param staticId - The static id to delete.
   */
  deleteStatic(staticId: string) {
    const existingStatics = this.statics.getValue();
    const existingStaticIndex = existingStatics.findIndex(c => c.id === staticId);
    const foundMatch = existingStaticIndex >= 0;
    if (foundMatch) {
      existingStatics.splice(existingStaticIndex, 1);
      localStorage.setItem(StorageKeys.statics, JSON.stringify(existingStatics));
      // Update the character subject
      this.statics.next(existingStatics);
    }
    return foundMatch;
  }
  /**
   * Returns an observable of the list of comparison targets for the current user.
   */
  getComparisonTargets() {
    // Initialize the comparison targets from storage, or default to []
    if (!this.comparisonTargets) {
      const storedCharacters = localStorage.getItem(StorageKeys.comparisonTargets);
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      this.comparisonTargets = new BehaviorSubject<Character[]>(characters);
    }
    return this.comparisonTargets;
  }
  /**
   * Adds the character to the current users comparison targets.
   * @param character - The character to add.
   */
  addComparisonTarget(character: Character) {
    // Add this character to the existing array and save it to storage
    const existingCharacters = this.comparisonTargets.getValue();
    existingCharacters.push(character);
    // Keep characters sorted by name
    existingCharacters.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    localStorage.setItem(StorageKeys.comparisonTargets, JSON.stringify(existingCharacters));
    // Update the character subject
    this.comparisonTargets.next(existingCharacters);
  }

  /**
   * Updates the specified character in the comparison target list, if found (matches on id).
   * @param character - The character to update.
   */
  updateComparisonTarget(character: Character) {
    // Update this character in the existing array and save it to storage
    const existingCharacters = this.comparisonTargets.getValue();
    const existingCharacterIndex = existingCharacters.findIndex(c => c.id === character.id);
    const foundMatch = existingCharacterIndex >= 0;
    if (foundMatch) {
      existingCharacters.splice(existingCharacterIndex, 1, character);
      localStorage.setItem(StorageKeys.comparisonTargets, JSON.stringify(existingCharacters));
      // Update the character subject
      this.comparisonTargets.next(existingCharacters);
    }
    return foundMatch;
  }
  /**
   * Deletes the character with the specified id from the comparison target list, if found.
   * @param characterId - The character id to delete.
   */
  deleteComparisonTarget(characterId: number) {
    const existingCharacters = this.comparisonTargets.getValue();
    const existingCharacterIndex = existingCharacters.findIndex(c => c.id === characterId);
    const foundMatch = existingCharacterIndex >= 0;
    if (foundMatch) {
      existingCharacters.splice(existingCharacterIndex, 1);
      localStorage.setItem(StorageKeys.comparisonTargets, JSON.stringify(existingCharacters));
      // Update the character subject
      this.comparisonTargets.next(existingCharacters);
    }
    return foundMatch;
  }
  /**
   * Returns an observable of the list of comparison groups for the current user.
   */
  getComparisonGroups() {
    // Initialize the comparison groups from storage, or default to []
    if (!this.comparisonGroups) {
      const storedCharacters = localStorage.getItem(StorageKeys.comparisonGroups);
      const characters = storedCharacters ? JSON.parse(storedCharacters) : [];
      this.comparisonGroups = new BehaviorSubject<CharacterGroup[]>(characters);
    }
    return this.comparisonGroups;
  }
  /**
   * Adds the group to the current users comparison groups.
   * @param group - The group to add.
   */
  addComparisonGroup(group: CharacterGroup) {
    // Assign an ID to the new group
    group.id = Utils.newGuid();
    // Add this group to the existing array and save it to storage
    const existingGroups = this.comparisonGroups.getValue();
    existingGroups.push(group);
    // Keep groups sorted by name
    existingGroups.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    localStorage.setItem(StorageKeys.comparisonGroups, JSON.stringify(existingGroups));
    // Update the character subject
    this.comparisonGroups.next(existingGroups);
  }

  /**
   * Updates the specified group in the comparison groups list, if found (matches on id).
   * @param group - The group to update.
   */
  updateComparisonGroup(group: CharacterGroup) {
    // Update this group in the existing array and save it to storage
    const existingGroups = this.comparisonGroups.getValue();
    const existingGroupIndex = existingGroups.findIndex(c => c.id === group.id);
    const foundMatch = existingGroupIndex >= 0;
    if (foundMatch) {
      existingGroups.splice(existingGroupIndex, 1, group);
      localStorage.setItem(StorageKeys.comparisonGroups, JSON.stringify(existingGroups));
      // Update the character subject
      this.comparisonGroups.next(existingGroups);
    }
    return foundMatch;
  }
  /**
   * Deletes the group with the specified id from the comparison groups list, if found.
   * @param groupId - The group id to delete.
   */
  deleteComparisonGroup(groupId: string) {
    const existingGroups = this.comparisonGroups.getValue();
    const existingGroupIndex = existingGroups.findIndex(c => c.id === groupId);
    const foundMatch = existingGroupIndex >= 0;
    if (foundMatch) {
      existingGroups.splice(existingGroupIndex, 1);
      localStorage.setItem(StorageKeys.comparisonGroups, JSON.stringify(existingGroups));
      // Update the character subject
      this.comparisonGroups.next(existingGroups);
    }
    return foundMatch;
  }
}
