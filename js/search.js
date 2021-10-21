$(document).ready(function () {
    var doSearch = function () {
        let url = new URL(location.href);
        let searchParams = new URLSearchParams(url.search);
        const searchString = searchParams.get('key');
        $(".search-text").text(searchString);
        getProducts("?title_like=" + searchString, ".search-list", false);
    }

    doSearch();
})