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
        // if($(".box-questions:hidden").length == 0){ // check if any hidden divs still exist
        //     alert("All our questions"); // alert if there are none left
        // }
    });
});


//When the button with class 'submit' in the post/new file is clicked, I will chnage the value of a hideden input to the text
//on the dropdown. That way I can submit the category through the input and not the dropdownitdelf. (Coulndnt figure out
//how to submit the category to the database. Found this solution)

$( ".submit" ).click(function() {
  var conceptName = $( "#myselect option:selected" ).text();
  $("#dropdown-input").val(conceptName);
  // console.log(conceptName);
});


$( ".submit-login" ).click(function() {
  var email = $('#email-name').val();
  $("#email-login").val(email + '@nebrwesleyan.edu');
  // console.log(email + '@nebrwesleyan.edu');
});