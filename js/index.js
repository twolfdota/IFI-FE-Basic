/* eslint-disable no-undef */
$(document).ready(function () {
    const $header = $('header');
    $.get('./components/header.html', data => {$header.append(data)})
    
});
