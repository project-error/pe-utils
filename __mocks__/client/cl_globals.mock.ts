import EventEmitter from "events";

const __clientEmitter = new EventEmitter

Object.defineProperty(global, 'on', {
  writable: false,
  // eslint-disable-next-line @typescript-eslint/ban-types
  value: jest.fn().mockImplementation((eventNamestring: string, fn: Function) => {
    __clientEmitter.on(eventNamestring, (...data: any[]) => {
      fn(...data)
    })
  })
})