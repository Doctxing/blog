/*
* coded by Doctxing
* Functions:
* darkmode()    //暗黑模式
* whitemode()   //白色模式
* isInclude(name) => true/false     //是否引入
* scrollFunction()      //滚动条
* topFunction()     //到顶部
* openNav()     //一些栏
* closeNav()
* openModal(modals)
* openModal(modals)
*/
function darkmode() {
    const color = document.querySelector('div');
    color.classList.replace('hover:bg-gray-50', 'hover:bg-gray-900'),
        document.getElementById('darktheme').className === 'fa-shake fa-regular fa-moon' ? (document.getElementById('darktheme').className = 'fa-spin fa-regular fa-sun',
            document.cookie = 'theme=dark',
            document.getElementById('dark').innerHTML = '\n * {\n color: rgb(255, 255, 255);\n }\n\n body {\n background-color: #181a1e;\n }\n\n .text-black {\n color: rgb(255, 255, 255);\n }\n\n .text-gray-800 {\n color: rgb(255, 255, 255);\n }\n\n .text-gray-700 {\n color: rgb(255, 255, 255);\n }\n\n .bg-white {\n background-color: black;\n }\n\n .bg-gray-300 {\n background-color: #181a1e;\n }\n\n .bg-blue-50 {\n background-color: #23262c;\n }\n\n .bg-blue-100 {\n background-color: #181a1e;\n }\n\n .text-gray-500 {\n color: #e0e0e0;\n }\n\n em {\n color: #1a73e8 !important;\n }\n\n em:hover {\n color: #fff !important;\n }\n\n #battery {\n fill: #fff;\n }\n\n #vector {\n fill: #fff;\n }\n\n #search-d {\n background-color: rgb(0, 0, 0);\n }\n\n .preloader {\n background: #000000 !important;\n }\n\n .heart {\n fill: #ffffff;\n }\n\n @keyframes input-shadow {\n 0% {\n fill: rgba(255, 255, 255, 0.115);\n }\n 10% {\n fill: rgba(255, 255, 255, 0.272);\n }\n 20% {\n fill: rgba(255, 255, 255, 0.435);\n }\n 30% {\n fill: rgba(255, 255, 255, 0.653);\n }\n 40% {\n fill: rgba(255, 255, 255, 0.735);\n }\n 50% {\n fill: rgb(255, 255, 255);\n }\n 60% {\n fill: rgba(255, 255, 255, 0.667);\n }\n 70% {\n fill: rgba(255, 255, 255, 0.524);\n }\n 80% {\n fill: rgba(255, 255, 255, 0.34);\n }\n 100% {\n box-shadow: rgba(255, 255, 255, 0.177);\n }\n }\n\n @-webkit-keyframes input-shadow {\n 0% {\n fill: rgba(255, 255, 255, 0.115);\n }\n 10% {\n fill: rgba(255, 255, 255, 0.272);\n }\n 20% {\n fill: rgba(255, 255, 255, 0.435);\n }\n 30% {\n fill: rgba(255, 255, 255, 0.653);\n }\n 40% {\n fill: rgba(255, 255, 255, 0.735);\n }\n 50% {\n fill: rgb(255, 255, 255);\n }\n 60% {\n fill: rgba(255, 255, 255, 0.667);\n }\n 70% {\n fill: rgba(255, 255, 255, 0.524);\n }\n 80% {\n fill: rgba(255, 255, 255, 0.34);\n }\n 100% {\n box-shadow: rgba(255, 255, 255, 0.177);\n }\n}') : whitemode();
}

function whitemode() {
    document.getElementById('dark').innerHTML = '',
        document.getElementById('darktheme').className = 'fa-shake fa-regular fa-moon',
        document.cookie = 'theme=white',
        document.getElementById('dark').innerHTML = '\n body {\n background-color: #d7e8ff;\n }\n\n .preloader {\n background: #ffffff !important;\n }';
}

