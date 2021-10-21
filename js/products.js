$(document).ready(function () {
    getProducts("?cat=Food&_limit=4",".food-list", false);
    getProducts("?cat=Veg&_limit=4", ".veg-list", false);
    getProducts("?cat=Bevs&_limit=4", ".bevs-list", false);
})