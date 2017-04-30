import {EventEmitter} from 'events';
import stampit from '@stamp/it';

// https://github.com/stampit-org/stampit/blob/master/advanced-examples/event-emitter.js
export default stampit()
  .compose(stampit.composers(({stamp}) => {
    stamp.compose.methods = stamp.compose.methods || Object.create(null);
    Object.setPrototypeOf(stamp.compose.methods, EventEmitter.prototype);
  }));