function isInclude(name) {
    var js = /js$/i.test(name);
    var es = document.getElementsByTagName(js ? 'script' : 'link');
    for (var i = 0; i < es.length; i++)
        if (es[i][js ? 'src' : 'href'].indexOf(name) !== -1)
            return true;
    return false;
}

function scrollFunction() {
    (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? mybutton.style.display = 'block' : mybutton.style.display = 'none';
}

function topFunction() {
    document.body.scrollTop = 0, document.documentElement.scrollTop = 0;
}

function closeNav() {
    modal.classList.remove('fadeIn'),
        modal.classList.add('fadeOut'),
        document.querySelector('body').style.overflow = 'visible',
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
}

function openNav() {
    function show(num_bet) {
        BetteryShow(num_bet), BetteryPercentage(num_bet);
    }

    //电量
    function BetteryPercentage(per_bet) {
        document.getElementById('percentage').innerHTML = Math.round(per_bet.level * 100) + '%';
    }

    //显示电池格
    function BetteryShow(perofb) {
        if (perofb.level < 0.1) document.getElementById('battery').innerHTML = '\n <path d="M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
            if (perofb.level >= 0.1 && perofb.level < 0.2) document.getElementById('battery').innerHTML = '\n <path d="M16,18H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                if (perofb.level >= 0.2 && perofb.level < 0.3) document.getElementById('battery').innerHTML = '\n <path d="M16,18H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                    if (perofb.level >= 0.3 && perofb.level < 0.4) document.getElementById('battery').innerHTML = '\n <path d="M16,15H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                        if (perofb.level >= 0.4 && perofb.level < 0.5) document.getElementById('battery').innerHTML = '\n <path d="M16,14H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                            if (perofb.level >= 0.5 && perofb.level < 0.6) document.getElementById('battery').innerHTML = '\n <path d="M16,13H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                                if (perofb.level >= 0.6 && perofb.level < 0.7) document.getElementById('battery').innerHTML = '\n <path d="M16,12H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                                    if (perofb.level >= 0.7 && perofb.level < 0.8) document.getElementById('battery').innerHTML = '\n <path d="M16,10H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />'; else {
                                        if (perofb.level >= 0.8 && perofb.level < 0.9) document.getElementById('battery').innerHTML = '\n <path d="M16,9H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />';
                                        else perofb.level >= 0.9 && perofb.level < 1 ? document.getElementById('battery').innerHTML = '\n <path d="M16,8H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />' : document.getElementById('battery').innerHTML = '\n <path d="M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z" />';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //时间
    modal.classList.remove('fadeOut'),
        modal.classList.add('fadeIn'),
        modal.style.display = 'flex';
    const GetTime = new Date();
    let Hour = GetTime.getHours();
    Hour < 10 && (Hour = '0' + Hour);
    let Minutes = GetTime.getMinutes();
    Minutes < 10 && (Minutes = '0' + Minutes);
    document.getElementById('time').innerHTML = Hour + ':' + Minutes;
    const Day = GetTime.toDateString().replace('2023', '');
    document.getElementById('date').innerHTML = Day.substring(0, 3) + ',' + Day.substring(3), document.querySelector('body').style.overflow = 'hidden';
    let Betery = navigator.getBattery();
    Betery.then(show);
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

const modal = document.querySelector('.main-modal')
const mybutton = document.getElementById('back-to-top')//go back to the top 按钮
const modalx = document.getElementById('donation')
const modaly = document.getElementById('academy')
const hititle = document.getElementById('inhit_title')
const hisub = document.getElementById('inhit_sub')
const position = document.getElementById('fontAwesomeCss');

window.onscroll = function () {
    scrollFunction();
}
if (document.cookie === 'theme=dark') darkmode();
else document.cookie === 'theme=white' ? whitemode() : window.matchMedia('(prefers-color-scheme: dark)').matches ? darkmode() : whitemode();
if (isInclude('test.js')) {
    hititle.style.display = ''
    hisub.style.display = '';
}
