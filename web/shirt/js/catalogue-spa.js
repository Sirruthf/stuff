function update_default({cat_name, pop, parent_name, is_master, url}) {
    document.querySelector(".top_block__title").textContent = cat_name;
    document.querySelector(".counter").textContent = pop;
    document.querySelector(".breadcrumbs__second .link").textContent = parent_name;
    document.querySelector(".breadcrumbs__second").classList[(is_master ? "remove" : "add")]("breadcrumbs__second_visible");
    
    let a = document.querySelector(".selected"); if (a) a.classList.remove("selected");
    document.querySelector("[data-href=\"" + url + "\"]").parentElement.classList.add("selected");
}

const FADE_TIME = 200, FADE_GAP = 60;
const DEFAULT_REMOTE = "/projects/shirt/lib/fetch_category.php";

    
async function updatePage({remote, shirt_block, url, href = null, prefix = "", update = () => {}}) {
    assert({
        remote: remote, shirt_block: shirt_block, url: url
    });
    
    let response = fetch(remote + "?url=" + encodeURIComponent(url) + "&prefix=" + encodeURIComponent(prefix));
    let cat_name, is_master, parent_name, parent_url, content, pop;
    
    try {
        [cat_name, is_master, parent_name, parent_url, content, pop] = await response.then(response => response.clone().json());
    } catch (err) {
        console.log(await response.then(response => response.text()));
        throw err;
    }
    
    if (href)
        history.pushState({ url: url }, window.title, href);
    
    update({cat_name, pop, parent_name, is_master, url});
    
    let snapshot = [...shirt_block.children], limit = Math.max(snapshot.length, content.length), removeQueue = [];
    for (let i = 0; i < limit; i++, await new Promise(end => setTimeout(end, FADE_GAP))) {
        if (i < snapshot.length)
            snapshot[i].classList.add("fade");
        
        setTimeout(() => {
            if (i >= content.length) {
                removeQueue.push(snapshot[i]);
            } else {
                let tmp = document.createElement("div"); tmp.innerHTML = content[i]; tmp = tmp.firstElementChild;
                tmp.classList.add("unfade");
                
                if (i < snapshot.length)
                    snapshot[i].replaceWith(tmp);
                else
                    shirt_block.append(tmp);
                
                setTimeout(() => tmp.classList.remove("unfade"), FADE_GAP);
            }
        }, FADE_TIME);
    }
    
    setTimeout(() => {
        removeQueue.reverse().forEach(item => item.remove());
    }, FADE_TIME);
}

function assert (vars) {
    for (let key in vars)
        if (!vars[key]) throw new Error ("Required parameter is missing: " + key);
}

export default function setupSPA(targets, {remote = DEFAULT_REMOTE, shirt_block = null, update = update_default, prefix = ""}) {
    let ready = true;
    
    window.addEventListener("popstate", event => {
        updatePage({
            remote: remote,
            shirt_block: shirt_block,
            url: event.state.url,
            update: update
        });
    });
    
    [...targets].forEach(one => one.addEventListener("click", event => {
        event.preventDefault();
        
        if (one.parentElement.classList.contains("selected")) return;
        if (!ready) return; ready = false;
        
        updatePage({
            remote: remote,
            shirt_block: shirt_block,
            url: event.target.dataset.href,
            prefix: prefix,
            href: event.target.getAttribute("href"),
            update: update
        });
        
        setTimeout(() => {
            ready = true;
        }, FADE_TIME);
    }));
}
