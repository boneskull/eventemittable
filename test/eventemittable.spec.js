import {EventEmitter} from 'events';
import unexpected from 'unexpected';
import usinon from 'unexpected-sinon';
import sinon from 'sinon';
import stampit from '@stamp/it';

import EventEmittable from '../src/eventemittable';

const expect = unexpected.clone()
  .use(usinon);

describe('EventEmittable', function () {
  let sbx;

  beforeEach(function () {
    sbx = sinon.sandbox.create();
  });

  afterEach(function () {
    sbx.restore();
  });

  describe('method', function () {
    let ee;

    beforeEach(function () {
      ee = EventEmittable();
    });

    describe('once()', function () {
      let listener;

      beforeEach(function () {
        listener = sbx.stub();
      });

      it('should call listener once', function () {
        ee.once('foo', listener);
        ee.emit('foo');
        ee.emit('foo');
        expect(listener, 'was called once');
      });
    });

    describe('on()', function () {
      let listener;

      beforeEach(function () {
        listener = sbx.stub();
      });

      it('should call listener', function () {
        ee.on('foo', listener);
        ee.emit('foo');
        ee.emit('foo');
        expect(listener, 'was called twice');
      });
    });

    describe('emit()', function () {
      let listeners;

      beforeEach(function () {
        listeners = [
          sbx.stub(),
          sbx.stub(),
          sbx.stub()
        ];
        listeners.forEach(listener => {
          ee.once('foo', listener);
        });
      });

      it('should emit to multiple listeners', function () {
        ee.emit('foo');

        listeners.forEach(listener => {
          expect(listener, 'was called once');
        });
      });
    });

    describe('removeListener()', function () {
      let listeners;

      beforeEach(function () {
        listeners = [
          sbx.stub(),
          sbx.stub()
        ];
        listeners.forEach(listener => {
          ee.once('foo', listener);
        });
      });

      it('should remove a listener from the event', function () {
        ee.removeListener('foo', listeners[1]);
        ee.emit('foo');
        expect(listeners[0], 'was called once');
        expect(listeners[1], 'was not called');
      });
    });

    describe('removeAllListeners()', function () {
      let listeners;

      beforeEach(function () {
        listeners = [
          sbx.stub(),
          sbx.stub()
        ];
        listeners.forEach(listener => {
          ee.once('foo', listener);
          ee.once('bar', listener);
        });
      });

      describe('when provided an event', function () {
        it('should remove all listeners from a single event', function () {
          ee.removeAllListeners('foo');
          ee.emit('foo');
          listeners.forEach(listener => {
            expect(listener, 'was not called');
          });
        });
      });

      describe('when not provided an event', function () {
        it('should remove all listeners from all events', function () {
          ee.removeAllListeners();
          ee.emit('foo');
          ee.emit('bar');
          listeners.forEach(listener => {
            expect(listener, 'was not called');
          });
        });
      });
    });

    describe('getMaxListeners()', function () {
      it('should return the (default) maximum number of listeners',
        function () {
          expect(ee.getMaxListeners(),
            'to equal',
            EventEmitter.defaultMaxListeners);
        });
    });

    describe('setMaxListeners()', function () {
      it('should set the maximum number of listeners', function () {
        ee.setMaxListeners(2);
        expect(ee.getMaxListeners(), 'to equal', 2);
      });
    });

    describe('listeners()', function () {
      let listeners;

      beforeEach(function () {
        listeners = [
          sbx.stub(),
          sbx.stub()
        ];
        listeners.forEach(listener => {
          ee.once('foo', listener);
        });
      });

      it('should return an array of listeners for an event', function () {
        expect(ee.listeners('foo'), 'to satisfy', listeners);
      });
    });
  });

  it('should emit a warning if max listeners exceeded', function () {
    if (!process.emitWarning) {
      this.skip();
    }
    const ee = EventEmittable();
    sbx.stub(process, 'emitWarning');
    ee.setMaxListeners(2);
    ee.on('foo', sbx.stub());
    ee.on('foo', sbx.stub());
    ee.on('foo', sbx.stub());
    expect(process.emitWarning, 'was called once');
  });

  it('should allow composition', function () {
    const MyStamp = stampit({
      methods: {
        foo () {
          this.emit('foo');
        }
      }
    })
      .compose(EventEmittable);

    const stamp = MyStamp();
    const listener = sbx.stub();
    stamp.on('foo', listener);
    stamp.foo();
    expect(listener, 'was called once');
  });

  // guess I'm convinced.
});
