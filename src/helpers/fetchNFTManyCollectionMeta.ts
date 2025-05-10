import { ipfsUrl } from "/helpers/ipfsUrl"
import { fetchNftMetadata } from "/helpers/fetchNftMetadata"
import fetchNFTManyCollectionInfo from "/helpers/fetchNFTManyCollectionInfo"

const fetchNFTManyCollectionMeta = (options) => {
  const {
    addressList,
    chainId
  } = options

  return new Promise((resolve, reject) => {
  
    fetchNFTManyCollectionInfo({
      chainId,
      addressList,
    }).then( async (collectionsInfo) => {
      const ret = {}
      const metaPromiseList = []
      Object.keys(collectionsInfo).forEach((nftAddress) => {
        metaPromiseList.push( new Promise(async (resolve) => {
          
          let collectionMetaJson = false
          let collectionZeroJson = false
          let collectionOneJson = false
          if (collectionsInfo[nftAddress].contractURI) {
            try {
              collectionMetaJson = await fetchNftMetadata(ipfsUrl(collectionsInfo[nftAddress].contractURI))
            } catch (e) {}
          }
          if (collectionsInfo[nftAddress].zeroTokenURI) {
            try {
              collectionZeroJson = await fetchNftMetadata(ipfsUrl(collectionsInfo[nftAddress].zeroTokenURI))
            } catch (e) {}
          }
          if (!collectionMetaJson && !collectionZeroJson && collectionsInfo[nftAddress].baseExtension && collectionsInfo[nftAddress].hiddenMetadataUri) {
            try {
              collectionOneJson = await fetchNftMetadata(ipfsUrl(`${collectionsInfo[nftAddress].hiddenMetadataUri}${1}${collectionsInfo[nftAddress].baseExtension}`))
            } catch (e) {}
          }
          const collectionMeta = {
            name: collectionMetaJson?.name || collectionZeroJson?.name || collectionsInfo[nftAddress].symbol || `-`,
            description: collectionMetaJson?.description || collectionZeroJson?.description || collectionsInfo[nftAddress].name || `-`,
            image: collectionMetaJson?.image || collectionZeroJson?.image || collectionOneJson?.image || false,
            totalSupply: collectionsInfo[nftAddress]?.totalSupply || 0,
          }
          
          ret[nftAddress] = collectionMeta
          resolve(true)
        }) )
      })
      Promise.all( metaPromiseList ).then((ready) => {
        resolve(ret)
      })
    }).catch((err) => {
      console.log('>>> Fail fetchNFTCollectionMeta >>', err)
      reject(err)
    })
  })
}

export default fetchNFTManyCollectionMeta