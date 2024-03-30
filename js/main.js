let theme,colorname;
let colors={},memorial={};
let battery,Time,Day,month,day_in_num,date_in_num, Hour,Minutes;
const userLanguage = navigator.language || navigator.userLanguage;
const root = document.documentElement;
const modal = document.querySelector('.main-modal')
const topButton = document.getElementById('back-to-top')//go back to the top Button
const donateButton = document.getElementById('donation')
const settingButton = document.getElementById('color-setting')

function readJson(jsonUrl,data){
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('get', jsonUrl);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status === 200) {
            Object.assign(data, JSON.parse(xhr.responseText));
        }
    };
}

function updateThemeColor(colorName) {
    if (colors[colorName]) {
        colorname=colorName;
        root.style.setProperty('--theme-color', colors[colorName]['color']);
        root.style.setProperty('--light-bg-color', colors[colorName]['white-bg-color']);
        let colorbuttons = document.querySelectorAll('.color-selector');
        colorbuttons.forEach(button => {
            // 如果按钮的文本内容与所选颜色相同，则将其背景颜色更改为鼠标悬停时的颜色
            if (button.innerText.trim() === colorname) {
                button.style.backgroundColor = getComputedStyle(button).getPropertyValue('--theme-color');

            } else {
                // 如果按钮的文本内容与所选颜色不同，则将其背景颜色恢复为默认值
                button.style.backgroundColor = getComputedStyle(button).getPropertyValue('var(--current-color)');
            }
        });
    }
}

function closeModal(modals) {
    modals.classList.remove('fadeIn'),
        modals.classList.add('fadeOut'),
        document.querySelector('body').style.overflow = 'visible',
        setTimeout(() => {
            modals.style.display = 'none';
        }, 500);
}

function openModal(modals) {
    modals.classList.remove('fadeOut'),
        modals.classList.add('fadeIn'),
        modals.style.display = 'flex';
}

function darkmode() {
    document.getElementById('darktheme').className ==='fa-shake fa-regular fa-moon' ?
        (document.getElementById('darktheme').className = 'fa-spin fa-regular fa-sun',
            document.getElementById('prism').href=('./assets/prism/darkprism.css'),
            document.documentElement.style.setProperty('--text-color','var(--light-color)'),
            document.documentElement.style.setProperty('--current-color','var(--dark-color)'),
            document.documentElement.style.setProperty('--bg-color','var(--dark-bg-color)')) : whitemode();
}

function whitemode() {
    document.getElementById('darktheme').className = 'fa-shake fa-regular fa-moon';
    document.getElementById('prism').href=('./assets/prism/prism.css');
    document.documentElement.style.setProperty('--text-color','var(--dark-color)');
    document.documentElement.style.setProperty('--current-color','var(--light-color)');
    document.documentElement.style.setProperty('--bg-color','var(--light-bg-color)');
}

function closeNav() {
    closeModal(modal)
}

function openNav() {
    //电量
    function BetteryPercentage(per_bet) {
        document.getElementById('percentage').innerHTML = Math.round(per_bet.level * 100) + '%';
    }

    //显示电池格
    function BetteryShow(percentage) {
        if (percentage.level < 0.1) document.getElementById('battery').innerHTML = '\n <path d="M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
            if (percentage.level >= 0.1 && percentage.level < 0.2) document.getElementById('battery').innerHTML = '\n <path d="M16,18H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                if (percentage.level >= 0.2 && percentage.level < 0.3) document.getElementById('battery').innerHTML = '\n <path d="M16,18H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                    if (percentage.level >= 0.3 && percentage.level < 0.4) document.getElementById('battery').innerHTML = '\n <path d="M16,15H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                        if (percentage.level >= 0.4 && percentage.level < 0.5) document.getElementById('battery').innerHTML = '\n <path d="M16,14H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                            if (percentage.level >= 0.5 && percentage.level < 0.6) document.getElementById('battery').innerHTML = '\n <path d="M16,13H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                                if (percentage.level >= 0.6 && percentage.level < 0.7) document.getElementById('battery').innerHTML = '\n <path d="M16,12H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                                    if (percentage.level >= 0.7 && percentage.level < 0.8) document.getElementById('battery').innerHTML = '\n <path d="M16,10H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                                        if (percentage.level >= 0.8 && percentage.level < 0.9) document.getElementById('battery').innerHTML = '\n <path d="M16,9H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />';
                                        else percentage.level >= 0.9 && percentage.level < 1 ? document.getElementById('battery').innerHTML = '\n <path d="M16,8H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />' : document.getElementById('battery').innerHTML = '\n <path d="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function show(num_bet) {
        BetteryShow(num_bet), BetteryPercentage(num_bet);
    }
    function setContent() {
        document.getElementById('time').innerHTML = Hour + ':' + Minutes;
        document.getElementById('date').innerHTML = Day.substring(0, 3) + ',' + Day.substring(3);
        document.querySelector('body').style.overflow = 'hidden';
        battery.then(show);
    }
    setContent()
    setInterval(setContent,1000)
    openModal(modal);
}

