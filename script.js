document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(13, 13, 13, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(13, 13, 13, 0.9)';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Load posts
    async function loadPosts() {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;

        try {
            const response = await fetch('posts.json');
            const posts = await response.json();
            
            const topPosts = posts.slice(0, 3);
            
            postsGrid.innerHTML = topPosts.map((post, index) => `
                <article class="post-card" style="opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s;">
                    <h3>${post.title}</h3>
                    <p class="post-date">${post.date}</p>
                    <p>${post.excerpt}</p>
                    <a href="view?file=posts/${post.slug}" class="read-more">Read more →</a>
                </article>
            `).join('');

            topPosts.forEach((_, index) => {
                observer.observe(postsGrid.children[index]);
            });
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    }

    loadPosts();

    // Load projects
    async function loadProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        try {
            const response = await fetch('projects.json');
            const projects = await response.json();
            
            projectsGrid.innerHTML = projects.map((project, index) => `
                <article class="project-card" style="opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s;">
                    <h3>${project.repo ? `<a href="${project.repo}" target="_blank" rel="noopener noreferrer">${project.title}</a>` : project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </article>
            `).join('');

            projects.forEach((_, index) => {
                observer.observe(projectsGrid.children[index]);
            });
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    }

    loadProjects();

    // Load ideas
    async function loadIdeas() {
        const ideasGrid = document.getElementById('ideas-grid');
        if (!ideasGrid) return;

        try {
            const response = await fetch('ideas.json');
            const ideas = await response.json();
            
            ideasGrid.innerHTML = ideas.map((idea, index) => `
                <article class="idea-card" style="opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s;">
                    <h3>${idea.title}</h3>
                    <p>${idea.description}</p>
                    <a href="view?file=ideas/${idea.slug}" class="read-more">Read more →</a>
                </article>
            `).join('');

            ideas.forEach((_, index) => {
                observer.observe(ideasGrid.children[index]);
            });
        } catch (error) {
            console.error('Failed to load ideas:', error);
        }
    }

    loadIdeas();

    // Animate about section
    const aboutSection = document.querySelector('.about-text');
    if (aboutSection) {
        aboutSection.style.opacity = '0';
        aboutSection.style.transform = 'translateY(30px)';
        aboutSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(aboutSection);
    }
});
