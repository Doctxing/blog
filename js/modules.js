function fadePlugin(hook, vm) {
    hook.beforeEach((content, next) => {
        const el = document.querySelector('#main');
        if (el) {
            el.classList.remove('fadein');
            el.classList.add('fadeout', 'faster');
            setTimeout(() => { next(content); }, 500);
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
}

function archivePlugin(hook, vm) {
    
    function parseItems(content) {
        const lines = content.trim().split('\n');
        const items = [];
        for (let i = 0; i < lines.length; i += 1) {
            const title = lines[i]?.match(/title:\s*(.*)/)?.[1]?.trim();
            if (title) {
                const date = lines[i + 1]?.match(/date:\s*(.*)/)?.[1]?.trim();
                const link = lines[i + 2]?.match(/link:\s*(.*)/)?.[1]?.trim();
                const cover = lines[i + 3]?.match(/cover:\s*(.*)/)?.[1]?.trim();
                if (date && link) {
                    items.push({ title, dat: new Date(date), link, cover });
                }
            }
        }
        items.sort((a, b) => b.dat - a.dat);
        return items;
    }
    function groupByYear(items) {
        const grouped = {};
        for (const item of items) {
            const year = item.dat.getFullYear();
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(item);
        }
        return grouped;
    }
    function fmtDate(d) {
        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }

    hook.beforeEach((content, next) => {
        const path = vm.route.path;
        if (path !== '/blogs/' && path !== '/storage') return next(content);

        const items = parseItems(content);
        const grouped = groupByYear(items);
        const firstLine = content.trim().split('\n')[0];
        const years = Object.keys(grouped).sort((a, b) => b - a);

        if (path === '/blogs/') {
            const content = firstLine + '\n\n' + years.map(year =>
                '## ' + year + '\n\n<div class="blogs-list">\n' +
                grouped[year].map(item =>
                    `<a href="${item.link}" style="background-image:url(${item.cover})">\n<div>\n` +
                    `<span class="title">${item.title}</span>\n` +
                    `<span class="date">${fmtDate(item.dat)}</span>\n` +
                    '</div>\n</a>\n'
                ).join('\n') + '</div>'
            ).join('\n\n');
            next(content);
        } else {
            const content = firstLine + '\n\n' + years.map(year =>
                '## ' + year + '\n<ul class="storage">\n' +
                grouped[year].map(item =>
                    `<li><a href="${item.link}">${item.title}</a><span>${fmtDate(item.dat)}</span></li>\n`
                ).join('\n') + '</ul>'
            ).join('\n\n');
            next(content);
        }
    });
}
