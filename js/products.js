$(document).ready(function () {
    getProducts("?cat=Food&_limit=4",".food-list");
    getProducts("?cat=Veg&_limit=4", ".veg-list");
    getProducts("?cat=Bevs&_limit=4", ".bevs-list");
})