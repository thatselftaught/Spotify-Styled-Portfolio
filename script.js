document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    const player = document.querySelector('.player');
    const playPauseButton = document.querySelector('.fa-play-circle');
    const volumeSlider = document.querySelector('.volume-slider');
    const prevButton = document.querySelector('.fa-step-backward');
    const nextButton = document.querySelector('.fa-step-forward');
    const volumeIcon = document.querySelector('.fa-volume-up');
    const playerControls = document.querySelector('.player-controls');
    const volumeControl = document.querySelector('.volume-control');
    let currentAudio = null;
    let isPlaying = false;
    let currentProjectId = null;

    // Project audio mapping
    const projectAudios = {
        'enterprise': document.getElementById('enterprise-audio'),
        'financial': document.getElementById('financial-audio'),
        'healthcare': document.getElementById('healthcare-audio')
    };

    // Handle view project button clicks
    document.addEventListener('click', (e) => {
        const viewProjectBtn = e.target.closest('.view-project');
        if (viewProjectBtn) {
            const projectCard = viewProjectBtn.closest('.project-card');
            const projectId = projectCard.dataset.project;
            currentProjectId = projectId;
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectDesc = projectCard.querySelector('p').textContent;
            const projectImage = projectCard.querySelector('img').src;

            // Stop current audio if playing
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Update player content
            document.querySelector('.now-playing img').src = projectImage;
            document.querySelector('.track-info h4').textContent = projectTitle;
            document.querySelector('.track-info p').textContent = projectDesc;

            // Show player
            player.classList.remove('hidden');
            player.classList.add('visible');
            mainContent.classList.add('player-visible');

            // Start playing new audio
            currentAudio = projectAudios[projectId];
            if (currentAudio) {
                currentAudio.play();
                playPauseButton.classList.remove('fa-play-circle');
                playPauseButton.classList.add('fa-pause-circle');
                isPlaying = true;
            }
        }
    });

    // Handle player click to open project details
    player.addEventListener('click', (e) => {
        // Don't navigate if clicking controls
        if (e.target.closest('.player-controls') || e.target.closest('.volume-control')) {
            return;
        }
        
        if (currentProjectId) {
            window.location.href = `project-details.html?id=${currentProjectId}`;
        }
    });

    // Handle play/pause
    playPauseButton.addEventListener('click', () => {
        if (!currentAudio) return;
        
        if (isPlaying) {
            currentAudio.pause();
            playPauseButton.classList.remove('fa-pause-circle');
            playPauseButton.classList.add('fa-play-circle');
        } else {
            currentAudio.play();
            playPauseButton.classList.remove('fa-play-circle');
            playPauseButton.classList.add('fa-pause-circle');
        }
        isPlaying = !isPlaying;
    });

    // Handle volume control
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const volume = (e.clientX - rect.left) / rect.width;
        volumeSlider.style.setProperty('--volume-level', `${volume * 100}%`);
        if (currentAudio) {
            currentAudio.volume = volume;
        }
    });

    // Handle volume mute/unmute
    let previousVolume = 1;
    volumeIcon.addEventListener('click', () => {
        if (!currentAudio) return;

        if (currentAudio.volume > 0) {
            previousVolume = currentAudio.volume;
            currentAudio.volume = 0;
            volumeSlider.style.setProperty('--volume-level', '0%');
            volumeIcon.classList.remove('fa-volume-up');
            volumeIcon.classList.add('fa-volume-mute');
        } else {
            currentAudio.volume = previousVolume;
            volumeSlider.style.setProperty('--volume-level', `${previousVolume * 100}%`);
            volumeIcon.classList.remove('fa-volume-mute');
            volumeIcon.classList.add('fa-volume-up');
        }
    });

    // Handle next/previous
    const projectIds = Object.keys(projectAudios);
    
    function playProject(projectId) {
        const projectCard = document.querySelector(`[data-project="${projectId}"]`);
        const projectTitle = projectCard.querySelector('h3').textContent;
        const projectDesc = projectCard.querySelector('p').textContent;
        const projectImage = projectCard.querySelector('img').src;

        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = projectAudios[projectId];
        document.querySelector('.now-playing img').src = projectImage;
        document.querySelector('.track-info h4').textContent = projectTitle;
        document.querySelector('.track-info p').textContent = projectDesc;

        currentAudio.play();
        playPauseButton.classList.remove('fa-play-circle');
        playPauseButton.classList.add('fa-pause-circle');
        isPlaying = true;
    }

    nextButton.addEventListener('click', () => {
        if (!currentAudio) return;
        const currentIndex = projectIds.indexOf(Object.keys(projectAudios).find(key => projectAudios[key] === currentAudio));
        const nextIndex = (currentIndex + 1) % projectIds.length;
        playProject(projectIds[nextIndex]);
    });

    prevButton.addEventListener('click', () => {
        if (!currentAudio) return;
        const currentIndex = projectIds.indexOf(Object.keys(projectAudios).find(key => projectAudios[key] === currentAudio));
        const prevIndex = (currentIndex - 1 + projectIds.length) % projectIds.length;
        playProject(projectIds[prevIndex]);
    });

    // Close player and stop audio with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !player.classList.contains('hidden')) {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            player.classList.remove('visible');
            player.classList.add('hidden');
            mainContent.classList.remove('player-visible');
            playPauseButton.classList.remove('fa-pause-circle');
            playPauseButton.classList.add('fa-play-circle');
            isPlaying = false;
        }
    });
});

