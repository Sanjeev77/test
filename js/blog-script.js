// Blog listing page functionality

class BlogListing {
    constructor() {
        this.blogs = [];
        this.filteredBlogs = [];
        this.currentPage = 1;
        this.blogsPerPage = 9;
        this.init();
    }

    init() {
        this.loadBlogs();
        this.setupEventListeners();
        // this.populateCategories(); // Categories disabled
        // this.populateTags(); // Tags disabled
        // this.renderFeaturedPost(); // Featured post disabled
        this.renderBlogs();
    }

    loadBlogs() {
        // Get published blogs only
        this.blogs = (allBlogsData || []).filter(blog => blog.status === 'published');
        this.filteredBlogs = [...this.blogs];
        console.log(`Loaded ${this.blogs.length} published blogs`);
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('blogSearch');
        const searchButton = document.getElementById('searchButton');

        if (searchInput) {
            // Real-time search as user types
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

            // Search on Enter key press
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(searchInput.value);
                }
            });
        }

        // Search button click
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                this.handleSearch(searchInput.value);
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.applyFilters());
        }

        // Sort filter
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredBlogs = [...this.blogs];
        } else {
            const searchLower = query.toLowerCase();
            this.filteredBlogs = this.blogs.filter(blog =>
                blog.title.toLowerCase().includes(searchLower) ||
                blog.excerpt.toLowerCase().includes(searchLower) ||
                (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }
        this.currentPage = 1;
        this.renderBlogs();
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter')?.value;
        const sortFilter = document.getElementById('sortFilter')?.value;

        // Filter by category
        this.filteredBlogs = [...this.blogs];
        if (categoryFilter) {
            this.filteredBlogs = this.filteredBlogs.filter(blog => blog.category === categoryFilter);
        }

        // Sort
        switch (sortFilter) {
            case 'newest':
                this.filteredBlogs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                break;
            case 'oldest':
                this.filteredBlogs.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
                break;
            case 'popular':
                this.filteredBlogs.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
                break;
        }

        this.currentPage = 1;
        this.renderBlogs();
    }

    renderFeaturedPost() {
        const featuredBlog = this.blogs.find(blog => blog.featured);
        if (!featuredBlog) return;

        const section = document.getElementById('featuredBlogSection');
        const container = document.getElementById('featuredBlogPost');

        if (section && container) {
            section.style.display = 'block';
            // Use direct URL if available, otherwise fall back to slug-based URL
            const blogUrl = featuredBlog.url || `post.html?slug=${featuredBlog.slug}`;
            container.innerHTML = `
                <a href="${blogUrl}" class="featured-blog-link">
                    ${featuredBlog.featuredImage ? `
                        <div class="featured-blog-image">
                            <img src="${featuredBlog.featuredImage}" alt="${featuredBlog.title}">
                        </div>
                    ` : ''}
                    <div class="featured-blog-content">
                        ${featuredBlog.category ? `<span class="blog-category">${this.getCategoryName(featuredBlog.category)}</span>` : ''}
                        <h2>${featuredBlog.title}</h2>
                        <p>${featuredBlog.excerpt || ''}</p>
                        <div class="blog-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(featuredBlog.publishedAt)}</span>
                            <span><i class="fas fa-user"></i> ${featuredBlog.author}</span>
                            <span><i class="fas fa-eye"></i> ${featuredBlog.viewCount || 0} views</span>
                        </div>
                    </div>
                </a>
            `;
        }
    }

    renderBlogs() {
        const container = document.getElementById('blogGrid');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.blogsPerPage;
        const endIndex = startIndex + this.blogsPerPage;
        const paginatedBlogs = this.filteredBlogs.slice(startIndex, endIndex);

        if (paginatedBlogs.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = paginatedBlogs.map(blog => {
            // Use direct URL if available, otherwise fall back to slug-based URL
            const blogUrl = blog.url || `post.html?slug=${blog.slug}`;
            return `
            <article class="blog-card">
                <a href="${blogUrl}" class="blog-card-link">
                    ${blog.featuredImage ? `
                        <div class="blog-card-image">
                            <img src="${blog.featuredImage}" alt="${blog.title}">
                        </div>
                    ` : `
                        <div class="blog-card-image no-image">
                            <i class="fas fa-image"></i>
                        </div>
                    `}
                    <div class="blog-card-content">
                        ${blog.category ? `<span class="blog-category">${this.getCategoryName(blog.category)}</span>` : ''}
                        <h3>${blog.title}</h3>
                        <p class="blog-excerpt">${blog.excerpt || this.generateExcerpt(blog.content)}</p>
                        <div class="blog-meta">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(blog.publishedAt)}</span>
                            <span><i class="fas fa-user"></i> ${blog.author}</span>
                        </div>
                        ${blog.tags && blog.tags.length > 0 ? `
                            <div class="blog-tags">
                                ${blog.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </a>
            </article>
        `;
        }).join('');

        this.renderPagination();
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredBlogs.length / this.blogsPerPage);
        const paginationContainer = document.getElementById('pagination');

        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        paginationContainer.innerHTML = `
            ${this.currentPage > 1 ? `
                <button class="page-btn" onclick="blogListing.goToPage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </button>
            ` : ''}
            ${pages.map(page => {
                if (page === '...') {
                    return '<span class="page-ellipsis">...</span>';
                }
                return `
                    <button class="page-btn ${page === this.currentPage ? 'active' : ''}"
                            onclick="blogListing.goToPage(${page})">
                        ${page}
                    </button>
                `;
            }).join('')}
            ${this.currentPage < totalPages ? `
                <button class="page-btn" onclick="blogListing.goToPage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </button>
            ` : ''}
        `;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderBlogs();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    populateCategories() {
        const categoriesSelect = document.getElementById('categoryFilter');
        const categoriesList = document.getElementById('categoriesList');

        if (!blogCategories || blogCategories.length === 0) return;

        // Populate filter dropdown
        if (categoriesSelect) {
            blogCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.slug;
                option.textContent = category.name;
                categoriesSelect.appendChild(option);
            });
        }

        // Populate sidebar
        if (categoriesList) {
            // Count posts per category
            const categoryCounts = {};
            this.blogs.forEach(blog => {
                if (blog.category) {
                    categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1;
                }
            });

            categoriesList.innerHTML = blogCategories.map(category => `
                <li>
                    <a href="?category=${category.slug}">
                        ${category.name}
                        <span class="count">(${categoryCounts[category.slug] || 0})</span>
                    </a>
                </li>
            `).join('');
        }
    }

    populateTags() {
        const tagsList = document.getElementById('tagsList');
        if (!tagsList) return;

        // Collect all tags
        const tagCounts = {};
        this.blogs.forEach(blog => {
            if (blog.tags && Array.isArray(blog.tags)) {
                blog.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        // Sort by count and take top 10
        const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        if (topTags.length > 0) {
            tagsList.innerHTML = topTags.map(([tag, count]) => `
                <a href="?tag=${encodeURIComponent(tag)}" class="tag">
                    ${tag} <span class="tag-count">${count}</span>
                </a>
            `).join('');
        }
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
        // Strip HTML tags and limit length
        const text = content.replace(/<[^>]*>/g, '');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }
}

// Initialize when DOM is ready
let blogListing;
document.addEventListener('DOMContentLoaded', () => {
    blogListing = new BlogListing();

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const tag = urlParams.get('tag');

    if (category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
            blogListing.applyFilters();
        }
    }

    if (tag) {
        const searchInput = document.getElementById('blogSearch');
        if (searchInput) {
            searchInput.value = tag;
            blogListing.handleSearch(tag);
        }
    }

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
