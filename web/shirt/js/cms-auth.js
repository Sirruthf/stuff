document.addEventListener("keyup", event => {
    if (event.ctrlKey && event.shiftKey && event.code == "KeyA") {
        event.preventDefault();
        document.location.href = "/projects/shirt/manage/";
    }
});