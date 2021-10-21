//recalculate and synchronize cart data
var recalculate = function () {
  let subTotal = 0;
  let rawCart = JSON.parse(localStorage.getItem("myCart"));
  const itemCount = Object.keys(rawCart).length;
  $(".cart").each(function () {
    subTotal = 0;
    $(this).find(".cart-item").each(function () {
      if (!rawCart[$(this).attr("proId")]) {
        $(this).remove();
      }
      else {
        const originPrice = parseFloat($(this).find(".origin-price").val());
        const dscPrice = parseFloat($(this).find(".price-after-dsc").val());
        const rawQty = parseInt(rawCart[$(this).attr("proId")].qty);
        $(this).find(".cart-qty").val(rawQty);

        let deposit = rawQty * (originPrice - dscPrice);
        let itemTotal = rawQty * dscPrice;
        console.log(itemTotal);
        subTotal += itemTotal;
        $(this).find(".cart-disc-depo").text(deposit.toFixed(2));
        $(this).find(".cart-item-total").text(itemTotal.toFixed(2));
      }
    })
  })
  $(".cart-count").text(itemCount);
  $(".cart-subtotal").text(subTotal.toFixed(2));
  if($(".total-final").length) {
    if($(".service-charge").length) subTotal += parseFloat($(".service-charge").text());
    $(".total-final").text(subTotal.toFixed(2)); 
  } 
}

//init cart
var initCart = function () {
  let itemCount = 0;
  $cartContainer = $(".my-cart");
  $cartContainer.empty();
  if ($(".table-cart").length) $(".table-cart tbody").empty();
  if ($(".mini-cart").length) $(".mini-cart .mini-prod-list").empty();
  if (!localStorage.getItem("myCart")) {
    localStorage.setItem("myCart", JSON.stringify({}));
  }
  let rawCart = JSON.parse(localStorage.getItem("myCart"));

  if (!Object.keys(rawCart).length) {
    $("header").find("#cartModalLabel").text("Your shopping cart is empty");
    $("header").find(".cart-container").hide();
  }
  else {
    $("header").find("#cartModalLabel").text("");
    $("header").find(".cart-container").show("");
    let param = "?";
    for (let key in rawCart) {
      param += `id=${key}&`;
    }
    $.ajax({
      type: "get",
      dataType: 'json',
      async: false,
      url: `http://localhost:3000/products/${param}`
    }).done(function (data) {
      for (const product of data) {
        itemCount++;
        newCartItem = `<div class="cart-item" proId="${product.id}">
            <div class="title-n-discount">
            <p class="cart-title">${product.title}</p>
            <p class="cart-item-discount">Discount: $<span class="cart-disc-depo"></span></p>
            </div>
            <div class="cart-item-detail">
            <input class="cart-qty" type="text" value="${rawCart[product.id].qty}"/>
            <button class="cart-item-remover">x</button>
            <div class="cart-item-price-container">
            <p>$<span class="cart-item-total"></span></p>
            <input type="hidden" class="origin-price" value="${product.price}"/>
            <input type="hidden" class="price-after-dsc" value="${product.dscPrice}"/>
            </div>
            </div>
          </div>`

        $cartContainer.append(newCartItem);
        if ($(".table-cart").length) {
          const newRowItem = `<tr class="cart-item" proId="${product.id}">
            <td class="carttbl-count">${itemCount}</td>
            <td><img src="images/${product.id}.png" alt="pro-img" height="50" width="auto"/></td>
            <td><input class="minus cart-modal" value="-" type="button"/>
                <input type="text" class="cart-qty" disabled value="${rawCart[product.id].qty}">
                <input class="plus cart-modal" value="+" type="button"/>
            </td>
            <td>${product.title}</td>
            <td>$<span class="cart-item-total"></span>
                <input type="hidden" class="origin-price" value="${product.price}"/>
                <input type="hidden" class="price-after-dsc" value="${product.dscPrice}"/>
            </td>
            <td><button class="cart-item-remover cart-modal"></button></td>
        </tr>  `;
          $(".table-cart tbody").append(newRowItem);
        }
        if($(".mini-cart").length) {
          const newMiniItem = `<li class="cart-item" proId="${product.id}">
            <input type="hidden" class="origin-price" value="${product.price}"/>
            <input type="hidden" class="price-after-dsc" value="${product.dscPrice}"/>
            <input type="hidden" class="cart-qty" value="${rawCart[product.id].qty}">
            ${product.title}<i>-</i><span class="cart-item-total"></span>
          </li>`;
          $(".mini-cart .mini-prod-list").append(newMiniItem);
        }
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      $cartContainer.empty();
      console.log(textStatus + ': ' + errorThrown);
    });
  }

  recalculate();
  $(".cart-count").text(itemCount);
}

//remove item from cart list using id
function removeById(cart, itemId, event) {
  let deleted = false;
  if (cart) {
    delete cart[itemId];
    deleted = true;
  }
  if (deleted) {
    $(event.target).closest(".cart-item").remove();
    localStorage.setItem('myCart', JSON.stringify(cart));
    console.log(!Object.keys(cart).length);
    if (!Object.keys(cart).length) {
      $("header").find(".my-popup").hide();
    }
  }
}

  //refresh cart and show using show cart button 
  $("header").on("click", ".show-cart", function (e) {
    initCart();
    $(".my-popup").show();
  })


  //addToCart 
  $("body").on("click", ".prod-add-btn", function (e) {
    itemDup = false;

    itemId = $(e.target).parent().find(".pro-id").val();
    let rawCart = JSON.parse(localStorage.getItem("myCart"));
    console.log(itemId);
    if (!rawCart) rawCart = {};
    if (rawCart[itemId]) {

      var numQty = parseInt(rawCart[itemId].qty) + 1;
      console.log(numQty);
      rawCart[itemId].qty = numQty;
    }

    else {
      const newItem = {
        proId: itemId,
        qty: 1
      }
      rawCart[itemId] = newItem;

    }
    localStorage.setItem('myCart', JSON.stringify(rawCart));
    initCart();
    $(".my-popup").show();
  });




  //remove cart item on click
  $("body").on("click", ".cart-item-remover", function (e) {
    let rawCart = JSON.parse(localStorage.getItem("myCart"));
    const currId = $(e.target).closest(".cart-item").attr("proId");
    console.log(currId);
    removeById(rawCart, currId, e);
    recalculate();
  })

  //delay time when keyup as replace for enter button for text input
  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  $("body").on("keyup", ".cart-qty", function (e) {
    delay(function () {
      $(e.target).blur();
    }, 400)
  })

  //update cart qty
  $("body").on("change", ".cart-qty", function (e) {
    const newQty = $(e.target).val();
    const currId = $(e.target).closest(".cart-item").attr("proId");
    console.log(currId);
    let rawCart = JSON.parse(localStorage.getItem("myCart"));
    if (!(newQty) || isNaN(newQty) || parseInt(newQty) < 0 || newQty.includes(".")) {
      alert("invalid quantity value!");
      return;
    }
    else if (parseInt(newQty) == 0) {
      removeById(rawCart, currId, e);
    }
    else {
      rawCart[currId].qty = newQty;
      localStorage.setItem('myCart', JSON.stringify(rawCart));
    }
    recalculate();
  })

