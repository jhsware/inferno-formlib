import { globalRegistry } from 'component-registry'
import { ITranslationUtil } from '../interfaces'

// Get unnamed translation utility or return undefined

export function renderString(label, lang) {
  const i18n = registry.getUtility(ITranslationUtil, undefined, undefined)
  return i18n ? i18n.message(label) : label
}
