// 初始化联系模态框
function initContactModal() {
  // 检查是否已存在模态框
  if (document.getElementById('contactModalOverlay')) {
    return;
  }

  // 创建模态框结构
  const modalHTML = `
    <div class="contact-modal-overlay" id="contactModalOverlay">
      <div class="contact-modal">
        <div class="contact-modal-header">
          <h3 class="contact-modal-title">在线联系方式</h3>
          <button class="contact-modal-close">&times;</button>
        </div>
        <div class="contact-modal-body">
          <div class="contact-item">
            <img src="/img/contact/qq.jpg" alt="QQ二维码" class="contact-qrcode" />
            <a href="tencent://message/?uin=123456789" class="contact-name">QQ联系</a>
          </div>
          <div class="contact-item">
            <img src="/img/contact/wechat.jpg" alt="微信二维码" class="contact-qrcode" />
            <a href="weixin://" class="contact-name">微信联系</a>
          </div>
          <div class="contact-item">
            <img src="/img/contact/tg.jpg" alt="Telegram二维码" class="contact-qrcode" />
            <a href="https://t.me/your_username" class="contact-name">TG联系</a>
          </div>
          <!-- 可以在这里添加更多的联系方式，每行显示3个，不足3个时左对齐 -->
          <!-- 
          <div class="contact-item">
            <img src="/img/contact/new_qrcode.jpg" alt="新二维码" class="contact-qrcode" />
            <a href="#" class="contact-name">新联系方式</a>
          </div>
          -->
          <div class="contact-phone">
            <a href="tel:13883180899"><i class="fas fa-phone"></i>138-8318-0899 (销售)</a>
            <a href="tel:13883180899"><i class="fas fa-phone"></i>138-8318-0899 (技术)</a>
            <a href="tel:13883180899"><i class="fas fa-phone"></i>138-8318-0899 (客服)</a>
            <a href="tel:13883180899"><i class="fas fa-phone"></i>138-8318-0899 (售后)</a>
            <a href="tel:13883180899"><i class="fas fa-phone"></i>138-8318-0899 (投诉)</a>
          </div>
        </div>
      </div>
    </div>
    <div class="qrcode-overlay" id="qrcodeOverlay"></div>
  `;

  // 将模态框添加到body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 绑定联系模态框事件
function bindContactModalEvents() {
  // 获取元素
  const contactBtn = document.getElementById('contact-btn');
  const modalOverlay = document.getElementById('contactModalOverlay');
  const modalClose = document.querySelector('.contact-modal-close');
  const qrcodeOverlay = document.getElementById('qrcodeOverlay');
  
  if (!contactBtn || !modalOverlay || !modalClose || !qrcodeOverlay) {
    return;
  }
  
  // 防止重复绑定事件
  contactBtn.removeEventListener('click', showModal);
  contactBtn.addEventListener('click', showModal);
  
  // 点击联系按钮显示模态框
  function showModal() {
    modalOverlay.style.display = 'flex';
    // 添加简单的淡入效果
    setTimeout(() => {
      modalOverlay.style.opacity = '1';
    }, 10);
  }

  // 点击关闭按钮隐藏模态框
  modalClose.removeEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  // 点击模态框外部区域关闭模态框
  modalOverlay.removeEventListener('click', handleModalOverlayClick);
  modalOverlay.addEventListener('click', handleModalOverlayClick);
  
  function handleModalOverlayClick(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  }

  // 添加二维码点击放大功能
  const qrcodes = document.querySelectorAll('.contact-qrcode');
  qrcodes.forEach(qrcode => {
    qrcode.removeEventListener('click', handleQRCodeClick);
    qrcode.addEventListener('click', handleQRCodeClick);
  });
  
  function handleQRCodeClick(e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    // 创建二维码克隆
    const qrClone = this.cloneNode(true);
    qrClone.classList.add('enlarged');
    
    // 清空遮罩层并添加克隆的二维码
    qrcodeOverlay.innerHTML = '';
    qrcodeOverlay.appendChild(qrClone);
    qrcodeOverlay.classList.add('active');
  }

  // 点击遮罩层关闭放大的二维码
  qrcodeOverlay.removeEventListener('click', handleQRCodeOverlayClick);
  qrcodeOverlay.addEventListener('click', handleQRCodeOverlayClick);
  
  function handleQRCodeOverlayClick() {
    this.classList.remove('active');
    setTimeout(() => {
      this.innerHTML = '';
    }, 300);
  }

  // 添加键盘事件监听，按ESC键关闭模态框
  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);
  
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      if (qrcodeOverlay.classList.contains('active')) {
        qrcodeOverlay.classList.remove('active');
        setTimeout(() => {
          qrcodeOverlay.innerHTML = '';
        }, 300);
      } else if (modalOverlay.style.display === 'flex') {
        closeModal();
      }
    }
  }
}

// 关闭模态框函数
function closeModal() {
  const modalOverlay = document.getElementById('contactModalOverlay');
  const qrcodeOverlay = document.getElementById('qrcodeOverlay');
  
  if (!modalOverlay || !qrcodeOverlay) return;
  
  // 确保关闭所有放大的二维码
  qrcodeOverlay.classList.remove('active');
  modalOverlay.style.opacity = '0';
  setTimeout(() => {
    modalOverlay.style.display = 'none';
    qrcodeOverlay.innerHTML = '';
  }, 300); // 与CSS过渡时间匹配
}

// 初始化函数
function initContactFeature() {
  initContactModal();
  bindContactModalEvents();
}

// 页面加载完成时初始化
document.addEventListener('DOMContentLoaded', initContactFeature);

// 支持pjax页面切换
document.addEventListener('pjax:complete', initContactFeature);

// 监听主题切换以处理深色模式
window.addEventListener('themeChange', function() {
  // 重新绑定事件确保模态框在主题切换后正常工作
  bindContactModalEvents();
});