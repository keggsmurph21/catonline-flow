// @flow strict

export class Resource {

  name: string;
  yields: boolean;

  constructor(name: string) {

    this.name = name;

    if (name === 'desert' || name === 'ocean') {
      this.yields = false;
    } else {
      this.yields = true;
    }
  }
}
