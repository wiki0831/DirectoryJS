var key = 'https://api.pamplin.vt.edu/v1/persons/directory?kind=pamplin'
var instakey = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=3410415084.1677ed0.6d5bc4c26f5d4a85860f369f443e1c3f'


$.getJSON( "stored/test.json", function( data ) {
  $.forEach(data, function(d, i) {
     $('#name').html(d.name);
     $('#period').html(d.period);
     $('#location').html(d.location);
     $('#discovered').html(d.discovered); 
  });
});



