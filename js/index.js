/* eslint-disable no-undef */
$(document).ready(function () {
    
    function generateProduct(data){
        const $prodList = $("#prodList");
        const $tempMenu = $("#tempMenu");
        $.get('/components/product-card.html', a => {
           for (var product of data){
               $tempMenu.append(a);
               $($tempMenu).find(".prod-img").attr("src",`images/${product.id}.png`);
               $($tempMenu).find(".prod-name").text(product.title);
               $($tempMenu).find(".prod-price").text(product.price);
               $($tempMenu).find(".dsc-price").text("$" + product.dscPrice);
               $prodList.append($tempMenu.children()[0]);
              
           } 
        })
      }

    $.ajax({
        type: "get",
        dataType: 'json',
        url: 'product.json'
      }).done(function(data) {
        generateProduct(data.product);
      }).fail(function(jqXHR, textStatus, errorThrown) {
        $(".hot-product-list").empty();
        console.log(textStatus + ': ' + errorThrown);
      });

});
