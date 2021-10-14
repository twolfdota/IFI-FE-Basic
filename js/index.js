/* eslint-disable no-undef */
$(document).ready(function () {

  //push data to product card component
  function generateProduct(data) {
    const $prodList = $("#prodList");
    $.get('/components/product-card.html', a => {
      for (var product of data) {
        let $tempMenu = $(a);
        $tempMenu.find(".prod-img").attr("src", `images/${product.id}.png`);
        $tempMenu.find(".prod-name").text(product.title);
        $tempMenu.find(".prod-price").text(parseFloat(product.dscPrice).toFixed(2));
        $tempMenu.find(".dsc-price").text("$" + parseFloat(product.price).toFixed(2));
        $tempMenu.find(".pro-id").val(product.id);
        if (product.dscPrice == product.price) {
          $tempMenu.find(".dsc-price").hide();
          $tempMenu.find(".offer-icon").hide();
        }
        if (product.qty == 0) {
          $tempMenu.find(".prod-container").addClass("no-stock");
          $tempMenu.find(".no-stock-img").css("display", "block");
        }
        $prodList.append($tempMenu);

      }
    })
  }
  //call to data to retrieve product list
  $.ajax({
    type: "get",
    dataType: 'json',
    url: 'http://localhost:3000/products'
  }).done(function (data) {
    generateProduct(data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    $("#prodList").empty();
    console.log(textStatus + ': ' + errorThrown);
  });

  //setup carousel time
  $('.carousel').carousel({
    interval: 4000
  });



});
