$(document).ready(function(){
  var video = $('#zzzzzz')
  var audio = $('#xxxxxx')
  video.on('canplaythrough', function(){
    setTimeout(function(){
      video.get(0).play()
      video.get(0).playbackRate = 0.5;
      audio.get(0).volume = 0;
      var int = setInterval(function(){
        try {
          audio.get(0).volume += 0.1
        } catch (e) {
          audio.get(0).volume = 1;
          clearInterval(int)
        }
      }, 200)
      audio.get(0).play()
      $('#loading-modal').animate({opacity: 0}, {duration: 700, complete: function(){
        $('#loading-modal').hide();
      }});
    }, 2000)
  });

  function second_passed() {
    $('.clock').removeClass('is-off');
  }
  setTimeout(second_passed, 2000)

  $('.switcher').on('click', function(e) {
    e.preventDefault();
    $('.screen').toggleClass('glitch');
  });


  var target = moment().set({'year': 2016, 'month': 6, 'date': 2, 'hour': 22});
  setInterval( function() {
    var now = moment();
    var delta = target.diff(now, 'seconds');
    var realTime = moment.duration(delta, "seconds").format("Dд HH : mm : ss");

    $('.time').html(realTime);
    $('.time').attr('data-time', realTime);

  }, 1000);
})
