// Individual blog post page functionality

class BlogPost {
    constructor() {
        this.post = null;
        this.slug = null;
        this.init();
    }

    init() {
        // Get slug from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.slug = urlParams.get('slug');

        if (!this.slug) {
            this.showError();
            return;
        }

        this.loadPost();
    }

    loadPost() {
        // Find post by slug
        this.post = (allBlogsData || []).find(blog =>
            blog.slug === this.slug && blog.status === 'published'
        );

        if (!this.post) {
            this.showError();
            return;
        }

        this.renderPost();
        this.updateMetaTags();
        this.populateSidebar();
        this.renderRelatedPosts();
        this.setupNavigation();
    }

    renderPost() {
        // Hide loading, show post
        const loadingState = document.getElementById('loadingState');
        const blogPost = document.getElementById('blogPost');

        if (loadingState) loadingState.style.display = 'none';
        if (blogPost) blogPost.style.display = 'block';

        // Update breadcrumb
        const breadcrumbTitle = document.getElementById('breadcrumbTitle');
        if (breadcrumbTitle) {
            breadcrumbTitle.textContent = this.post.title;
        }

        // Render post header
        const postCategory = document.getElementById('postCategory');
        if (postCategory && this.post.category) {
            postCategory.textContent = this.getCategoryName(this.post.category);
        }

        const postDate = document.getElementById('postDate');
        if (postDate) {
            postDate.innerHTML = `<i class="fas fa-calendar"></i> ${this.formatDate(this.post.publishedAt)}`;
        }

        const postAuthor = document.getElementById('postAuthor');
        if (postAuthor) {
            postAuthor.textContent = this.post.author;
        }

        const postViews = document.getElementById('postViews');
        if (postViews) {
            postViews.textContent = this.post.viewCount || 0;
        }

        const postTitle = document.getElementById('postTitle');
        if (postTitle) {
            postTitle.textContent = this.post.title;
        }

        const postExcerpt = document.getElementById('postExcerpt');
        if (postExcerpt && this.post.excerpt) {
            postExcerpt.textContent = this.post.excerpt;
        }

        // Render tags
        const postTags = document.getElementById('postTags');
        if (postTags && this.post.tags && this.post.tags.length > 0) {
            postTags.innerHTML = this.post.tags.map(tag =>
                `<a href="blog.html?tag=${encodeURIComponent(tag)}" class="tag">${tag}</a>`
            ).join('');
        }

        // Render featured image
        if (this.post.featuredImage) {
            const featuredImageContainer = document.getElementById('postFeaturedImage');
            const featuredImg = document.getElementById('featuredImg');
            if (featuredImageContainer && featuredImg) {
                featuredImg.src = this.post.featuredImage;
                featuredImg.alt = this.post.title;
                featuredImageContainer.style.display = 'block';
            }
        }

        // Render content
        const postContent = document.getElementById('postContent');
        if (postContent) {
            postContent.innerHTML = this.post.content;
        }
    }

    updateMetaTags() {
        // Update page title
        document.title = this.post.seoTitle || `${this.post.title} | Gift On Budget`;

        // Update meta description
        const metaDesc = document.getElementById('pageDescription');
        if (metaDesc) {
            metaDesc.setAttribute('content', this.post.seoDescription || this.post.excerpt || '');
        }

        // Update meta keywords
        const metaKeywords = document.getElementById('pageKeywords');
        if (metaKeywords && this.post.seoKeywords) {
            metaKeywords.setAttribute('content', this.post.seoKeywords);
        }

        // Update Open Graph tags
        const ogTitle = document.getElementById('ogTitle');
        if (ogTitle) {
            ogTitle.setAttribute('content', this.post.seoTitle || this.post.title);
        }

        const ogDescription = document.getElementById('ogDescription');
        if (ogDescription) {
            ogDescription.setAttribute('content', this.post.seoDescription || this.post.excerpt || '');
        }

        const ogImage = document.getElementById('ogImage');
        if (ogImage && this.post.featuredImage) {
            ogImage.setAttribute('content', this.post.featuredImage);
        }

        // Update canonical URL
        const canonical = document.getElementById('canonical');
        const ogUrl = document.getElementById('ogUrl');
        const currentUrl = `https://giftonbudget.com/pages/blog/post.html?slug=${this.slug}`;
        if (canonical) canonical.setAttribute('href', currentUrl);
        if (ogUrl) ogUrl.setAttribute('content', currentUrl);
    }

