var userAnswerArr = [];
$(function () {
  /**
   * 进度说明
   * 0： 未开始
   * 1： 问答结束，显示抽奖
   * 2： 抽奖结束，显示分享
   * 3： 分享结束，显示提交地址
   * 4： 提交地址结束，显示发货信息
   */
  // 评论列表
  Init.userComment();

  var gameProgress = Init.getGameProgress();
  switch (gameProgress) {
    case 0:
      // 抽奖头部描述
      Init.contentHeader();
      // 问答区
      Init.contentQuestion();
      break;
    case 1:
      // 抽奖区
      Init.initGift();
      break;
    case 2:
      // 分享区
      Init.initMain();
      break;
    case 3:
      // 提交区
      Init.initSubmit();
      break;
      case 4:
        // 等待区
        Init.initOver();
        break;
    default:
      break;
  }
  
  $('.sign').click(function() {
    localStorage.clear();
    Toast.show('清空成功，测试用');
    location.reload();
  })
  
	   $('.tijiao').click(function() {
 
         localStorage.setItem('game-progress', 3);
    window.location.reload();
  })
})