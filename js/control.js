const colors = {
    "blue": {
        "bg-color": "#e4edff",
        "color": "#2a6fc5"
    },
    "rust": {
        "bg-color": "#fff4ee",
        "color": "#bc3109"
    },
    "aura": {
        "bg-color": "#f3eeff",
        "color": "#6d52bf"
    },
    "gray": {
        "bg-color": "#dfdfdf",
        "color": "#7a7a7a"
    },
    "teal": {
        "bg-color": "#e6f8f2",
        "color": "#00958d"
    },
    "lime": {
        "bg-color": "#f0f6e4",
        "color": "#7ab300"
    }
};
const updateContent = {
    interval_process: null,
    async start(modal) {
        if (this.interval_process === null) {
            await this.once(modal)
            this.interval_process = setInterval(async () => await this.once(modal), 1000)
        }
    },
    stop() {
        if (this.interval_process !== null) {
            clearInterval(this.interval_process);
            this.interval_process = null;
        }
    },
    async once(modal) {
        const date = modal.querySelector(".time");
        const battery = modal.querySelector(".battery");
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',hour12: false};
        const time = new Date();
        date.innerHTML = time.toLocaleDateString('en-US', options)
        if ('getBattery' in navigator) {
            const battery_cont = await navigator.getBattery();
            const percentage = Math.round(battery_cont.level * 100)
            battery.querySelector('path').setAttribute('d', 'M16,'+(20-0.14*percentage).toFixed(2)+'H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z');
            battery.querySelector('a').innerHTML = Math.round(battery_cont.level * 100) + '%'
        } else {battery.innerHTML = ''}
    }
}
//**
//* Modal Control
//* to be mentioned, openModal(null) can be used to close all the modals
//* it will also close all the modals while opening a new one
//*/
function openModal(names,isOpen=true) {
    const modals = (typeof names === 'string')?document.querySelector('.mod.'+names):names
    if (isOpen) document.querySelectorAll('.mod').forEach(modal => {if (modal !== modals && modal.classList.contains('fadein')) openModal(modal,false)});
    if (modals && modals.classList.contains('mod')) {
        modals.classList.toggle('fadein', isOpen)
        modals.classList.toggle('fadeout', !isOpen)
        if (modals.classList.contains('menu')) isOpen?updateContent.start(modals):updateContent.stop()
        const delay = modals.classList.contains('faster') ? 450 : 950;
        isOpen?modals.classList.remove('hidden'):setTimeout(() => {modals.classList.add('hidden');}, delay);
    }
}
let totopVisible = false;
window.onload = () => {
    document.querySelector('.dark-theme').onclick = () => changeTheme()
    document.querySelectorAll('.donate button').forEach(btn => {
        const links = {
            'alipay': [true,'alipays://platformapi/startapp?saId=10000007&qrcode=https://qr.alipay.com/fkx10272ar3luhnwpfmyu1c?_s=web-other'],
            'paypal': [false,'https://paypal.me/Doctxing']
        }
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        const btnName = btn.classList[0]
        if (!isMobile && links[btnName][0]){
            const mask = btn.querySelector('.mask')
            btn.onclick = () => mask.classList.add('-translate-x-full')
            btn.onmouseleave = () => mask.classList.remove('-translate-x-full')
        } else {
            btn.onclick = () => window.open(links[btnName][1])
        }
    })
    document.querySelectorAll('.color-select').forEach(btn => {
        const colorName = btn.innerText.trim()
        btn.onmouseover = () => document.documentElement.style.setProperty('--hvbtn', colors[colorName].color)
        btn.onclick = () => {
            document.querySelectorAll('.color-select').forEach(btn => {btn.classList.remove('color-selected')})
            btn.classList.add('color-selected')
            document.documentElement.style.setProperty('--theme-bg', colors[colorName]['bg-color'])
            document.documentElement.style.setProperty('--theme-cl', colors[colorName].color)
        }
    })
    document.querySelectorAll('button.closemod').forEach(btn => btn.onclick = () => openModal(null))
    document.querySelectorAll('.mod.translucent').forEach(modal => {
        const child_window = modal.querySelector('.window')
        if (child_window) modal.onclick = (event) => {
            if (!child_window.contains(event.target)) openModal(null)
        }
    })
    window.matchMedia('(min-width: 768px)').onchange = (event) => {event.matches?openModal('menu',false):null}
    document.querySelector('.totop').onclick = () => window.scrollTo({ top: 0, behavior: "smooth" })
    window.onscroll = () => {
        const visible = window.scrollY > 200;
        if (visible === totopVisible) return;
        const modals = document.querySelector('.totop');
        modals?.classList.toggle("fadein", visible);
        modals?.classList.toggle("fadeout", !visible);
        const delay = modals.classList.contains('faster') ? 450 : 950;
        visible?modals.classList.remove('hidden'):setTimeout(() => {modals.classList.add('hidden');}, delay);
        totopVisible = visible;
    }
    document.querySelectorAll("footer .links button").forEach(button => {
        const linksMap = {
            "fa-bilibili": "https://space.bilibili.com/3494360192649842",
            "fa-github": "https://github.com/Doctxing",
            "fa-telegram": "https://t.me/Doctxing",
            "fa-x-twitter": "https://x.com/doctxing"
        };
        button.onclick= () => {
            const icon = button.querySelector("i");
            if (icon) {
                const iconClass = [...icon.classList].filter(c => c !== "fa-brands")[0];
                if (iconClass && linksMap[iconClass]) window.open(linksMap[iconClass]);
            }
        }
    });
    document.querySelectorAll('button.link').forEach(button => {
        const linksMap = {
            "mainbtn": "#/",
            "blogs": "#/blogs/",
            "storage": "#/storage",
        }
        button.onclick= () => {
            const btnClass = [...button.classList].filter(c => c !== "link")[0];
            if (btnClass && linksMap[btnClass]) window.location.href = linksMap[btnClass];
        }
    })
    console.log('%c𝕴 𝖆𝖒 𝕯𝖔𝖈𝖙𝖝𝖎𝖓𝖌','font-size: 32px')
    setTimeout(()=>{
        openModal('cover',false)
    },1000)
}

