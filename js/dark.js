let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function changeTheme(forceDark = null) {
    isDark = forceDark !== null ? forceDark : !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    document.querySelector('.dark-theme i')?.classList[isDark ? 'remove' : 'add']('fa-moon', 'fa-shake');
    document.querySelector('.dark-theme i')?.classList[isDark ? 'add' : 'remove']('fa-sun', 'fa-spin');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => changeTheme(e.matches));