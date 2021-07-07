import "../../__mocks__/shared/shared_globals.mock";
import { mocked } from "ts-jest/utils";
import { ServerUtils } from "../../lib/server";
import { ServerPromiseResp, ServerUtilSettings } from "../../lib/types";
import { v4 as uuid } from "uuid";

const serverUtils = mocked(new ServerUtils({debugMode: true}), true)

const attachUuid = (name: string) => `${name}:${uuid()}`

const randomData = [
  {
    eventName: 'nice',
    respName: attachUuid('nice'),
    data: {
      'suck': true
    }
  },
  {
    eventName: 'beans',
    respName: attachUuid('beans'),
    data: {}
  },
]

const getRandomObj = () => randomData[Math.floor(Math.random() * randomData.length)]

interface NetEventData {
  eventName: string
  data: any[] | any
}

describe('server utils tests', () => {
  test('is server utils instance', () => {
    const _serverUtils = new ServerUtils({debugMode: true })
    expect(_serverUtils).toBeInstanceOf(ServerUtils)
  })

  test('server utils instance can merge default settings', () => {
    const _serverUtils = new ServerUtils({debugMode: true })
    const mergedSettings: ServerUtilSettings = {
      debugMode: true,
      rpcTimeout: 10000
    }
    expect(_serverUtils["_utilSettings"]).toStrictEqual<ServerUtilSettings>(mergedSettings)
  })
  test('onServerPromise should resolve back to client', () => {
    const randomObj = getRandomObj()

    serverUtils.onNetPromise(randomObj.eventName, ((reqObj, resp) => {
      expect(reqObj.source).toBeGreaterThan(-1)

      const returnObj: ServerPromiseResp<any> = { status: 'ok', data: { nice: true }}

      resp(returnObj)

      const events: NetEventData[] = (global as any).__returnEmittedEvents()

      console.log(events)

      expect(events).toContain(returnObj)
    }))
  })

  test.todo('Really need to do the error handling tests')
  test.skip('Error handling in cb', () => {
    const randomObj = getRandomObj()

    return async () => {
      serverUtils.onNetPromise(randomObj.eventName, async (reqObj, resp) => {
        throw new Error('You suck')
      })
    }
  })
})
