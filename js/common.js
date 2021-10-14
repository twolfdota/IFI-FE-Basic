$(document).ready(function () {
  //Retrieve common elements
  const $header = $('header');
  const $footer = $('footer');
  menuList = "";

  var partInit = function (parentDiv, dataURL) {
    return $.get(dataURL, data => {
      parentDiv.append(data)
    })
  }

  partInit($header, './components/header.html');
  partInit($footer, './components/footer.html');
  //Retrieve banner menu list
  /*$.ajax({
    url: 'menu.json',
    dataType: 'json',
    success: function(data) {
      tempMenuList ="";
      tempData = data.menus;
      for (var i in tempData){
        if(tempData[i].hasOwnProperty('childs') ){
          subMenu = "";
          $.each(tempData[i].childs, function(key,val){
            subMenu+=`<a class="dropdown-item" href="#">${val.title}</a>`;
          })
          console.log(subMenu);
          tempMenuList+=`<li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="${tempData[i].id}" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            ${tempData[i].title}
          </a>
          <div class="dropdown-menu" aria-labelledby="${tempData[i].id}">
            ${subMenu}
          </div>
        </li>`
        }
        else {
          tempMenuList+=`<li class="nav-item">
          <a class="nav-link" id="${tempData[i].id}" href="#">${tempData[i].title}</a>
        </li>`
        }
      } 
      $("#bannerNavList").append(tempMenuList);
    },
   statusCode: {
      404: function() {
        alert('There was a problem with the server.  Try again soon!');
      }
    }
  });*/



  $.ajax({
    type: "get",
    dataType: 'json',
    url: 'http://localhost:3000/menus'
  }).done(function (data) {
    for (var m of data) {
      if (m.childs) {
        subMenu = "";
        for (var n of m.childs) {
          subMenu += `<a class="dropdown-item" href="#">${n.title}</a>`;
        }
        console.log(subMenu);
        menuList += `<li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="${m.id}" role="button" aria-haspopup="true" aria-expanded="false">
          ${m.title}
        </a>
        <div class="dropdown-menu" aria-labelledby="${m.id}">
          ${subMenu}
        </div>
      </li>`
      }
      else {
        menuList += `<li class="nav-item">
        <a class="nav-link" id="${m.id}" href="#">${m.title}</a>
      </li>`
      }
    }
    $("#bannerNavList").append(menuList);
    console.log(data);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    $("#bannerNavList").empty();
    console.log(textStatus + ': ' + errorThrown);
  });

  //Slidedown for topnav account menu
  $("header").on("mouseenter", ".dropdown", function () {
    $(this).find(".dropdown-menu").addClass("dropdownCustom");
    $(this).find(".dropdown-menu").stop(true, false).slideDown("fast");
  });
  $("header").on("mouseleave", ".dropdown", function () {

    $(this).find(".dropdown-menu").stop(true, false).slideUp("fast");

  });

  //Slidedown for banner nav menu
  $(".banner-nav").on("mouseenter", ".dropdown", function () {

    $(this).find(".dropdown-menu").addClass("dropdownItemCustom");

    $(this).find(".dropdown-menu").stop(true, false).slideDown("fast");
  });
  $(".banner-nav").on("mouseleave", ".dropdown", function () {
    $(this).find(".dropdown-menu").stop(true, false).slideUp("fast");

  });


  //back-to-top button
  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      $('footer').find("#toTop").css("display", "block");
    } else {
      $('footer').find("#toTop").css("display", "none")
    }
  });

  $('footer').on('click', "#toTop", function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
  });



  var recalculate = function () {
    let subTotal = 0;
    $(".my-cart").find(".cart-item").each(function(){
        var originPrice = parseFloat($(this).find(".origin-price").val());
        var dscPrice = parseFloat($(this).find(".price-after-dsc").val());
        var rawQty = parseInt($(this).find(".cart-qty").val());

        
        var deposit = rawQty*(originPrice - dscPrice);
        var itemTotal = rawQty*dscPrice;
        subTotal += itemTotal;
        $(this).find(".cart-disc-depo").text(deposit.toFixed(2));
        $(this).find(".cart-item-total").text(itemTotal.toFixed(2));
    })
    $(".cart-subtotal").text(subTotal.toFixed(2));
  }
  //init cart
  var initCart = function () {
    //localStorage.removeItem("myCart");
    $cartContainer = $(".my-cart");
    $cartContainer.empty();
    if (!localStorage.getItem("myCart")) {
      localStorage.setItem("myCart", JSON.stringify({}));
    }
    var rawCart = JSON.parse(localStorage.getItem("myCart"));
    if(!rawCart.length) {
      $("header").find("#cartModalLabel").text("Your shopping cart is empty");
      $("header").find(".cart-container").hide();
    }
    else  {
      $("header").find("#cartModalLabel").text("");
      $("header").find(".cart-container").show("");
    }

    for (var n in rawCart) {
      thisQty = rawCart[n].qty;
      $.ajax({
        type: "get",
        dataType: 'json',
        async: false,
        url: `http://localhost:3000/products/${rawCart[n].proId}`
      }).done(function (data) {
        newCartItem = `<div class="cart-item proId="${data.id}">
          <div class="title-n-discount">
          <p>${data.title}</p>
          <p class="cart-item-discount">Discount: $<span class="cart-disc-depo"></span></p>
          </div>
          <div class="cart-item-detail" proId="${data.id}">
          <input class="cart-qty" type="text" value="${thisQty}"/>
          <button class="cart-item-remover">x</button>
          <div class="cart-item-price-container">
          <p>$<span class="cart-item-total"></span></p>
          <input type="hidden" class="origin-price" value="${data.price}"/>
          <input type="hidden" class="price-after-dsc" value="${data.dscPrice}"/>
          </div>
          </div>
          </div>`

        $cartContainer.append(newCartItem);

      }).fail(function (jqXHR, textStatus, errorThrown) {
        $cartContainer.empty();
        console.log(textStatus + ': ' + errorThrown);
      });

    }
    recalculate();
  }




  $("header").on("click", ".show-cart", function (e) {
    initCart();
  })


  //addToCart 
  $("#prodList").on("click", ".prod-add-btn", function (e) {
    itemDup = false;

    itemId = $(e.target).parent().find(".pro-id").val();
    var rawCart = JSON.parse(localStorage.getItem("myCart"));
    console.log(itemId);
    if (rawCart[0]) {
      for (var p of rawCart) {
        console.log(p.proId);
        if (p.proId == itemId) {
          var numQty = parseInt(p.qty) + 1;
          console.log(numQty);
          p.qty = numQty;
          itemDup = true;
          break;
        }
      }
    }
    else {
      rawCart = [];
    }
    if (!itemDup) {
      const newItem = {
        proId: itemId,
        qty: 1
      }
      rawCart.push(newItem);

    }
    localStorage.setItem('myCart', JSON.stringify(rawCart));
    initCart();
  });


  //remove item from list 
  function removeById(array, itemId, event) {
    let deleted = false;
    for (var a of array) {
      if (a.proId == itemId) {
        var currIndex = array.indexOf(a);
        if (currIndex > -1) {
          array.splice(currIndex, 1);
          deleted = true;
        }
        break;
      }
    }
    if (deleted) {
      $(event.target).closest(".cart-item").remove();
      localStorage.setItem('myCart', JSON.stringify(array));
      if (!array.length) $("header").find("#cartWrapper").modal("hide"); 
    }
  }


  //remove cart item on click
  $("header").on("click", ".cart-item-remover", function (e) {
    var rawCart = JSON.parse(localStorage.getItem("myCart"));
    var currId = $(e.target).parent().attr("proId");
    console.log(currId);
    removeById(rawCart, currId, e);
    recalculate();
  })


  var delay = (function(){
    var timer = 0;
    return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
   };
  })();

  $("header").on("keyup", ".cart-qty", function (e) {
    delay(function(){
      $(e.target).blur();
    }, 400)
  })

  //update cart qty
  $("header").on("change", ".cart-qty", function (e) {
    var newQty = $(e.target).val();
    var currId = $(e.target).parent().attr("proId");
    console.log(currId);
    var rawCart = JSON.parse(localStorage.getItem("myCart"));
    if (Number.isNaN(newQty) || parseInt(newQty) < 0) {
      alert("invalid quantity value!");
    }
    else if (parseInt(newQty) == 0) {
      removeById(rawCart, currId, e);
    }
    else {
      for (var p of rawCart) {
        if (p.proId == currId) {
          p.qty = newQty;
          break;
        }
      }
      localStorage.setItem('myCart', JSON.stringify(rawCart));
    }
    recalculate();
  })


});