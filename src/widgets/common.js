import { globalRegistry } from 'component-registry'
import { ITranslationUtil } from '../interfaces'

// Get unnamed translation utility or return undefined

export function renderString(label, lang, fallbackLabel, disableI18n) {
  if (disableI18n) {
    return label
  } 

  if (typeof label === 'object') {
    return label['i18n']
  }

  const i18n = globalRegistry.getUtility(ITranslationUtil, undefined, undefined)
  return i18n ? i18n.message(label) : fallbackLabel || label
}
