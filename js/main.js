/* ========================================
   互上22AILab 官网交互脚本
   ======================================== */

(function () {
    'use strict';

    /* ===== Header Scroll Effect ===== */
    var header = document.getElementById('header');
    var backToTop = document.getElementById('backToTop');

    function onScroll() {
        var scrolled = window.pageYOffset > 60;
        header.classList.toggle('scrolled', scrolled);
        backToTop.classList.toggle('show', window.pageYOffset > 500);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== Mobile Menu Toggle ===== */
    var menuToggle = document.getElementById('menuToggle');
    var nav = document.getElementById('nav');

    menuToggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when nav link is clicked
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (nav.classList.contains('open') &&
            !nav.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    /* ===== Smooth Scroll with Header Offset ===== */
    // CSS scroll-behavior: smooth handles this, but we add offset support
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var headerHeight = header.offsetHeight;
            var targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        });
    });

    /* ===== Active Nav Link on Scroll ===== */
    var sections = document.querySelectorAll('section[id]');
    var navLinkMap = {};
    navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            navLinkMap[href.substring(1)] = link;
        }
    });

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 120;
        var currentId = '';
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.id;
            }
        });
        // Default to first section
        if (!currentId && scrollPos < sections[0].offsetTop) {
            currentId = sections[0].id;
        }
        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });
        if (currentId && navLinkMap[currentId]) {
            navLinkMap[currentId].classList.add('active');
        }
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    /* ===== Reveal on Scroll ===== */
    var revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ===== Number Counter Animation ===== */
    var counters = document.querySelectorAll('.stat-num[data-count]');
    var counterTriggered = false;

    function animateCounters() {
        if (counterTriggered) return;
        var aboutSection = document.getElementById('about');
        if (!aboutSection) return;
        var rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7) {
            counterTriggered = true;
            counters.forEach(function (counter) {
                var target = parseInt(counter.getAttribute('data-count'), 10);
                var duration = 1500;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    // Easing: easeOutQuart
                    var eased = 1 - Math.pow(1 - progress, 4);
                    counter.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counter.textContent = target;
                    }
                }
                requestAnimationFrame(step);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

    /* ===== Hero Particles ===== */
    var particleContainer = document.getElementById('particles');
    if (particleContainer && window.innerWidth > 768) {
        var particleCount = 30;
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('span');
            particle.className = 'particle';
            var size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = (Math.random() * 0.5 + 0.2).toString();
            fragment.appendChild(particle);
        }
        particleContainer.appendChild(fragment);
    }

    /* ===== Contact Form ===== */
    var contactForm = document.getElementById('contactForm');
    var formNote = document.getElementById('formNote');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('formName').value.trim();
            var phone = document.getElementById('formPhone').value.trim();
            var email = document.getElementById('formEmail').value.trim();
            var message = document.getElementById('formMsg').value.trim();

            // Basic validation
            if (!name || !phone || !message) {
                showFormNote('请填写必填项（姓名、电话、留言内容）', 'error');
                return;
            }

            // Phone validation (Chinese mobile)
            var phonePattern = /^1[3-9]\d{9}$/;
            if (!phonePattern.test(phone)) {
                showFormNote('请输入有效的手机号码', 'error');
                return;
            }

            // Email validation (optional field)
            if (email) {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email)) {
                    showFormNote('请输入有效的邮箱地址', 'error');
                    return;
                }
            }

            // Simulate submission
            // In production, replace this with actual API call or form backend
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            setTimeout(function () {
                showFormNote('留言提交成功！我们会尽快与您联系。', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    function showFormNote(msg, type) {
        formNote.textContent = msg;
        formNote.className = 'form-note ' + type;
        formNote.style.display = 'block';
        // Auto-hide after 4 seconds
        clearTimeout(showFormNote.timer);
        showFormNote.timer = setTimeout(function () {
            formNote.style.display = 'none';
        }, 4000);
    }

    /* ===== Back to Top ===== */
    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

})();
