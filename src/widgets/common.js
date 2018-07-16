import { globalRegistry } from 'component-registry'
import { ITranslationUtil } from '../interfaces'

// Get unnamed translation utility or return undefined

export function renderString(label, lang, fallbackLabel, disableI18n) {
  if (typeof label === 'object') {
    return label['i18n']
  }

  if (disableI18n) {
    return label || fallbackLabel
  } 

  const i18n = globalRegistry.getUtility(ITranslationUtil, undefined, undefined)
  return (i18n && label) ? i18n.message(label) || label : fallbackLabel || label
}
