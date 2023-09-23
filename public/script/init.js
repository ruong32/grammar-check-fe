const initConfig = () => {
    const currentZoom = localStorage.getItem('zoomRatio')
	document.documentElement.style.fontSize = `${currentZoom*100}%`
    const currentTheme = localStorage.getItem('themeMode')
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark')
    }
}

initConfig()