    populateSidebar() {
        // Recent posts
        const recentPostsList = document.getElementById('recentPostsList');
        if (recentPostsList) {
            const recentPosts = (allBlogsData || [])
                .filter(blog => blog.status === 'published' && blog.slug !== this.slug)
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .slice(0, 5);

            recentPostsList.innerHTML = recentPosts.map(post => `
                <li>
                    <a href="post.html?slug=${post.slug}">
                        <h4>${post.title}</h4>
                        <span class="date">${this.formatDate(post.publishedAt)}</span>
                    </a>
                </li>
            `).join('');
        }

        // Categories
        const categoriesList = document.getElementById('categoriesList');
        if (categoriesList && blogCategories) {
            const categoryCounts = {};
            (allBlogsData || []).filter(blog => blog.status === 'published').forEach(blog => {
                if (blog.category) {
                    categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
                }
            });

            categoriesList.innerHTML = blogCategories.map(category => `
                <li>
                    <a href="blog.html?category=${category.slug}">
                        ${category.name}
                        <span class="count">(${categoryCounts[category.slug] || 0})</span>
                    </a>
                </li>
            `).join('');
        }
    }

    renderRelatedPosts() {
        const section = document.getElementById('relatedPostsSection');
        const container = document.getElementById('relatedPosts');

        if (!section || !container) return;

        // Find posts in same category
        let relatedPosts = (allBlogsData || [])
            .filter(blog =>
                blog.status === 'published' &&
                blog.slug !== this.slug &&
                blog.category === this.post.category
            )
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 3);

        // If less than 3, add recent posts
        if (relatedPosts.length < 3) {
            const additionalPosts = (allBlogsData || [])
                .filter(blog =>
                    blog.status === 'published' &&
                    blog.slug !== this.slug &&
                    !relatedPosts.find(p => p.slug === blog.slug)
                )
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .slice(0, 3 - relatedPosts.length);

            relatedPosts = [...relatedPosts, ...additionalPosts];
        }

        if (relatedPosts.length === 0) return;

        section.style.display = 'block';
        container.innerHTML = relatedPosts.map(post => `
            <article class="blog-card">
                <a href="post.html?slug=${post.slug}" class="blog-card-link">
                    ${post.featuredImage ? `
                        <div class="blog-card-image">
                            <img src="${post.featuredImage}" alt="${post.title}">
                        </div>
                    ` : `
                        <div class="blog-card-image no-image">
                            <i class="fas fa-image"></i>
                        </div>
                    `}
                    <div class="blog-card-content">
                        ${post.category ? `<span class="blog-category">${this.getCategoryName(post.category)}</span>` : ''}
                        <h3>${post.title}</h3>
                        <p class="blog-excerpt">${post.excerpt || this.generateExcerpt(post.content)}</p>
                        <div class="blog-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(post.publishedAt)}</span>
                        </div>
                    </div>
                </a>
            </article>
        `).join('');
    }

    setupNavigation() {
        const navSection = document.getElementById('postNavigation');
        if (!navSection) return;

        const publishedPosts = (allBlogsData || [])
            .filter(blog => blog.status === 'published')
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        const currentIndex = publishedPosts.findIndex(blog => blog.slug === this.slug);
        if (currentIndex === -1) return;

        const prevPost = currentIndex < publishedPosts.length - 1 ? publishedPosts[currentIndex + 1] : null;
        const nextPost = currentIndex > 0 ? publishedPosts[currentIndex - 1] : null;

        if (prevPost) {
            const prevLink = document.getElementById('prevPost');
            if (prevLink) {
                prevLink.href = `post.html?slug=${prevPost.slug}`;
                prevLink.querySelector('.nav-title').textContent = prevPost.title;
                prevLink.style.display = 'flex';
            }
        }

        if (nextPost) {
            const nextLink = document.getElementById('nextPost');
            if (nextLink) {
                nextLink.href = `post.html?slug=${nextPost.slug}`;
                nextLink.querySelector('.nav-title').textContent = nextPost.title;
                nextLink.style.display = 'flex';
            }
        }

        if (prevPost || nextPost) {
            navSection.style.display = 'flex';
        }
    }

    showError() {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');

        if (loadingState) loadingState.style.display = 'none';
        if (errorState) errorState.style.display = 'block';
    }

    getCategoryName(slug) {
        const category = (blogCategories || []).find(cat => cat.slug === slug);
        return category ? category.name : slug;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    generateExcerpt(content) {
        const text = content.replace(/<[^>]*>/g, '');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }
}

// Social sharing functions
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

// Initialize when DOM is ready
let blogPost;
document.addEventListener('DOMContentLoaded', () => {
    blogPost = new BlogPost();

    // Footer Toggle Functionality for Mobile
    const footerHeadings = document.querySelectorAll('.footer-heading');

    footerHeadings.forEach(heading => {
        heading.addEventListener('click', function() {
            // Only toggle on mobile (max-width: 768px)
            if (window.innerWidth <= 768) {
                const parentColumn = this.closest('.footer-column');
                if (parentColumn) {
                    parentColumn.classList.toggle('active');
                }
            }
        });
    });

    // Remove active class on desktop resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const footerColumns = document.querySelectorAll('.footer-column');
            footerColumns.forEach(column => {
                column.classList.remove('active');
            });
        }
    });
});
