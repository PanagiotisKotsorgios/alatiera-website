const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const progress = document.querySelector('.scroll-progress');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateScrollState = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.setProperty('--progress', `${percent}%`);
    header.classList.toggle('is-scrolled', window.scrollY > 18);
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const setNavOpen = (isOpen) => {
    nav.classList.toggle('is-open', isOpen);
    navToggle?.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('is-locked', isOpen);
};

navToggle?.addEventListener('click', () => {
    setNavOpen(!nav.classList.contains('is-open'));
});

nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        setNavOpen(false);
    });
});

if (!reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
} else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('[data-filter]');
const menuCards = document.querySelectorAll('[data-category]');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
        menuCards.forEach((card) => {
            const visible = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('is-hidden', !visible);
        });
    });
});

const mediaFilterButtons = document.querySelectorAll('[data-media-filter]');
const mediaItems = document.querySelectorAll('[data-media-item]');

mediaFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.mediaFilter;
        mediaFilterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
        mediaItems.forEach((item) => {
            const visible = filter === 'all' || item.dataset.mediaItem === filter;
            item.classList.toggle('is-hidden', !visible);
        });
    });
});

const moodToggle = document.querySelector('[data-mood-toggle]');
const moodStage = document.querySelector('[data-mood-stage]');
const moodLabel = document.querySelector('[data-mood-label]');

moodToggle?.addEventListener('click', () => {
    const isNight = moodStage.dataset.moodStage === 'night';
    moodStage.dataset.moodStage = isNight ? 'day' : 'night';
    moodToggle.setAttribute('aria-pressed', String(!isNight));
    moodToggle.querySelector('b').textContent = isNight ? 'Προβολή νύχτας' : 'Προβολή ημέρας';
    moodLabel.textContent = isNight ? 'Ημέρα στη βεράντα' : 'Νύχτα στη βεράντα';
});

const reservationDialog = document.querySelector('[data-reservation-dialog]');

document.querySelectorAll('[data-open-reservation]').forEach((button) => {
    button.addEventListener('click', () => {
        if (typeof reservationDialog.showModal === 'function') {
            reservationDialog.showModal();
        }
    });
});

reservationDialog?.addEventListener('close', () => {
    reservationDialog.querySelector('form')?.reset();
});

const lightbox = document.querySelector('[data-lightbox-panel]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxTitle = document.querySelector('[data-lightbox-title]');
const closeLightbox = document.querySelector('[data-lightbox-close]');

if (lightbox && lightboxImage && lightboxTitle) {
    document.querySelectorAll('[data-lightbox]').forEach((item) => {
        item.addEventListener('click', () => {
            lightboxImage.src = item.dataset.lightbox;
            lightboxImage.alt = item.dataset.title;
            lightboxTitle.textContent = item.dataset.title;
            lightbox.hidden = false;
            document.body.classList.add('is-locked');
        });
    });
}

const hideLightbox = () => {
    if (!lightbox || !lightboxImage) {
        return;
    }

    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.classList.remove('is-locked');
};

closeLightbox?.addEventListener('click', hideLightbox);
lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        hideLightbox();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
        setNavOpen(false);
    }

    if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
        hideLightbox();
    }
});
