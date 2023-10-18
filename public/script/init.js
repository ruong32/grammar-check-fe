const STORAGE_KEY = {
    THEME_MODE: 'gc_themeMode',
    ZOOM_RATIO: 'gc_zoomRatio',
    ACCENT_LANGUAGE: 'gc_accentLanguage',
    HISTORY: 'gc_history'
}

const initConfig = () => {
    const currentZoom = localStorage.getItem(STORAGE_KEY.ZOOM_RATIO)
	document.documentElement.style.fontSize = `${currentZoom*100}%`
    const currentTheme = localStorage.getItem(STORAGE_KEY.THEME_MODE)
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark')
    }
}

initConfig()
