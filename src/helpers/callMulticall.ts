import PromiseChunksCall from "./PromiseChunksCall"
import BigNumber from "bignumber.js"

const processValue = (val) => {
  if (val && val._isBigNumber) val = val.toString()

  if (val instanceof Array) {
    const newVal = {}
    Object.keys(val).forEach((valKey) => {
      newVal[valKey] = val[valKey]
      if (val[valKey] && val[valKey]._isBigNumber) newVal[valKey] = val[valKey].toString()
      if (val[valKey] instanceof Array) {
        newVal[valKey] = processValue(val[valKey])
      }
    })
    return newVal
  }
  return val
}

export const callMulticall = (options) => {
  const {
    multicall,
    target,
    encoder,
    calls,
    chunkSize,
    onFetching,
  } = {
    chunkSize: 500,
    onFetching: (cursorPos, total) => {},
    ...options
  }

  return new Promise((resolve, reject) => {
    const ret = {}
    const mcCallToValue = []
    const mcCalls = Object.keys(calls).map((targetKey) => {
      const {
        func,
        args,
        encoder: ownEncoder,
        target: ownTarget,
      } = calls[targetKey]
      mcCallToValue.push(targetKey)
      const usedEncoder = ownEncoder || encoder
      return {
        target: (ownTarget || target),
        callData: usedEncoder.encodeFunctionData(func, args)
      }
    })
    PromiseChunksCall({
      args: mcCalls,
      chunkSize,
      onFetching,
      func: async (chunk) => {
        return await multicall.methods.tryAggregate(false, chunk).call()
      },
    }).then((answers) => {
      answers.forEach((retData, index) => {
        if (retData.success) {
          const ownEncoder = calls[mcCallToValue[index]].encoder
          
          let val = (ownEncoder || encoder).decodeFunctionResult(
            calls[mcCallToValue[index]].func,
            retData.returnData
          )
          val = (val.length == 1) ? val[0] : val
          val = processValue(val)

          if (calls[mcCallToValue[index]].asArray) {
            val = Object.keys(val).map((key) => { return val[key] })
          }
          ret[mcCallToValue[index]] = val
        } else {
          ret[mcCallToValue[index]] = calls[mcCallToValue[index]].default || false
        }
      })
      resolve(ret)
    }).catch((err) => {
      reject(err)
    })
  })
}

export const callMulticallGroup = (options) => {
  const {
    multicall,
    calls,
    chunkSize,
    onFetching,
  } = {
    chunkSize: 500,
    onFetching: (cursorPos, total) => {},
    ...options
  }

  return new Promise((resolve, reject) => {
    const ret = {}
    const mcCalls = calls.map((callData) => {
      const {
        group,
        func,
        args,
        encoder,
        target
      } = callData

      if (!ret[group]) ret[group] = {}
      return {
        target,
        callData: encoder.encodeFunctionData(func, args || [])
      }
    })
    PromiseChunksCall({
      args: mcCalls,
      chunkSize,
      onFetching,
      func: async (chunk) => {
        return await multicall.methods.tryAggregate(false, chunk).call()
      },
    }).then((answers) => {
      answers.forEach((retData, index) => {
        if (retData.success) {
          let val = calls[index].encoder.decodeFunctionResult(
            calls[index].func,
            retData.returnData
          )[0]
          val = processValue(val)

          ret[calls[index].group][calls[index].value || calls[index].func] = val
        } else {
          ret[calls[index].group][calls[index].value || calls[index].func] = false
        }
      })
      resolve(ret)
    }).catch((err) => {
      reject(err)
    })
  })
}