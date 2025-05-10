import { ipfsUrl } from "/helpers/ipfsUrl"
import { fetchNftMetadata } from "/helpers/fetchNftMetadata"
import fetchNFTCollectionInfo from "/helpers/fetchNFTCollectionInfo"

const fetchNFTCollectionMeta = (options) => {
  const {
    address,
    chainId,
    forAddress,
  } = {
    forAddress: false,
    ...options
  }
  
  return new Promise((resolve, reject) => {
    fetchNFTCollectionInfo({
      chainId,
      address,
      forAddress,
    }).then( async (collectionInfo) => {
      let collectionMetaJson = false
      let collectionZeroJson = false
      let collectionOneJson = false

      if (collectionInfo.contractURI) {
        try {
          collectionMetaJson = await fetchNftMetadata(ipfsUrl(collectionInfo.contractURI))
        } catch (e) {}
      }
      
      if (collectionInfo.zeroTokenURI) {
        try {
          collectionZeroJson = await fetchNftMetadata(ipfsUrl(collectionInfo.zeroTokenURI))
        } catch (e) {}
      }
      if (!collectionMetaJson && !collectionZeroJson && collectionInfo.baseExtension && collectionInfo.hiddenMetadataUri) {
        try {
          collectionOneJson = await fetchNftMetadata(ipfsUrl(`${collectionInfo.hiddenMetadataUri}${1}${collectionInfo.baseExtension}`))
        } catch (e) {}
      }
      const collectionMeta = {
        ...collectionInfo,
        name: collectionMetaJson?.name || collectionZeroJson?.name || collectionInfo.symbol || `-`,
        description: collectionMetaJson?.description || collectionZeroJson?.description || collectionInfo.name || `-`,
        image: collectionMetaJson?.image || collectionZeroJson?.image || collectionOneJson?.image || false,
        totalSupply: collectionInfo?.totalSupply || 0,
      }
      resolve(collectionMeta)
    }).catch((err) => {
      console.log('>>> Fail fetchNFTCollectionMeta >>', err)
      reject(err)
    })
  })
}

export default fetchNFTCollectionMeta