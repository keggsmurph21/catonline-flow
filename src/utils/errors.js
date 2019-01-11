// @flow

export class CatonlineError extends Error {
  name: string;
  constructor(message: string) {
    super(message);
    this.name = 'CatonlineError';
  }
};
export class InvalidGameParamsError extends CatonlineError {
  name: string;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidGameParamsError';
  }
};
