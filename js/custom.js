// ========= Hexo Next 主题增强功能 JavaScript =========

document.addEventListener('DOMContentLoaded', function() {
  
  // ========= 阅读进度条 =========
  function createReadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackLength = docHeight - winHeight;
      const pctScrolled = Math.floor(scrollTop / trackLength * 100);
      
      progressBar.style.width = pctScrolled + '%';
    });
  }
  
  // ========= 回到顶部按钮 =========
  function createBackToTop() {
    // 创建按钮元素
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(backToTopBtn);
    
    // 监听滚动显示/隐藏按钮
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // 点击回到顶部
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ========= 卡片展开功能 =========
  function initCardExpansion() {
    document.querySelectorAll('.post-card').forEach(function(card) {
      // 为卡片添加键盘支持
      card.setAttribute('tabindex', '0');
      
      // 点击展开/收起
      card.addEventListener('click', function(e) {
        // 避免点击链接时触发
        if (e.target.tagName === 'A') return;
        
        this.classList.toggle('expanded');
      });
      
      // 键盘支持 (Enter 键)
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          this.classList.toggle('expanded');
        }
      });
    });
  }
  
  // ========= 代码块复制功能 =========
  function initCodeCopy() {
    document.querySelectorAll('pre').forEach(function(pre) {
      // 创建复制按钮
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = '复制';
      copyBtn.setAttribute('aria-label', '复制代码');
      
      // 添加按钮到代码块
      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
      
      // 复制功能
      copyBtn.addEventListener('click', function() {
        const code = pre.querySelector('code') || pre;
        const text = code.textContent;
        
        navigator.clipboard.writeText(text).then(function() {
          copyBtn.textContent = '已复制!';
          copyBtn.style.background = 'rgba(125, 216, 125, 0.3)';
          copyBtn.style.color = '#7dd87d';
          
          setTimeout(function() {
            copyBtn.textContent = '复制';
            copyBtn.style.background = 'rgba(107, 163, 245, 0.2)';
            copyBtn.style.color = '#6ba3f5';
          }, 2000);
        }).catch(function() {
          // 降级方案
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          copyBtn.textContent = '已复制!';
          setTimeout(function() {
            copyBtn.textContent = '复制';
          }, 2000);
        });
      });
    });
  }
  
  // ========= 图片灯箱效果 =========
  function initImageLightbox() {
    const images = document.querySelectorAll('.post-body img');
    
    images.forEach(function(img) {
      img.style.cursor = 'zoom-in';
      
      img.addEventListener('click', function() {
        createLightbox(this.src, this.alt);
      });
    });
    
    function createLightbox(src, alt) {
      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: zoom-out;
      `;
      
      // 创建图片
      const lightboxImg = document.createElement('img');
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      `;
      
      overlay.appendChild(lightboxImg);
      document.body.appendChild(overlay);
      
      // 点击关闭
      overlay.addEventListener('click', function() {
        document.body.removeChild(overlay);
      });
      
      // ESC键关闭
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
        }
      });
    }
  }
  
  // ========= 文章目录 =========
  function initTableOfContents() {
    const headings = document.querySelectorAll('.post-body h1, .post-body h2, .post-body h3, .post-body h4');
    
    if (headings.length < 2) return; // 少于2个标题就不显示目录
    
    // 创建目录容器
    const tocContainer = document.createElement('div');
    tocContainer.className = 'post-toc';
    
    const tocList = document.createElement('ul');
    tocList.style.cssText = `
      list-style: none;
      padding: 0;
      margin: 0;
    `;
    
    // 生成目录项
    headings.forEach(function(heading, index) {
      const id = 'heading-' + index;
      heading.id = id;
      
      const tocItem = document.createElement('li');
      tocItem.className = 'toc-item';
      
      const tocLink = document.createElement('a');
      tocLink.href = '#' + id;
      tocLink.textContent = heading.textContent;
      tocLink.style.cssText = `
        display: block;
        padding: 5px 0;
        color: rgba(232, 234, 240, 0.7);
        text-decoration: none;
        font-size: 0.9em;
        transition: all 0.2s ease;
        padding-left: ${(parseInt(heading.tagName.charAt(1)) - 1) * 15}px;
      `;
      
      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);
      
      // 平滑滚动
      tocLink.addEventListener('click', function(e) {
        e.preventDefault();
        heading.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
    
    tocContainer.appendChild(tocList);
    document.body.appendChild(tocContainer);
    
    // 滚动时高亮当前章节
    let currentActiveIndex = 0;
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset;
      
      headings.forEach(function(heading, index) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentActiveIndex = index;
        }
      });
      
      // 更新活跃状态
      document.querySelectorAll('.toc-item').forEach(function(item, index) {
        if (index === currentActiveIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      
      // 显示/隐藏目录
      if (scrollTop > 300) {
        tocContainer.classList.add('visible');
      } else {
        tocContainer.classList.remove('visible');
      }
    });
  }
  
  // ========= 阅读时间估算 =========
  function addReadingTime() {
    document.querySelectorAll('.post-body').forEach(function(postBody) {
      const text = postBody.textContent;
      const wordsPerMinute = 200; // 中文大约每分钟200字
      const wordCount = text.length;
      const readingTime = Math.ceil(wordCount / wordsPerMinute);
      
      // 查找元信息容器
      const metaContainer = postBody.parentElement.querySelector('.post-meta');
      if (metaContainer) {
        const readingTimeElement = document.createElement('span');
        readingTimeElement.className = 'post-meta-item reading-time';
        readingTimeElement.textContent = `📖 ${readingTime} 分钟阅读`;
        metaContainer.appendChild(readingTimeElement);
      }
    });
  }
  
  // ========= 平滑加载动画 =========
  function initSmoothLoading() {
    const cards = document.querySelectorAll('.post-card, .post-block');
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });
    
    cards.forEach(function(card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }
  
  // ========= 初始化所有功能 =========
  createReadingProgress();
  createBackToTop();
  initCardExpansion();
  initCodeCopy();
  initImageLightbox();
  initTableOfContents();
  addReadingTime();
  initSmoothLoading();
  

});