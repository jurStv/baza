$(document).ready(function(){
  var video = $('#zzzzzz')
  var audio = $('#xxxxxx')
  var first = false

  video.on('canplaythrough', function(){
    if (!first) {
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
      }, 2000);
      first = true
    }
  });

  function second_passed() {
    $('.clock').removeClass('is-off');
  }
  setTimeout(second_passed, 2000)

  var target = moment().set({'year': 2016, 'month': 6, 'date': 2, 'hour': 22, 'minute': 0, 'second': 0});
  setInterval( function() {
    var delta = target.diff(moment(), 'seconds');
      console.log(delta)
    var realTime = moment.duration(delta, "seconds").format("D[д] H : m : s");

    $('.time').html(realTime);
    $('.time').attr('data-time', realTime);

  }, 1000);
})