function scrollFunction() {
    (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? topButton.style.display = 'block' : topButton.style.display = 'none';
}

function topFunction() {
    document.body.scrollTop = 0, document.documentElement.scrollTop = 0;
}

function changeHoverColor(element) {
    const colorName = element.innerText.trim();
    if(colorname!==colorName){
        const colorValue = colors[colorName]['color'];
        if (colorValue) {
            element.style.backgroundColor = colorValue;
        }
    }
}

function resetHoverColor(element) {
    const colorName = element.innerText.trim();
    if(colorname!==colorName){
        element.style.backgroundColor = 'var(--current-color)'; // 恢复到默认的背景颜色
    }
}

function refreshData(){
    battery = navigator.getBattery();
    Time = new Date();
    Day = Time.toDateString();
    month = (Time.getMonth() + 1).toString().padStart(2, '0'); // 月份加1，因为月份从0开始，然后用padStart确保是两位数
    day_in_num = Time.getDate().toString().padStart(2, '0');
    date_in_num = month + '-' + day_in_num;
    Hour = Time.getHours().toString().padStart(2, '0');
    Minutes = Time.getMinutes().toString().padStart(2, '0');
}

refreshData()
setInterval(refreshData, 1000);

readJson('/js/colors.json',colors);
readJson('/js/memorial.json',memorial);

window.onscroll = function (){scrollFunction();}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {darkmode();theme="dark";}
else {whitemode();theme="light";}

if (userLanguage.startsWith('zh')){
    document.querySelector("html").lang="zh";
}
else {
    document.querySelector("html").lang="en";
}

window.addEventListener('load', function() {
    console.log("\n"+
        "▓█████▄  ▒█████   ▄████▄  ▄▄▄█████▓▒██   ██▒ ██▓ ███▄    █   ▄████ \n" +
        "▒██▀ ██▌▒██▒  ██▒▒██▀ ▀█  ▓  ██▒ ▓▒▒▒ █ █ ▒░▓██▒ ██ ▀█   █  ██▒ ▀█▒\n" +
        "░██   █▌▒██░  ██▒▒▓█    ▄ ▒ ▓██░ ▒░░░  █   ░▒██▒▓██  ▀█ ██▒▒██░▄▄▄░\n" +
        "░▓█▄   ▌▒██   ██░▒▓▓▄ ▄██▒░ ▓██▓ ░  ░ █ █ ▒ ░██░▓██▒  ▐▌██▒░▓█  ██▓\n" +
        "░▒████▓ ░ ████▓▒░▒ ▓███▀ ░  ▒██▒ ░ ▒██▒ ▒██▒░██░▒██░   ▓██░░▒▓███▀▒\n" +
        " ▒▒▓  ▒ ░ ▒░▒░▒░ ░ ░▒ ▒  ░  ▒ ░░   ▒▒ ░ ░▓ ░░▓  ░ ▒░   ▒ ▒  ░▒   ▒ \n" +
        " ░ ▒  ▒   ░ ▒ ▒░   ░  ▒       ░    ░░   ░▒ ░ ▒ ░░ ░░   ░ ▒░  ░   ░ \n" +
        " ░ ░  ░ ░ ░ ░ ▒  ░          ░       ░    ░   ▒ ░   ░   ░ ░ ░ ░   ░ \n" +
        "   ░        ░ ░  ░ ░                ░    ░   ░           ░       ░ \n" +
        " ░               ░                                                 ")

    if (memorial.hasOwnProperty(date_in_num)) {
        console.log(memorial[date_in_num]['saySth']);
        updateThemeColor(memorial[date_in_num]['color']);
    } else {
        console.log("What a nice day!");
        updateThemeColor('darkgreen');
    }


    setTimeout(function() {
        const cover=document.getElementById('cover');
        closeModal(cover);
    }, 1000); // 0.5秒延迟
});

