$(document).ready(function(){
    console.log("hello");
    $("header").on("mouseenter", ".dropdown", function(){
        $(this).find(".dropdown-menu").addClass("dropdownCustom");
        $(this).find(".dropdown-menu").stop(true, false).slideDown("slow");
      });
    $("header").on("mouseleave", ".dropdown", function(){
          
        $(this).find(".dropdown-menu").stop(true, false).slideUp("slow");
          
    });
  });