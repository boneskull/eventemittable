# eventemittable

> A composable `EventEmitter` for Stampit v3

## Install

```bash
$ npm install stampit eventemittable --save
```

[Stampit](https://npm.im/stampit) v3 or greater is a peer dependency of this module.

## Usage

```js
import EventEmittable from 'eventemittable';
import stampit from 'stampit';

// some stamp
const User = stampit.init((opts, {instance}) => {
  if (opts.name) {
    instance.name = opts.name;
  }
})
.props({
  name: {
    first: "(unnamed)",
    last: "(unnamed)"
  }
});

// an emittable version of some stamp
const EmittableUser = User.compose(EventEmittable);

// elsewhere...
const user = EmittableUser({name: {first: 'Guy', last: 'Fieri'}});
user.on('name', name => {
  console.log(`${name.first} ${name.last}`);
});
user.emit('name', user.name); // 'Guy Fieri'
```

## Notes

Apologies to [koresar](https://github.com/koresar). :D

## License

© 2017 [Christopher Hiller](https://boneskull.com).  Licensed Apache-2.0.
