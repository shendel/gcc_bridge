const PromiseChunksCall = (options) => {
  const {
    args,
    chunkSize,
    func,
    onFetching,
    chunkDelay,
    onErrorDelay,
    onErrorRetry,
  } = {
    onErrorDelay: 100,
    onErrorRetry: 1,
    chunkSize: 100,
    chunkDelay: 100,
    onFetching: (cursorPos, total) => {},
    ...options
  }
  
  const delay = (timeout) => {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve()
      }, timeout)
    })
  }

  return new Promise(async (resolve, reject) => {
    const ret = []
    for (let i = 0; i < args.length; i += chunkSize) {
      const _processChunk = async () => {
        const chunk = args.slice(i, i + chunkSize);
        const chunkResult = await func(chunk, i)
        ret.push(...chunkResult)
        onFetching(i, args.length)
        await delay(chunkDelay)
      }
      try {
        await _processChunk()
      } catch (err) {
        let skip = false
        for (let retryCount = 0; retryCount < onErrorRetry; retryCount++) {
          try {
            await delay(onErrorDelay)
            await _processChunk()
            skip = true
            break;
          } catch (err) {}
        }
        if (!skip) {
          reject(err)
          break;
        }
      }
    }
    resolve(ret)
  })
}

export default PromiseChunksCall