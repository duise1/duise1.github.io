(function(win, $){
  var message = 'You must to share information about our coronavirus virus Outbreak Fund with your friends. Share it until the blue bar is full!';

  $('.toast').on('click', '.toast-btn', function() {
    $('.toast').fadeOut();
  })

  function show(msg){
    var msg = msg || message;
    $('.toast .toast-text').html(msg);
    $('.toast').fadeIn();
  }

  win.Toast = {
    show: show
  }
})(window, jQuery);