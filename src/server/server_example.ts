import ServerUtils from "./sv_utils";

const svUtils = new ServerUtils()


RegisterCommand('niceTest', async () => {
  const retValue = await svUtils.callClientRPC<{x: number, y: number, z: number}>('getClientData', -1, { nice: true })
  console.log('Got return value')
  console.dir(retValue)
}, false)