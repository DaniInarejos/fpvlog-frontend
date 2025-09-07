
import login from './login'
import terms from './terms'
import navbar from './navbar'
import about from './about'
import dashboard from './dashboard'
import common from './common'
import components from './components'
import drones from './drones'
import feed from './feed'
import flights from './flights'
import followers from './followers'
import following from './following'
import profile from './profile'
import spots from './spots'
import groups from './groups'
import landing from './landing'
import restorePassword from './restorePassword'

export const loadViewTranslations = async (viewName, lang) => {
  const messages = await import(`./${viewName}/${lang}.js`)
  i18n.mergeLocaleMessage(lang, {
    [viewName]: messages.default
  })
}

export default {
  locale: 'es',
  fallbackLocale: 'en',
  messages: {
    en: { 
      login: login.en,
      nav: navbar.en,
      navbar: navbar.en,
      terms: terms.en,
      about: about.en,
      dashboard: dashboard.en,
      common: common.en,
      components: components.en,
      drones: drones.en,
      feed: feed.en,
      flights: flights.en,
      followers: followers.en,
      following: following.en,
      profile: profile.en,
      spots: spots.en,
      groups: groups.en,
      landing: landing.en,
      restorePassword: restorePassword.en
    },
    es: { 
      login: login.es,
      nav: navbar.es,
      navbar: navbar.es,  // Cambiar de 'nav' a 'navbar'
      terms: terms.es,
      about: about.es,
      dashboard: dashboard.es,
      common: common.es,
      components: components.es,
      drones: drones.es,
      feed: feed.es,
      flights: flights.es,
      followers: followers.es,
      following: following.es,
      profile: profile.es,
      spots: spots.es,
      groups: groups.es,
      landing: landing.es,
      restorePassword: restorePassword.es
    }
  }
}