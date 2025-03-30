document.addEventListener('DOMContentLoaded', function() {
  // 创建Google翻译元素和语言选择框
  createTranslateElements();
  
  // 为翻译按钮添加点击事件
  addTranslateButtonEvent();
});

// 页面加载完成后初始化
window.addEventListener('pjax:complete', function() {
  // 为新加载的页面重新添加翻译按钮事件
  addTranslateButtonEvent();
});

function createTranslateElements() {
  // 添加Google翻译元素（隐藏）
  if (!document.getElementById('google_translate_element')) {
    const translateElement = document.createElement('div');
    translateElement.id = 'google_translate_element';
    translateElement.style.display = 'none';
    document.body.appendChild(translateElement);
  }
  
  // 添加自定义语言选择框
  if (!document.querySelector('.custom-language-select')) {
    const languageSelect = document.createElement('div');
    languageSelect.className = 'custom-language-select';
    languageSelect.style.display = 'none';
    
    languageSelect.innerHTML = `
      <div class="language-title">选择语言 / Select Language</div>
      <div class="language-options">
        <div class="language-option" data-lang="km">
          <span class="language-icon">KH</span>
          <span class="language-name">ភាសាខ្មែរ (高棉语)</span>
        </div>
        <div class="language-option" data-lang="ru">
          <span class="language-icon">RU</span>
          <span class="language-name">Русский (俄语)</span>
        </div>
        <div class="language-option" data-lang="zh-CN">
          <span class="language-icon">CN</span>
          <span class="language-name">简体中文</span>
        </div>
        <div class="language-option" data-lang="zh-TW">
          <span class="language-icon">TW</span>
          <span class="language-name">繁體中文</span>
        </div>
        <div class="language-option" data-lang="en">
          <span class="language-icon">EN</span>
          <span class="language-name">English</span>
        </div>
        <div class="language-option" data-lang="ja">
          <span class="language-icon">JP</span>
          <span class="language-name">日本語</span>
        </div>
        <div class="language-option" data-lang="fr">
          <span class="language-icon">FR</span>
          <span class="language-name">Français</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(languageSelect);
    
    // 添加语言选项点击事件
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(function(option) {
      option.addEventListener('click', function() {
        const langCode = this.getAttribute('data-lang');
        translateTo(langCode);
      });
    });
  }
  
  // 添加样式
  addStylesheet();
}

function addTranslateButtonEvent() {
  const translateBtn = document.getElementById('google-translate-btn');
  if (translateBtn) {
    translateBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      
      const languageSelect = document.querySelector('.custom-language-select');
      
      // 如果选择框已显示，则隐藏
      if (languageSelect.classList.contains('show')) {
        languageSelect.classList.remove('show');
        setTimeout(function() {
          languageSelect.style.display = 'none';
        }, 300);
        return;
      }
      
      // 显示语言选择框
      languageSelect.style.display = 'block';
      setTimeout(function() {
        languageSelect.classList.add('show');
      }, 10);
      
      // 初始化翻译API (提前加载以减少用户等待时间)
      initGoogleTranslateAPI();
    });
  }
  
  // 点击页面其他区域关闭语言选择框
  document.addEventListener('click', function(e) {
    const languageSelect = document.querySelector('.custom-language-select');
    const translateButton = document.getElementById('google-translate-btn');
    
    if (languageSelect && languageSelect.style.display !== 'none' && 
        !languageSelect.contains(e.target) && 
        e.target !== translateButton && 
        !translateButton.contains(e.target)) {
      
      languageSelect.classList.remove('show');
      setTimeout(function() {
        languageSelect.style.display = 'none';
      }, 300);
    }
  });
}

// 加载Google翻译API
function googleTranslateElementInit() {
  // 先移除可能存在的加载指示器
  if (document.getElementById('translation-loading')) {
    document.body.removeChild(document.getElementById('translation-loading'));
  }
  
  try {
    new google.translate.TranslateElement({
      pageLanguage: 'zh-CN',
      includedLanguages: 'en,zh-CN,zh-TW,ja,fr,km,ru',
      autoDisplay: false
    }, 'google_translate_element');
  } catch (e) {
    console.error('Google翻译初始化失败:', e);
    if (document.getElementById('translation-loading')) {
      document.getElementById('translation-loading').textContent = '翻译加载失败，请重试';
      setTimeout(function() {
        if (document.getElementById('translation-loading')) {
          document.body.removeChild(document.getElementById('translation-loading'));
        }
      }, 2000);
    }
  }
}

// 初始化Google翻译API
function initGoogleTranslateAPI(callback) {
  if (typeof google !== 'undefined' && typeof google.translate !== 'undefined') {
    callback && callback();
    return;
  }
  
  // 显示加载指示器
  var loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'translation-loading';
  loadingIndicator.textContent = '翻译加载中...';
  loadingIndicator.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:white;padding:10px 20px;border-radius:5px;z-index:10002;';
  document.body.appendChild(loadingIndicator);
  
  // 加载翻译API
  var script = document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.onerror = function() {
    if (document.getElementById('translation-loading')) {
      document.getElementById('translation-loading').textContent = '翻译加载失败，请重试';
      setTimeout(function() {
        if (document.getElementById('translation-loading')) {
          document.body.removeChild(document.getElementById('translation-loading'));
        }
      }, 2000);
    }
  };
  
  script.onload = function() {
    setTimeout(function() {
      callback && callback();
    }, 1000);
  };
  
  document.body.appendChild(script);
}

// 翻译到特定语言
function translateTo(langCode) {
  initGoogleTranslateAPI(function() {
    // 使用Google翻译API切换语言
    var control = document.querySelector('.goog-te-combo');
    if (control) {
      control.value = langCode;
      control.dispatchEvent(new Event('change'));
      
      // 隐藏语言选择框
      document.querySelector('.custom-language-select').classList.remove('show');
      setTimeout(function() {
        document.querySelector('.custom-language-select').style.display = 'none';
      }, 300);
      
      // 隐藏Google翻译横幅
      hideGoogleTranslateBanner();
    }
  });
}

// 隐藏Google翻译横幅
function hideGoogleTranslateBanner() {
  // 尝试多种方法隐藏横幅
  var bannerFrames = document.querySelectorAll('.goog-te-banner-frame, .skiptranslate, iframe[id=":1.container"]');
  bannerFrames.forEach(function(frame) {
    frame.style.display = 'none';
    frame.style.visibility = 'hidden';
  });
  
  // 重置body样式
  document.body.style.top = '0px';
  document.body.style.position = 'static';
  
  // 添加CSS规则
  if (!document.getElementById('google-translate-style')) {
    const style = document.createElement('style');
    style.id = 'google-translate-style';
    style.textContent = `
      .goog-te-banner-frame, 
      .skiptranslate, 
      iframe[id=":1.container"] {
        display: none !important;
        visibility: hidden !important;
      }
      body {
        top: 0 !important;
        position: static !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// 在页面加载完成后执行一次
document.addEventListener('DOMContentLoaded', hideGoogleTranslateBanner);
// 也可以定期检查并隐藏
setInterval(hideGoogleTranslateBanner, 1000);

// 添加样式
function addStylesheet() {
  if (!document.getElementById('custom-translate-style')) {
    const style = document.createElement('style');
    style.id = 'custom-translate-style';
    style.textContent = `
      /* 自定义语言选择框样式 */
      .custom-language-select {
        position: fixed;
        bottom: 140px;
        right: 70px;
        width: 220px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        overflow: hidden;
        transform: translateY(20px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      .custom-language-select.show {
        transform: translateY(0);
        opacity: 1;
      }

      .language-title {
        padding: 15px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #f0f0f0;
      }

      .language-options {
        max-height: 320px;
        overflow-y: auto;
        padding: 10px 0;
      }

      .language-option {
        padding: 12px 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .language-option:hover {
        background-color: #f5f8ff;
      }

      .language-icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-right: 15px;
        font-size: 12px;
        font-weight: bold;
        color: white;
        background-color: #3b82f6;
        border-radius: 50%;
      }

      .language-name {
        font-size: 14px;
        color: #333;
      }

      /* 翻译加载中提示样式 */
      #translation-loading {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10002;
      }
      
      /* 使图标居中显示 */
      #google-translate-btn i {
        font-size: 1em;
      }

      /* 适配暗色模式 */
      [data-theme="dark"] .custom-language-select {
        background: #1a1a1a;
        box-shadow: 0 5px 30px rgba(0,0,0,0.5);
      }

      [data-theme="dark"] .language-title {
        color: #e0e0e0;
        border-bottom: 1px solid #333;
      }

      [data-theme="dark"] .language-option:hover {
        background-color: #2a2a2a;
      }

      [data-theme="dark"] .language-name {
        color: #e0e0e0;
      }
    `;
    document.head.appendChild(style);
  }
} 