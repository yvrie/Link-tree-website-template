// Configuration - Update these with your actual information
const config = {
    githubUsername: 'L0veNote',
    profileName: '@Josee',
    profileBio: "I'm only wearing band-aids today! 🩹",
    links: {
        spotify: 'https://open.spotify.com/user/n1wm3jcv16wmi4mkodgv8aqfm?si=28600123218449ad',
        anilist: 'https://anilist.co/user/L0veNote/',
        discord: 'https://discord.com/users/1063170259764396103',
        steam: 'https://steamcommunity.com/id/LoveNote0/',
        github: 'https://github.com/L0veNote',
        lastfm: 'https://www.last.fm/user/Yurikae'
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProfile();
    initializeLinks();
    initializeParticles();
    initializeBackgroundInteraction();
    addSmoothAnimations();
});

// Make background pattern respond to mouse movement
function initializeBackgroundInteraction() {
    const pattern = document.querySelector('.background-pattern');
    if (!pattern) return;
    
    let mouseX = 0.5;
    let mouseY = 0.5;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        // Move background pattern based on mouse position
        const offsetX = (mouseX - 0.5) * 20;
        const offsetY = (mouseY - 0.5) * 20;
        pattern.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
}

// Fetch GitHub profile picture
async function fetchGitHubProfile() {
    try {
        const response = await fetch(`https://api.github.com/users/${config.githubUsername}`);
        const data = await response.json();
        
        if (data.avatar_url) {
            const profileImage = document.getElementById('profileImage');
            profileImage.src = data.avatar_url;
            profileImage.alt = data.name || config.profileName;
            
            // Update profile name and bio if available
            if (data.name) {
                const profileNameEl = document.querySelector('.profile-name');
                if (profileNameEl) {
                    profileNameEl.textContent = `@${config.githubUsername}`;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        // Fallback to default placeholder
        const profileImage = document.getElementById('profileImage');
        profileImage.src = `https://github.com/${config.githubUsername}.png`;
    }
}

// Initialize link cards with click handlers
function initializeLinks() {
    const linkCards = document.querySelectorAll('.link-card');
    
    linkCards.forEach(card => {
        const linkType = card.getAttribute('data-link');
        const url = config.links[linkType];
        
        if (url) {
            card.addEventListener('click', () => {
                // Add a subtle animation before navigation
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    card.style.transform = '';
                }, 150);
            });
        }
    });
}

// Add smooth entrance animations
function addSmoothAnimations() {
    const linkCards = document.querySelectorAll('.link-card');
    
    // Stagger animation for link cards
    linkCards.forEach((card, index) => {
        card.style.animationDelay = `${0.3 + index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out both';
    });
}

// Initialize particles canvas with enhanced interactivity
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    let mouse = { x: canvas.width / 2, y: canvas.height / 2, active: false };
    let mouseTrail = [];
    const maxTrailLength = 10;
    
    // Track mouse position for particle interaction
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
        
        // Add to mouse trail
        mouseTrail.push({ x: mouse.x, y: mouse.y, time: Date.now() });
        if (mouseTrail.length > maxTrailLength) {
            mouseTrail.shift();
        }
    });
    
    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });
    
    // Create particles with more variety
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.4 + 0.2,
            baseOpacity: Math.random() * 0.4 + 0.2,
            hue: Math.random() * 360,
            pulseSpeed: Math.random() * 0.02 + 0.01,
            pulsePhase: Math.random() * Math.PI * 2
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw mouse trail
        if (mouse.active && mouseTrail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(mouseTrail[0].x, mouseTrail[0].y);
            for (let i = 1; i < mouseTrail.length; i++) {
                const point = mouseTrail[i];
                const age = (Date.now() - point.time) / 1000;
                const alpha = Math.max(0, 1 - age * 2);
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = `rgba(118, 75, 162, ${alpha * 0.3})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Enhanced mouse interaction
            if (mouse.active) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    // Particles flow around cursor
                    const angle = Math.atan2(dy, dx);
                    const pushAngle = angle + Math.PI / 2;
                    particle.x += Math.cos(pushAngle) * force * 0.8;
                    particle.y += Math.sin(pushAngle) * force * 0.8;
                    
                    // Increase opacity and size near cursor
                    particle.opacity = Math.min(0.8, particle.baseOpacity + force * 0.4);
                    particle.radius = Math.min(5, 2 + force * 1.5);
                } else {
                    particle.opacity = particle.baseOpacity;
                    particle.radius = Math.min(3, 2 + Math.abs(Math.sin(particle.pulsePhase)) * 0.5);
                }
            } else {
                // Pulse animation when mouse is away
                particle.pulsePhase += particle.pulseSpeed;
                particle.radius = 2 + Math.abs(Math.sin(particle.pulsePhase)) * 0.5;
                particle.opacity = particle.baseOpacity;
            }
            
            // Bounce off edges with slight randomization
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            }
            
            // Draw particle with glow effect
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
            gradient.addColorStop(0.5, `rgba(118, 75, 162, ${particle.opacity * 0.5})`);
            gradient.addColorStop(1, `rgba(118, 75, 162, 0)`);
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw connections with dynamic opacity based on mouse proximity
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    let opacity = 0.15 * (1 - distance / 120);
                    
                    // Increase connection visibility near mouse
                    if (mouse.active) {
                        const mouseDistance = Math.sqrt(
                            Math.pow((particle.x + otherParticle.x) / 2 - mouse.x, 2) +
                            Math.pow((particle.y + otherParticle.y) / 2 - mouse.y, 2)
                        );
                        if (mouseDistance < 200) {
                            opacity *= (1 + (200 - mouseDistance) / 200);
                        }
                    }
                    
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.5, opacity)})`;
                    ctx.lineWidth = 0.5 + opacity * 0.5;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Add click effect - create ripple
    document.addEventListener('click', (e) => {
        createRipple(canvas, ctx, e.clientX, e.clientY);
    });
}

// Create ripple effect on click
function createRipple(canvas, ctx, x, y) {
    let radius = 0;
    const maxRadius = 200;
    const speed = 5;
    
    function animateRipple() {
        radius += speed;
        if (radius < maxRadius) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            const opacity = 1 - (radius / maxRadius);
            ctx.strokeStyle = `rgba(118, 75, 162, ${opacity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            requestAnimationFrame(animateRipple);
        }
    }
    
    animateRipple();
}

// Particles are already interactive with mouse movement

// Add ripple effect on link card click
document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