window.$docsify = {
    loadSidebar: false,
    hideSidebar: true,
    loadNavbar: false,
    hideNavbar: true,
    auto2top: false,
    plugins: [
        function fadePlugin(hook, vm) {
            hook.beforeEach((content, next) => {
                const el = document.querySelector('#main');
                if (el) {
                    el.classList.remove('fadein');
                    el.classList.add('fadeout', 'faster');
                    setTimeout(() => {
                        next(content);
                    }, 500);
                } else {
                    next(content);
                }
                window.scrollTo({ top: 0, behavior: "smooth" })
                openModal(null)
            });
            hook.doneEach(() => {
                const el = document.querySelector('#main');
                if (el) {
                    el.classList.remove('fadeout');
                    el.classList.add('fadein');
                }
            });
        },
        function archivePlugin(hook, vm) {
            hook.beforeEach((content, next) => {
                const path = vm.route.path
                if (path === '/blogs/' || path === '/storage') {
                    // 解析 markdown 结构为 JSON
                    const lines = content.trim().split('\n');
                    const items = [];
                    const firstLine = lines[0];
                    for (let i = 0; i < lines.length; i+=1 ) {
                        const title = lines[i]?.match(/title:\s*(.*)/)?.[1]?.trim();
                        if (title) {
                            const date = lines[i + 1]?.match(/date:\s*(.*)/)?.[1]?.trim();
                            const link = lines[i + 2]?.match(/link:\s*(.*)/)?.[1]?.trim();
                            if (date && link) {
                                const dat = new Date(date)
                                items.push({ title, dat, link});
                            }
                        }
                    }
                    items.sort((a, b) => b.dat - a.dat);
                    const grouped = {};
                    for (const item of items) {
                        const year = item.dat.getFullYear()
                        if (!grouped[year]) grouped[year] = [];
                        grouped[year].push(item);
                    }
                    const compiled = firstLine + '\n\n'
                            +Object.keys(grouped).sort((a, b) => b - a).map(year => '\n\n### ' + year + '\n\n<ul>'
                                + grouped[year].map(item => `<li class="leftline"><a href="${item.link}">${item.title}</a> - 
                                     ${item.dat.toLocaleDateString('en-US', {month: 'short', day: '2-digit',})}</li>`).join('')
                                +'</ul>'
                                ).join('');
                    // console.log(compiled)
                    next(compiled);
                } else {
                    next(content);
                }
            });
        }
    ]
}