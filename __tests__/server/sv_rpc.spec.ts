import '../../__mocks__/shared/shared_globals.mock'
import { ServerUtils } from "../../lib/server";
import { v4 as uuid } from 'uuid'

const serverUtils = new ServerUtils()

jest.mock('../../lib/server')

const attachUuid = (name: string) => `${name}:${uuid()}`


describe('client rpc testing', () => {
  beforeEach(() => {

  })

  test.todo('we should test RPC mocked')
  test.todo('we should test timeouts')
  test.todo('we should test exception handling')

})