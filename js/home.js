/* eslint-disable no-undef */
$(document).ready(function () {


  getProducts("?cat=Offer&_limit=4", "#prodList", false);
  //setup carousel time
  $('.carousel').carousel({
    interval: 4000
  });



});
