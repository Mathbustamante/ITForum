// $( document ).ready(function () {
//   $(".moreBox").slice(0, 3).show();
//     if ($(".blogBox:hidden").length != 0) {
//       $("#loadMore").show();
//     }   
//     $("#loadMore").on('click', function (e) {
//       e.preventDefault();
//       $(".moreBox:hidden").slice(0, 6).slideDown();
//       if ($(".moreBox:hidden").length == 0) {
//         $("#loadMore").fadeOut('slow');
//       }
//     });
//   });


//Load more button

$(function(){
    $(".questions").slice(0, 7).show(); // select the first ten
    $("#loadMore").click(function(e){ // click event for load more
        e.preventDefault();
        $(".questions:hidden").slice(0, 7).show(); // select next 10 hidden divs and show them
        if($(".questions:hidden").length == 1){ // check if any hidden divs still exist
            alert("All our questions"); // alert if there are none left
        }
    });
});