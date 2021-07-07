import EventEmitter from "events"

jest.dontMock('events')

const __emittedEvents: emitNetCalls[] = []

const __mainEventListener = new EventEmitter()

Object.defineProperty(global, 'emitNet', {
  writable: true,
  value: jest.fn((eventName: string, src: number, ...args: any[]): void => {
    console.log(`${eventName} from src: ${src} triggered with args`, ...args)
    __mainEventListener.emit(eventName, ...args)
    __emittedEvents.push({
      eventName: eventName,
      args: [...args]
    })
    return;
  })
});

(global as any).__returnEmittedEvents = () => __emittedEvents;

interface emitNetCalls {
  eventName: string,
  args: any[]
}

Object.defineProperty(global, 'source', {
  writable: true,
  value: Math.floor(Math.random() * 100)
})

Object.defineProperty(global, 'onNet', {
  writable: true,
  // eslint-disable-next-line @typescript-eslint/ban-types
  value: jest.fn(((eventName: string, fn: Function, data: any): void => {
    __mainEventListener.on(eventName, (...args: any[]) => {
      (global as any).source = Math.floor(Math.random() * 100)
      fn(eventName, ...args)
    })
  }))
})