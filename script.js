const blogForm = document.getElementById('blog-form');
const postTitleInput = document.getElementById('post-title');
const authorNameInput = document.getElementById('author-name');
const postContentInput = document.getElementById('post-content');
const blogPostsContainer = document.getElementById('blog-posts');
const navLinks = document.querySelectorAll('nav a');

function loadBlogPosts() {
    const savedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    blogPostsContainer.innerHTML = '';

    if (savedPosts.length === 0) {
        blogPostsContainer.innerHTML = '<p class="no-posts">Det finns inga inlägg ännu. Skapa ditt första inlägg!</p>';
        return;
    }

    savedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    savedPosts.forEach(post => {
        displayBlogPost(post);
    });
}

function displayBlogPost(post) {
    const postElement = document.createElement('article');
    postElement.classList.add('post');
    postElement.dataset.id = post.id;

    const formattedDate = new Date(post.date).toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    postElement.innerHTML = `
        <div class="post-header">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-meta">Skrivet av ${post.author} den ${formattedDate}</p>
        </div>
        <div class="post-content">
            ${formatContent(post.content)}
        </div>
    `;

    blogPostsContainer.prepend(postElement);
}

function formatContent(content) {
    return content.replace(/\n/g, '<br>');
}

function saveBlogPost(post) {
    let savedPosts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    savedPosts.push(post);
    localStorage.setItem('blogPosts', JSON.stringify(savedPosts));
}

blogForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const title = postTitleInput.value.trim();
    const author = authorNameInput.value.trim();
    const content = postContentInput.value.trim();
    
    if (!title || !author || !content) {
        alert('Vänligen fyll i alla fält');
        return;
    }
    
    const newPost = {
        id: Date.now().toString(),
        title: title,
        author: author,
        content: content,
        date: new Date().toISOString()
    };
    
    saveBlogPost(newPost);
    displayBlogPost(newPost);
    
    blogForm.reset();
    
    showSection('home');
});

function showSection(sectionId) {

    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        const sectionId = this.getAttribute('href').substring(1);
        showSection(sectionId);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    showSection('home');
});