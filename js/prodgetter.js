//push data to product card component
function generateProduct(data, target, single) {
  const $prodList = $(target);
  if (!single) {
    
    $.get('/components/product-card.html', a => {
      for (const product of data) {
        console.log(product);
        let $tempMenu = $(a);
        $tempMenu.find(".prod-img").attr("src", `images/${product.id}.png`);
        $tempMenu.find("a").attr("href", `/single.html?id=${product.id}`);
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
  else {
    const product = data[0];
    $prodList.find(".prod-img").attr("src", `images/${product.id}.png`);
    $prodList.find(".magGlass").css({
      background: `url("../images/${product.id}.png") no-repeat`,
      backgroundSize: "500px auto"
    })
    $prodList.find("h2").text(product.title);
    $prodList.find(".prod-price").text(parseFloat(product.price).toFixed(2));
    $prodList.find(".dsc-price").text("$" + parseFloat(product.dscPrice).toFixed(2));
    $prodList.find(".pro-id").val(product.id);
    if (product.qty == 0) {
      $prodList.find(".prod-img-container").addClass("no-stock");
      $prodList.find(".buying-area").addClass("no-stock");
      $prodList.find(".no-stock-img").css("display", "block");
    }
  }
}
//call to data to retrieve product list
var getProducts = function (param, target, single) {
  $.ajax({
    type: "get",
    dataType: 'json',
    url: `http://localhost:3000/products${param}`
  }).done(function (data) {
    if (data.length) 
      generateProduct(data, target, single);
    else {
      $(target).html("No products found.");
      console.log("no product available!");
    }

  }).fail(function (jqXHR, textStatus, errorThrown) {
    $(target).html("Cannot connect to database");
    console.log(textStatus + ': ' + errorThrown);
  });
}