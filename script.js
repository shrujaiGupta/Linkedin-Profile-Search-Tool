// Store designations
let designations = new Set();

// Get DOM elements
const designationInput = document.getElementById('designationInput');
const addDesignationBtn = document.getElementById('addDesignation');
const designationsList = document.getElementById('designationsList');
const noDesignationsText = document.getElementById('noDesignations');
const searchForm = document.getElementById('searchForm');
const resultCountInput = document.getElementById('resultCount');

// Validate result count input
resultCountInput.addEventListener('change', () => {
    let value = parseInt(resultCountInput.value);
    if (value < 1) resultCountInput.value = 1;
    if (value > 100) resultCountInput.value = 100;
});

// Function to add a new designation
function addDesignation(designation) {
    if (!designation) return;
    
    // Add to Set to prevent duplicates
    if (designations.has(designation)) {
        showNotification('This designation has already been added', 'error');
        return;
    }
    
    designations.add(designation);
    updateDesignationsList();
    designationInput.value = '';
    noDesignationsText.style.display = 'none';
    showNotification('Designation added successfully', 'success');
}

// Function to remove a designation
function removeDesignation(designation) {
    designations.delete(designation);
    updateDesignationsList();
    if (designations.size === 0) {
        noDesignationsText.style.display = 'block';
    }
    showNotification('Designation removed', 'info');
}

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg animate-fade-in
        ${type === 'error' ? 'bg-red-500 text-white' : 
          type === 'success' ? 'bg-green-500 text-white' :
          'bg-blue-500 text-white'}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Function to update the designations list in the UI
function updateDesignationsList() {
    designationsList.innerHTML = '';
    designations.forEach(designation => {
        const div = document.createElement('div');
        div.className = 'designation-item flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200';
        div.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span class="text-gray-700">${designation}</span>
            </div>
            <button type="button" 
                    class="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1"
                    onclick="removeDesignation('${designation}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        `;
        designationsList.appendChild(div);
    });
}

// Add designation when button is clicked
addDesignationBtn.addEventListener('click', () => {
    const designation = designationInput.value.trim();
    addDesignation(designation);
});

// Add designation when Enter is pressed
designationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const designation = designationInput.value.trim();
        addDesignation(designation);
    }
});

// Handle form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const company = document.getElementById('companyInput').value.trim();
    const resultCount = parseInt(resultCountInput.value);

    if (!company) {
        showNotification('Please enter a company name', 'error');
        return;
    }

    if (designations.size === 0) {
        showNotification('Please add at least one designation', 'error');
        return;
    }

    if (resultCount < 1 || resultCount > 100) {
        showNotification('Please enter a valid number of results (1-100)', 'error');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="flex items-center justify-center space-x-3 text-gray-600">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Searching profiles... Please wait.</span>
        </div>
    `;

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company,
                designations: Array.from(designations),
                resultCount
            })
        });

        const data = await response.json();
        
        // Display results
        let resultsHTML = `
            <div class="animate-fade-in">
                <h2 class="text-xl font-semibold mb-6 pb-2 border-b">Search Results</h2>
        `;
        
        Object.entries(data.Designations).forEach(([designation, profiles]) => {
            resultsHTML += `
                <div class="mb-8 animate-fade-in">
                    <div class="flex items-center space-x-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        <h3 class="text-lg font-medium text-gray-800">${designation}</h3>
                        <span class="text-sm text-gray-500">(${profiles.length} profiles found)</span>
                    </div>
                    ${profiles.length > 0 
                        ? `<div class="bg-white rounded-lg shadow-sm border p-4">
                            <ul class="space-y-2">
                                ${profiles.map(profile => `
                                    <li class="hover:bg-gray-50 p-2 rounded transition-colors">
                                        <a href="${profile}" target="_blank" 
                                           class="text-blue-600 hover:text-blue-800 flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                            </svg>
                                            <span>${profile}</span>
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                           </div>`
                        : '<p class="text-gray-500 italic">No profiles found</p>'
                    }
                </div>
            `;
        });

        resultsHTML += '</div>';
        resultsDiv.innerHTML = resultsHTML;
        showNotification('Search completed successfully', 'success');
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-red-700">An error occurred while searching profiles. Please try again.</span>
                </div>
            </div>
        `;
        showNotification('Error occurred while searching', 'error');
        console.error('Error:', error);
    }
}); 