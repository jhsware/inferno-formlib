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
