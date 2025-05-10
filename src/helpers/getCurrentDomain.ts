export function getCurrentDomain() {
  return 'test4'
  //return 'nftmarket.angeldao.info'
  //return 'shendel.github.io'
  //return 'avly-eneeseene-test'
  return window.location.hostname || document.location.host || ''
}