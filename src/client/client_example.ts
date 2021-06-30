import ClientUtils from "./cl_utils";

const clientUtils = new ClientUtils()

interface RandomObj {
  nice: boolean
}

clientUtils.registerRPCListener<RandomObj, { x: number, y: number, z: number }>('getClientData', (data) => {
  const playerPed = PlayerPedId()
  console.log('Data received in RPC call')
  console.dir(data)

  const [x, y, z] = GetEntityCoords(playerPed, false)
  return { x, y, z }
})