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


  $(document).click(function (e) {
    if (!$(e.target).hasClass("cart-modal") && !$(e.target).parents("#cartWrapper").length && $(e.target).attr("class") != "cart-item-remover") {
      $('.my-popup').hide();
    }
  });

  $("header").on("click", ".close", function () {
    $(".my-popup").hide();
  })


  $("header").on("click", ".btn-search", function(e){
      e.preventDefault();
      const searchText = $(e.target).parent().find(".search-text").val();
      window.location.href = `/search.html?key=${searchText}`;
  })

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


});