import Q from '/projects/for_short.js';


console.log(Q);

function rowIsLiable (row, polynominal) {
    return [...row].every((value, on) => value == "1" || value == polynominal[on]);
}

/** unpure */
function displayMembers (opts) {
    Q(".polynome-format").innerHTML = opts.map(opt => "<span class='polynopt-format__item' data-for='" + opt.dataset.for + "'>" + opt.textContent + "</span>").join(" <span class='dephasized'>\u2295</span> ");
}

/** unpure */
function applyMembers (opts) {
    let checked = opts.filter(opt => opt.querySelector(".polynome-option__check").checked);
    displayMembers(checked);
    
    Q(".func-table__row", true).forEach(row => {
        let result = false;
        checked.map(check => check.dataset.for).forEach(check => {
            if (rowIsLiable(row.dataset.values, check))
                result = !result;
        });
        row.cells[4].classList[result ? "add" : "remove"]("one");
    });
    
    Q(".polynomes-total").textContent = checked.length;
}


let polynopts = Q(".polynome-option", true), polynitems = Q(".polynopt-format__item", true);
polynopts.on("click", () => {
    applyMembers(polynopts);
    polynitems = Q(".polynopt-format__item", true);
});

let funrows = Q(".func-table__row", true);
funrows.on("mouseenter", function () {
    funrows.forEach(item => {
        item.classList.add("dephasized");
    });
    
    polynopts.filter(opt => [...opt.dataset.for].some((value, on) => value == "1" && value != this.dataset.values[on])).forEach(opt => opt.classList.add("dephasized"));
    polynitems.filter(opt => [...opt.dataset.for].some((value, on) => value == "1" && value != this.dataset.values[on])).forEach(opt => opt.classList.add("dephasized"));
    this.classList.remove("dephasized");
});

funrows.on("mouseleave", () => {
    polynopts.forEach(opt => opt.classList.remove("dephasized"));
    polynitems.forEach(opt => opt.classList.remove("dephasized"));
});

Q(".func-table").on("mouseleave", () => {
    funrows.forEach(item => item.classList.remove("dephasized"));
    polynopts.forEach(item => item.classList.remove("dephasized"));
});

let values = Q(".func-table__value", true);
values.on("click", function () {
    this.classList.toggle("one");
    let applied = [];
    values.map((item, i) => {
        let truthy = item.classList.contains("one");
        let rowdsc = item.parentElement.dataset.values;
        let membered = truthy != applied.reduce((prev, poly) => (prev ^ rowIsLiable(rowdsc, poly)), 0);
        
        if (membered)
            applied.push(funrows[i].dataset.values);
        
        return [rowdsc, membered];
    }).forEach(dsc => {
        polynopts.find(opt => opt.dataset.for == dsc[0]).querySelector(".polynome-option__check").checked = dsc[1];
    });
    
    displayMembers(polynopts.filter(opt => opt.querySelector(".polynome-option__check").checked));
    polynitems = Q(".polynopt-format__item", true);
});