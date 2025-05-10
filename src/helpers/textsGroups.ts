export const textsGroups = [
  {
    title: `Main options`,
    key: 'mainOptions',
    items: [
      {
        code: `App_Title`,
        desc: `Application title`,
        value: `NFT Marketplace`,
      },
      {
        code: `App_Description`,
        desc: `Application desctiption`,
        value: ``,
      },
      {
        code: `App_Keywords`,
        desc: `Application keywords`,
        value: ``,
      },
      {
        code: `App_Footer`,
        desc: `Footer text`,
        multiline: true,
        markdown: true,
        value: `Copyright (c)`
      },
      {
        code: `MainPage_Title`,
        desc: `Home page Title`,
        value: `NFTs Marketplace`,
      },
      {
        code: `MainPage_Desc`,
        desc: `Text block after title`,
        value: `Welcome to our NFTs Marketplace`,
        markdown: true,
        multiline: true,
      },
    ],
  }
]

const prepareTextsGroups = () => {
  const _ret = {}
  Object.keys(textsGroups).forEach((k) => {
    Object.keys(textsGroups[k].items).forEach((kk) => {
      const _item = textsGroups[k].items[kk]
      _ret[_item.code] = _item
    })
  })
  
  return _ret;
}

export const TEXTS_GROUPS_ITEMS = prepareTextsGroups()
