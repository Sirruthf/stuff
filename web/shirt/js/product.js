import Q from '/projects/for_short.js';
import Table from '/projects/shirt/js/AvailabilityTable.js';

let product_id = -1;

let table = new Table(Q(".stock_left").value, { // init's arbitrary
    type: Q(".type-list__select").value,
    size: Q(".size-list__select").value,
    color: Q(".color-list__select").value
});

recalcAvailability(table);

Q(".type-button", true).forEach(button => button.on("click", () => {
    table.type = button.to(".type-list__select").value;
    recalcAvailability(table);
}));

Q(".size-button", true).forEach(button => button.on("click", () => {
    table.size = button.to(".size-list__select").value;
    recalcAvailability(table);
}));

Q(".color-button", true).forEach(button => button.on("click", () => {
    table.color = button.to(".color-list__select").value;
    recalcAvailability(table);
}));

Q(".color-button", true).forEach(button => button.on("click", () => {
    table.color = button.value;
    recalcAvailability(table);
}));

Q(".qnt-button", true).on("click", () =>
    recalcAvailability(table));
    
Q(".quantity-unit__input").on("input", () =>
    recalcAvailability(table));


function recalcAvailability (table) {
    Q(".quantity_counter").textContent = table.max;
    let unav = +Q(".quantity-input").value > table.max;
    
    Q(".buy-button").class("button_disabled", unav);
    Q(".buy-button").disabled = unav;
    Q(".quantity_warning").hidden = !unav;
}

