document.addEventListener("DOMContentLoaded", () => {
	// אתחול EmailJS
	if (typeof emailjs !== "undefined") {
		emailjs.init("UUIbWCb6poCc1FUaD");
		console.log("EmailJS initialized");
	} else {
		console.error("EmailJS לא נטען כראוי");
	}

	// אתחול WOW
	if (typeof WOW !== "undefined") {
		new WOW().init();
		console.log("WOW initialized");
	} else {
		console.error("WOW לא נטען כראוי");
	}

	// Hamburger Menu
	const hamburger = document.querySelector('.hamburger');
	const mobileWrap = document.querySelector('.header-mobile-wrap');

	if (hamburger && mobileWrap) {
		hamburger.addEventListener('click', () => {
			hamburger.classList.toggle('is-active');
			document.body.classList.toggle('menu-open');
			mobileWrap.classList.toggle('active');
			console.log("Hamburger menu toggled");
		});
	} else {
		console.error("Hamburger או header-mobile-wrap לא נמצאו");
	}

	// פונקציה לאנימציית המספרים
	function animateCounter(element, targetValue, duration) {
		$({ count: 0 }).animate(
			{ count: targetValue },
			{
				duration: duration,
				easing: 'linear',
				step: function () {
					$(element).text(Math.floor(this.count));
				},
				complete: function () {
					$(element).text(targetValue);
				},
			}
		);
	}

	// בדיקה אם האלמנט בתצוגה
	function isElementInViewport(elem) {
		const rect = elem.getBoundingClientRect();
		return (
			rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
			rect.bottom > 0
		);
	}

	// הפעלת פונקציית המספרים כאשר האלמנט נכנס לתצוגה
	let isCounterAnimated = false; // דגל למניעת הפעלה כפולה
	function handleScrollEvents() {
		// טיפול ב-Header
		const headerTopHeight = $('.header-top').height();
		if ($(window).scrollTop() > headerTopHeight) {
			$('.header-bottom').addClass('is-fixed');
		} else {
			$('.header-bottom').removeClass('is-fixed');
		}

		// הצגת "חץ למעלה"
		if ($(window).scrollTop() > 1500) {
			$('.go-up').addClass('is-active');
		} else {
			$('.go-up').removeClass('is-active');
		}

		// הפעלת המספרים
		if (!isCounterAnimated && isElementInViewport($('.num-scroll')[0])) {
			isCounterAnimated = true;
			$('.num-js').each(function () {
				const targetValue = parseInt($(this).data('count'));
				animateCounter(this, targetValue, 2000);
			});
		}
	}

	// זיהוי מובייל והפעלת אנימציה באופן ידני
	if (window.innerWidth <= 768) { // מוגדר למובייל
		$('.num-js').each(function () {
			const targetValue = parseInt($(this).data('count'));
			animateCounter(this, targetValue, 2000);
		});
		isCounterAnimated = true; // למנוע הפעלה כפולה
	}

	// אירועי גלילה ושינוי גודל
	let isScrolling = false;
	function throttleScrollEvents() {
		if (!isScrolling) {
			isScrolling = true;
			setTimeout(() => {
				handleScrollEvents();
				isScrolling = false;
			}, 200);
		}
	}
	$(window).on('scroll resize', throttleScrollEvents);

	// Smooth Scroll
	$('.anchor-link').on('click', function (e) {
		e.preventDefault();
		const target = $(this).attr('href');
		const targetElement = $(target);

		if (targetElement.length) {
			$('html, body').animate({ scrollTop: targetElement.offset().top }, 700);
			mobileWrap.style.display = 'none';
			hamburger.classList.remove('is-active');
		} else {
			console.warn(`Element ${target} לא נמצא`);
		}
	});

	$('.go-up').on('click', (e) => {
		e.preventDefault();
		$('html, body').animate({ scrollTop: 0 }, 700);
	});

	// Swiper Initialization
	const bannerSwiper = new Swiper('.banner-swiper', {
		speed: 1000,
		spaceBetween: 0,
		autoHeight: true,
		navigation: {
			nextEl: '.banner-swiper .swiper-button-next',
			prevEl: '.banner-swiper .swiper-button-prev',
		},
		pagination: {
			el: '.banner-swiper .swiper-pagination',
			clickable: true,
		},
	});

	const reviewsSwiper = new Swiper('.reviews-swiper', {
		speed: 1000,
		spaceBetween: 20,
		pagination: {
			el: '.reviews-swiper .swiper-pagination',
			clickable: true,
		},
		breakpoints: {
			320: { slidesPerView: 1 },
			575: { slidesPerView: 2 },
			992: { slidesPerView: 3 },
		},
	});

	// Magnific Popup for Services
	$('.services-btn').magnificPopup({
		type: 'inline',
		showCloseBtn: false,
		removalDelay: 500,
		callbacks: {
			beforeOpen: function () {
				this.st.mainClass = this.st.el.attr('data-effect');
			},
		},
	});

	$('.modal-form-close').on('click', () => $.magnificPopup.close());

	// Magnific Popup for Gallery
	$('.gallery-wrap a').magnificPopup({
		type: 'image',
		gallery: { enabled: true },
		callbacks: {
			beforeOpen: function () {
				this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
				this.st.mainClass = this.st.el.attr('data-effect');
			},
		},
	});

	// Email Form Submission
	function setupEmailForm(formId, serviceId, templateId) {
		const form = document.getElementById(formId);
		if (!form) {
			console.error(`Form with ID ${formId} לא נמצא`);
			return;
		}
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			const formData = {
				to_name: "Ben Garage Door Services",
				from_name: form.querySelector('[id^="name"]').value,
				reply_to: form.querySelector('[id^="email"]').value,
				phone: form.querySelector('[id^="phone"]').value,
				message: form.querySelector('[id^="message"]').value,
			};

			emailjs.send(serviceId, templateId, formData)
				.then(() => {
					showToast("Your message has been sent successfully!");
					form.reset();
				})
				.catch((error) => {
					console.error("Failed to send email:", error);
					showToast("Failed to send your message. Please try again later.", true);
				});
		});
	}

	// Toast Function
	function showToast(message, isError = false) {
		const toast = document.getElementById('toast');
		if (!toast) {
			console.error("Toast element לא נמצא");
			return;
		}
		toast.textContent = message;
		toast.style.backgroundColor = isError ? "#dc3545" : "#28a745";
		toast.classList.remove('hidden');
		toast.classList.add('visible');

		setTimeout(() => {
			toast.classList.remove('visible');
			toast.classList.add('hidden');
		}, 3000);
	}

	// Email Form Setup
	setupEmailForm('emailForm', "service_8n1rod7", "template_czwhfke");
	setupEmailForm('emailForm1', "service_8n1rod7", "template_czwhfke");

	// הפעלה ראשונית
	handleScrollEvents();
});

if (typeof jQuery === "undefined") {
	console.error("jQuery לא נטען כראוי");
} else {
	console.log("jQuery נטען בהצלחה");
}
