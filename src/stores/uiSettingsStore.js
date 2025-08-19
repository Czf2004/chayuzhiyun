import { defineStore } from 'pinia'

const STORAGE_KEY = 'ui_settings_v1'

const defaultSettings = {
  theme: 'light', // light | dark | system
  elementSize: 'default', // small | default | large
  accentColor: '#2f7a59',
  radius: 12, // px
  density: 'comfortable', // compact | comfortable | spacious
  contentWidth: 'wide', // wide | narrow | fluid
  glassmorphism: true,
  gradients: true,
  animations: true,
  fontScale: 100 // percent
}

export const useUiSettingsStore = defineStore('uiSettings', {
  state: () => ({
    settings: { ...defaultSettings }
  }),
  actions: {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          this.settings = { ...defaultSettings, ...parsed }
        }
      } catch (e) {
        // ignore parse error
      }
      this.apply()
    },
    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings))
      } catch (e) {
        // ignore quota errors
      }
    },
    set(partial) {
      this.settings = { ...this.settings, ...partial }
      this.save()
      this.apply()
    },
    apply() {
      const root = document.documentElement
      // theme
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = this.settings.theme === 'system' ? (prefersDark ? 'dark' : 'light') : this.settings.theme
      root.setAttribute('data-theme', theme)
      // toggle element-plus dark class on html element
      root.classList.remove('dark')
      if (theme === 'dark') root.classList.add('dark')
      // css vars
      root.style.setProperty('--app-accent', this.settings.accentColor)
      // sync element-plus primary color
      root.style.setProperty('--el-color-primary', this.settings.accentColor)
      root.style.setProperty('--app-radius', `${this.settings.radius}px`)
      root.style.setProperty('--app-density', this.settings.density)
      // content width
      root.style.setProperty('--app-content-max', this.settings.contentWidth === 'narrow' ? '960px' : (this.settings.contentWidth === 'wide' ? '1200px' : '100%'))
      // glass & gradient toggles as data attrs
      root.setAttribute('data-glass', this.settings.glassmorphism ? '1' : '0')
      root.setAttribute('data-gradients', this.settings.gradients ? '1' : '0')
      root.setAttribute('data-anim', this.settings.animations ? '1' : '0')
      // font scale
      document.body.style.fontSize = `${this.settings.fontScale}%`
      // density class on body
      document.body.classList.remove('density-compact', 'density-comfortable', 'density-spacious')
      document.body.classList.add(`density-${this.settings.density}`)
    }
  }
})


