document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const searchForm = document.getElementById('searchForm');
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});

async function handleUpload(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        
        // Success - refresh the page to show new memory
        window.location.reload();
        
    } catch (error) {
        alert(error.message);
    }
}

async function handleSearch(e) {
    e.preventDefault();
    
    const searchParams = new URLSearchParams(new FormData(e.target));
    window.location.href = `/?${searchParams.toString()}`;
}
