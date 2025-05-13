export const translate = (label, args = {}, code) => {
  Object.keys(args).forEach((name) => {
    label = label.replaceAll(`{${name}}`, args[name])
  })
  return label
}

export const getTranslate = (scope) => {
  const func = (label, args, code) => {
    return translate(label, args, (code) ? `${scope}_${code}` : scope)
  }
  return func
}

export default {
  translate
}