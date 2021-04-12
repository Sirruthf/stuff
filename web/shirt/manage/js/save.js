function setupResetButton (button, screen, url, callback = () => {}) {
    button.addEventListener("click", async () => {
        screen.classList.add("saved-screening_fade");
        setTimeout(() => screen.classList.remove("saved-screening_fade"), 450);
        
        let response = await fetch(url);
        
        callback(response);
    });
}

function setupSaveButton (button, url, getData = () => {}, callback = () => {}) {
    let plate = document.querySelector(".saved-plate");
    let screen = document.querySelector(".saved-screening");
    
    const PLATE_TIME = 450;
    
    button.addEventListener("click", async () => {
        let data = getData();
        let form = new FormData();
        
        for (let key in data)
            if (data[key].filename)
                form.append(key, data[key].blob, data[key].filename);
            else
                form.append(key, data[key]);
        
        plate.classList.add("saved-plate_fade");
        screen.classList.add("saved-screening_fade");
        
        let reply = await fetch(url, {
            method: "POST",
            body: form,
        }).then(response => response.text());
        
        console.log(reply);
        
        callback();
        
        setTimeout(() => {
            plate.classList.remove("saved-plate_fade");
            screen.classList.remove("saved-screening_fade");
        }, PLATE_TIME);
    });
}

function guidGenerator() {
    function S4 () {
       return (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
    }
    
    return (S4() + "-" + S4());
}

