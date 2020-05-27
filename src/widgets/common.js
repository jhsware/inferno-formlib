import { globalRegistry } from 'component-registry'
import { ITranslationUtil } from '../interfaces'

// Get unnamed translation utility or return undefined

export function renderString(label, lang, fallbackLabel) {
  if (typeof label === 'object') {
    return label['i18n']
  }

  const i18n = globalRegistry.getUtility(ITranslationUtil, undefined, undefined)
  return (i18n && label) ? i18n.message(label, lang) || label : fallbackLabel || label
}

export function renderVariables(field, text) {
  if (field === undefined) {
    return text
  }

  let outp = text
  Object.getOwnPropertyNames(field).forEach((key) => {
    // This should be faster than dynamic regex
    // https://jsperf.com/replace-vs-split-join-vs-replaceall/23
    const tmp = (key[0] === '_' ? key.substring(1) : key)
    outp = outp.split(`\${${tmp}}`).join(field[key])
  })
  return outp
}