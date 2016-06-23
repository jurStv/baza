$(document).ready(function(){
  var video = $('#zzzzzz')
  var audio = $('#xxxxxx')
  video.on('canplaythrough', function(){
    setTimeout(function(){
      video.get(0).play()
      video.get(0).playbackRate = 0.5;
      audio.get(0).volume = 0;
      var int = setInterval(function(){
        if (audio.get(0).volume === 1) {
          clearInterval(int)
          return
        }
        audio.get(0).volume += 0.1
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


  var _target = new Date(2016, 6, 2, 22);
  var target = _target.getTime();

  setInterval( function() {
    var now = Date.now();
    var delta = target - now;
    var YYY = new Date(2016, 6, 2, 22);
    YYY.setTime(delta)
    var days     = YYY.getDate();
    var hours    = YYY.getHours();
    var seconds  = YYY.getSeconds();
    var minutes  = YYY.getMinutes();

    var realTime = ( days < 10 ? '0' : '' ) + days + 'д ' + ( hours < 10 ? '0' : '' ) + hours + ' : ' + ( minutes < 10 ? '0' : '' ) + minutes + ' : ' + ( seconds < 10 ? '0' : '' ) + seconds

    $('.time').html(realTime);
    $('.time').attr('data-time', realTime);

  }, 1000);
})
