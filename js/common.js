$(document).ready(function(){
    console.log("hello");
    $("body").on("mouseenter", ".dropdown", function(){
        $(".dropdown-menu").addClass("dropdownCustom");
        $(".dropdown-menu").stop(true, false).slideDown("slow");
      });
    $("body").on("mouseleave", ".dropdown", function(){
          
        $(".dropdown-menu").stop(true, false).slideUp("slow");
          
    });
  });