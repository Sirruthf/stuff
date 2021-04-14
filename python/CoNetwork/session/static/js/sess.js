let upperForm  = $('.upperForm');
let bottomForm = $('.bottomForm');
let runButton = $('.runButton');

let selStart, selEnd;

let sendData = c_sendData();

upperForm.on("keydown", event => {
    selStart = upperForm[0].selectionStart;
    selEnd = upperForm[0].selectionEnd;

    if (event.keyCode == 9) {
        sendData({
            action: REP_ACTION,
            data: "\t",
            start: selStart,
            end: selEnd,
            length: 0
        });

        let _old = upperForm.val().split("");
        let _tmp = _old.slice(0, selStart);
            _tmp = _tmp.concat("\t");
            _tmp = _tmp.concat(_old.slice(selStart))

        upperForm.val(_tmp.join(""));

        event.preventDefault();
    }
});

upperForm.on("input", event => {
    event = event.originalEvent || event;

    let start = selStart;
    let end   = selEnd;

    let data = event.data;

    if (event.inputType == "insertLineBreak")
        data = "\n";

    if (event.inputType == "insertText" || event.inputType == "insertLineBreak" || event.inputType == "deleteContentBackward" && start != end)
        sendData({
            action: REP_ACTION,
            data: data,
            start: start,
            end: end,
            length: end - start
        });
    else {
        sendData({
            action: DEL_ACTION,
            data: [],
            start: start,
            end: end,
            length: end - start
        });
    }
});

upperForm.on("paste", event => {
    let data = (event.originalEvent || event).clipboardData.getData("text/plain");

    if (data) {
        sendData({
            action: REP_ACTION,
            data: data,
            start: upperForm[0].selectionStart,
            end: upperForm[0].selectionEnd,
            length: upperForm[0].selectionEnd - upperForm[0].selectionStart
        });
    }
});

runButton.on("click", () => {
    runButton.prop("disabled", true);

    $.post({
        url: "http://127.0.0.1:8080/",
        data: {
          code: upperForm.val()
        },
        success: resp => {
            runButton.prop("disabled", false);
            bottomForm.val(resp.output + "\r\n\r\n" + resp.traceback);
        },
        crossDomain: true,
    }).fail(err => {
        alert(err.statusText);
    });
});