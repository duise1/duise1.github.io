(function (win, $) {

  var Popup = {}
  var popupEl = $('.popup');
  Popup.showError = function (num) {
    $('.popup-contnet-change').html(`
      <img src="./success.png" alt="">
      <p class="popup-header">...</p>
      <p class="popup-text interval">${num}</p>
    `)
    popupEl.slideDown();
  }

  Popup.showSuccess = function (type) {
    tools.getData('./popup.json', function (data) {
      var successData = data[type], successHtml = '',textType = 'text';
      if(type === 'answerSuccess') {
        textType = 'textInterval';
      }
      successHtml += tools.tplReplace(tpl.popupSuccess('img'), { content: successData.img });
      successHtml += tools.tplReplace(tpl.popupSuccess('header'), { content: successData.title });
      successHtml += tools.tplReplace(tpl.popupSuccess(textType), { content: successData.desc });
      successHtml += tools.tplReplace(tpl.popupSuccess(textType), { content: successData.resules.title });
      var resulesArr = successData.resules.content;
      resulesArr.forEach(function (element) {
        successHtml += tools.tplReplace(tpl.popupSuccess(textType), { content: element });
      });
      $('.popup-contnet-change').html(successHtml);
      popupEl.slideDown();
    })
  }

  popupEl.on('click', '.popup-btn', function () {
    if(Popup.isCanvasShow){
      removeConfetti();
      $('#confetti-canvas').hide();
    }
    popupEl.slideUp();
  })
  win.Popup = Popup
})(window, jQuery);