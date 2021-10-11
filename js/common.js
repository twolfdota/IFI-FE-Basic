$(document).ready(function(){
  //Retrieve common elements
  const $header = $('header');
  const $footer = $('footer');
  menuList = "";
  var partInit = function(parentDiv, dataURL) {
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
    url: 'menu.json'
  }).done(function(data) {
    tempData = data.menus;
    for (var m of tempData){
      if(m.childs ){
        subMenu = "";
        for(var n of m.childs){
          subMenu+=`<a class="dropdown-item" href="#">${n.title}</a>`;
        }
        console.log(subMenu);
        menuList+=`<li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="${m.id}" role="button" aria-haspopup="true" aria-expanded="false">
          ${m.title}
        </a>
        <div class="dropdown-menu" aria-labelledby="${m.id}">
          ${subMenu}
        </div>
      </li>`
      }
      else {
        menuList+=`<li class="nav-item">
        <a class="nav-link" id="${m.id}" href="#">${m.title}</a>
      </li>`
      }
    } 
    $("#bannerNavList").append(menuList);
    console.log(data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $("#bannerNavList").empty();
    console.log(textStatus + ': ' + errorThrown);
  });

  //Slidedown for topnav account menu
    $("header").on("mouseenter", ".dropdown", function(){
        $(this).find(".dropdown-menu").addClass("dropdownCustom");
        $(this).find(".dropdown-menu").stop(true, false).slideDown("fast");
      });
    $("header").on("mouseleave", ".dropdown", function(){
          
        $(this).find(".dropdown-menu").stop(true, false).slideUp("fast");
          
    });

    $(".banner-nav").on("mouseenter", ".dropdown", function(){
   
      $(this).find(".dropdown-menu").addClass("dropdownItemCustom");
  
      $(this).find(".dropdown-menu").stop(true, false).slideDown("fast");
    });
    $(".banner-nav").on("mouseleave", ".dropdown", function(){
      $(this).find(".dropdown-menu").stop(true, false).slideUp("fast");
        
    });

    //
    $('.carousel').carousel({
      interval: 4000
    }); 
  });