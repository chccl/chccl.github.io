document.addEventListener('DOMContentLoaded', function() {
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

  // 获取元素
  const contactBtn = document.getElementById('contact-btn');
  const modalOverlay = document.getElementById('contactModalOverlay');
  const modalClose = document.querySelector('.contact-modal-close');
  const qrcodeOverlay = document.getElementById('qrcodeOverlay');
  
  // 点击联系按钮显示模态框
  if (contactBtn) {
    contactBtn.addEventListener('click', function() {
      modalOverlay.style.display = 'flex';
      // 添加简单的淡入效果
      setTimeout(() => {
        modalOverlay.style.opacity = '1';
      }, 10);
    });
  }

  // 点击关闭按钮隐藏模态框
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // 点击模态框外部区域关闭模态框
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // 添加二维码点击放大功能
  const qrcodes = document.querySelectorAll('.contact-qrcode');
  qrcodes.forEach(qrcode => {
    qrcode.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      
      // 创建二维码克隆
      const qrClone = this.cloneNode(true);
      qrClone.classList.add('enlarged');
      
      // 清空遮罩层并添加克隆的二维码
      qrcodeOverlay.innerHTML = '';
      qrcodeOverlay.appendChild(qrClone);
      qrcodeOverlay.classList.add('active');
    });
  });

  // 点击遮罩层关闭放大的二维码
  qrcodeOverlay.addEventListener('click', function() {
    this.classList.remove('active');
    setTimeout(() => {
      this.innerHTML = '';
    }, 300);
  });

  // 关闭模态框函数
  function closeModal() {
    // 确保关闭所有放大的二维码
    qrcodeOverlay.classList.remove('active');
    modalOverlay.style.opacity = '0';
    setTimeout(() => {
      modalOverlay.style.display = 'none';
      qrcodeOverlay.innerHTML = '';
    }, 300); // 与CSS过渡时间匹配
  }

  // 添加键盘事件监听，按ESC键关闭模态框
  document.addEventListener('keydown', function(e) {
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
  });
});