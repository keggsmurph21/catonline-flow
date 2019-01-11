// @flow

export class Player {

  id: string;

  constructor(id: string) {
    this.id = id;
  }

  equals(player: Player): boolean {
    return player.id === this.id;
  }

}
