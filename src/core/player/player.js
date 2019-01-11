// @flow

export class Player {

  type: string;
  id: string;

  constructor(type: string, id: string) {
    this.type = type;
    this.id = id;
  }

  equals(player: Player): boolean {
    return player.id === this.id;
  }

}
