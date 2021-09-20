(function (win) {
  function panelItem() {
    return (`
    <div class="panel-item">
      <div class="panel-info flex">
        <div class="info-avatar">
          <img src="{{ avatarUrl }}">
        </div>
        <div class="info-content">
          <p class="info-username">{{ username }}</p>
          <p class="info-message">{{ content }}</p>
        </div>
      </div>
      <div class="panel-desc">
        <span>喜欢 · 评论</span>
        <img src="assets/img/like.png" >
        <span>{{ nums }} · </span>
        <span>{{ time }}</span>
      </div>
    </div>
    `)
  }

  function contentHeader(type) {
    switch (type) {
      case 'title':
        return (`
          <h3>{{ content }}</h3>
        `)
        break;
      case 'text':
        return (`
          <p>{{ content }}</p>
        `)
        break;
      default:
        return (``)
        break;
    }
  }

  function questionHeader() {
    return (`
    <div class="question-header">
      <span class="header-tip">{{ tip }}</span>
      <span class="header-subject">{{ title }}</span>
    </div>
  `)
  }

  function surveyBtn() {
    return `<div class="survey-btn" data-bq="{{ id }}">{{ content }}</div>`
  }

  function verifyContent(type) {
    switch (type) {
      case 'header':
        return (`
        <div class="verify-header">{{ content }}</div>
        <div class="spinner-border"></div>
        `)
        break;
      case 'text':
        return (`
          <p class="result-item">{{ content }}</p>
        `)
        break;
      default:
        return (``)
        break;
    }
  }

  function giftItem(i) {
    return (`
    <div class="gift-boxs-item count${i}">
      <img class="opcity" src="./open.png">
      <div class="box-ct">
        <img src="./open.png">
      </div>
      <div class="box-zt">
        <!--img src="./b1.png"-->
      </div>
 
    </div>
    `)
  }

  function popupSuccess(type) {
    switch (type) {
      case 'header':
        return (`
        <p class="popup-header">{{ content }}</p>
        `)
        break;
      case 'img':
        return (`
        <img src="{{ content }}" alt="">
        `)
        break;
      case 'text':
        return (`
        <p class="popup-text">{{ content }}</p>
        `)
        break;
      case 'textInterval':
        return (`
        <p class="popup-text interval">{{ content }}</p>
        `)
        break;
      default:
        return (``)
        break;
    }
  }

  function mainContent(type) {
    switch (type) {
      case 'mainInfo':
        return (`
        <div class="main">
          <div class="main-header">{{ title }}</div>
          <div class="main-img">
            <img src="{{ img }}" alt="">
          </div>
          <div class="main-desc">{{desc}}</div>
        </div>
        `)
        break;
      case 'footerInfo':
        return (`
        <div class="main-footer">
          <p class="share-desc">{{ desc }}</p>
          <div class="main-share-btns"></div>
          <p class="progress-tip">{{ progressTip }}</p>
          <div class="progress" data-num="{{ progressNum }}">
            <div class="progress-bar"></div>
          </div>
          <div class="receice-btn">{{ receiceBtnText }}</div>
        </div>
        `)
        break;
      case 'mainTip':
        return (`
        <p class="main-tip">{{ content }}</p>
        `)
        break;
      case 'textInterval':
        return (`
        <p class="popup-text interval">{{ content }}</p>
        `)
        break;
      default:
        return (``)
        break;
    }
  }

  function submitItem(type) {
    if(type === 'button') {
      return (`
      <div class="input-btn">{{ labelText }}</div>
      `)
    }else {
      return (`
        <div class="input-item">
          <label for="{{ submitName }}">{{ labelText }}:</label>
          <input name="{{ submitName }}" id="{{ submitName }}" type="{{ type }}">
        </div>
        `)
    }
  }

  win.tpl = {
    panelItem: panelItem,
    contentHeader: contentHeader,
    surveyBtn: surveyBtn,
    questionHeader: questionHeader,
    verifyContent: verifyContent,
    giftItem: giftItem,
    popupSuccess: popupSuccess,
    mainContent: mainContent,
    submitItem: submitItem
  }
})(window);