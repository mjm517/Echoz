document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const searchForm = document.getElementById('searchForm');
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');

    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', () => {
            getLocation('upload');
        });
    }

    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', () => {
            getLocation('search');
        });
    }
});

function getLocation(formType) {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            if (formType === 'upload') {
                document.getElementById('latitude').value = lat;
                document.getElementById('longitude').value = lng;
            } else if (formType === 'search') {
                document.getElementById('searchLat').value = lat;
                document.getElementById('searchLng').value = lng;
            }
        },
        () => {
            alert('Unable to retrieve your location');
        }
    );
}

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
    
    const lat = document.getElementById('searchLat').value;
    const lng = document.getElementById('searchLng').value;
    const radius = document.getElementById('searchRadius').value;
    
    try {
        const response = await fetch(`/search/location?lat=${lat}&lng=${lng}&radius=${radius}`);
        const memories = await response.json();
        
        if (!response.ok) {
            throw new Error(memories.error || 'Search failed');
        }
        
        updateMemoriesDisplay(memories);
        
    } catch (error) {
        alert(error.message);
    }
}

function updateMemoriesDisplay(memories) {
    const container = document.getElementById('memoriesContainer');
    container.innerHTML = '';
    
    memories.forEach(memory => {
        const memoryHtml = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${memory.image_url}" class="card-img-top" alt="${memory.title}">
                    <div class="card-body">
                        <h5 class="card-title">${memory.title}</h5>
                        <p class="card-text">${memory.description ? memory.description.substring(0, 100) + (memory.description.length > 100 ? '...' : '') : ''}</p>
                        ${memory.location ? `<p class="card-text"><small class="text-muted">📍 ${memory.location}</small></p>` : ''}
                        <a href="/memory/${memory.id}" class="btn btn-secondary">View Details</a>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', memoryHtml);
    });
}
