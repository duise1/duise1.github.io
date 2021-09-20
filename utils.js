(function(win, $){
  function tplReplace(templateString, replaceData) {
    return templateString.replace(/\{\{(.*?)\}\}/g, function (node, key) {
      return replaceData[key.trim()]
    })
  }

  function getData(url, success) {
    $.getJSON(
      url,
      function(data) {
        success(data);
      }
    )
  }

  function timerLoopInit(el, time) {
    var timeSecond = time * 60;
     var timers = setInterval(function(){
      timeSecond--;
      if(timeSecond == 0) {
        clearInterval(timers)
      }
      var second = timeSecond % 60,
          minute = Math.floor(timeSecond/60);
      if(second < 10) {
        second = '0' + second;
      }
      el.html(`${minute} minutes  ${second} seconds `)
    }, 1000);

  }
  win.tools = {
    tplReplace: tplReplace,
    getData: getData,
    timerLoopInit: timerLoopInit
  }
})(window, jQuery);