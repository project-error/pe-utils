import ClUtils from "../../lib/client/cl_utils";
jest.mock('../../lib/client/cl_utils');

const clUtils = <jest.Mock<ClUtils>>ClUtils

describe('Client utils test suite', () => {
  beforeEach(() => {
    clUtils.mockClear()
  })

  test('make sure instance actually right', () => {
    const _clUtils = new clUtils()
    expect(_clUtils).toBeInstanceOf(ClUtils)
  })

  test.todo('Actually expand out tests when I am not tired')

  test('Check methods called', () => {
    expect(ClUtils).not.toHaveBeenCalled()
  })

})