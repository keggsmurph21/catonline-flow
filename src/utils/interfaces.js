// @flow

import type { SerialT/*, DeserialT*/ } from './types';

export interface Serializable {
  serialize(): SerialT,
  // deserialize: (serial: SerialT) => DeserialT, // NB: not supported :(
}