// Project filtering functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Enhanced navbar functionality
const header = document.querySelector('.neubrutalism-header');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navMenu = document.querySelector('.nav-menu');
const progressBar = document.querySelector('.page-progress-bar');
const sections = document.querySelectorAll('section');

// Handle scroll events for sticky header
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    // Page progress bar
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
    
    // Hide/show header on scroll
    const scrollTop = window.scrollY;
    if (scrollTop > 100) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
    
    // Highlight current section in navbar
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= (sectionTop - 200)) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenuButton.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                mobileMenuButton.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
}

// Custom cursor with hover effects
const cursorDot = document.querySelector('.cursor-dot');

document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
});

// Enlarge cursor on hoverable elements
const hoverableElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
hoverableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorDot.style.width = '20px';
        cursorDot.style.height = '20px';
        cursorDot.style.backgroundColor = 'rgba(255, 46, 99, 0.5)';
    });
    element.addEventListener('mouseleave', () => {
        cursorDot.style.width = '10px';
        cursorDot.style.height = '10px';
        cursorDot.style.backgroundColor = 'var(--primary-color)';
    });
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use default
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button functionality
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.pointerEvents = 'all';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.pointerEvents = 'none';
    }
});

// Animate skill progress bars on scroll
const skillProgressBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillProgressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
    });
}

// Animation for elements when they come into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Observer for skill cards
const skillsSection = document.querySelector('.skills-section');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillsSection && skillsObserver.observe(skillsSection);

// Observer for other animated elements
const animatedElements = document.querySelectorAll('.animate-fadeInUp');
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            elementObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    elementObserver.observe(element);
});

// Observer for project cards
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            projectObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    card.style.transitionDelay = `${index * 0.2}s`;
    projectObserver.observe(card);
});

// Form submission handling
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a server
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', { name, email, message });
        
        // Create a success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.backgroundColor = 'var(--secondary-color)';
        successMessage.style.color = 'white';
        successMessage.style.padding = '1rem';
        successMessage.style.borderRadius = '4px';
        successMessage.style.marginTop = '1rem';
        successMessage.style.border = '2px solid var(--shadow-color)';
        successMessage.style.boxShadow = '4px 4px 0 var(--shadow-color)';
        successMessage.style.animation = 'fadeInUp 0.5s ease forwards';
        successMessage.innerHTML = `
            <p>Thank you for your message, ${name}!</p>
            <p>I will get back to you soon.</p>
        `;
        
        // Add success message to the form
        contactForm.appendChild(successMessage);
        
        // Reset form
        this.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(-20px)';
            successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                contactForm.removeChild(successMessage);
            }, 500);
        }, 5000);
    });
}

// Add a simple typing effect to the hero heading
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit before starting the animation
    setTimeout(() => {
        const heroHeading = document.querySelector('.hero-content h1');
        if (heroHeading) {
            const text = heroHeading.innerHTML;
            heroHeading.innerHTML = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    heroHeading.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            typeWriter();
        }
    }, 500);
});
