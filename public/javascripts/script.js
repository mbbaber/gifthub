document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


// Hides the login form when the page first launches
$( "#login-form" ).hide();
$( "#signup-link" ).addClass( "active" );

// Toggles the forms upon clicking on either link
$( "#login-link" ).click(() => {
  $( "#signup-form" ).toggle();
  $( "#login-form" ).toggle();
  $( "#login-link" ).addClass( "active" );
  $( "#signup-link" ).removeClass( "active" );
});

$( "#signup-link" ).click(() => {
  $( "#login-form" ).toggle();
  $( "#signup-form" ).toggle();
  $( "#signup-link" ).addClass( "active" );
  $( "#login-link" ).removeClass( "active" );
});