// Store designations
let designations = new Set();

// Get DOM elements
const designationInput = document.getElementById('designationInput');
const addDesignationBtn = document.getElementById('addDesignation');
const designationsList = document.getElementById('designationsList');
const noDesignationsText = document.getElementById('noDesignations');
const searchForm = document.getElementById('searchForm');

// Function to add a new designation
function addDesignation(designation) {
    if (!designation) return;
    
    // Add to Set to prevent duplicates
    if (designations.has(designation)) {
        alert('This designation has already been added');
        return;
    }
    
    designations.add(designation);
    updateDesignationsList();
    designationInput.value = '';
    noDesignationsText.style.display = 'none';
}

// Function to remove a designation
function removeDesignation(designation) {
    designations.delete(designation);
    updateDesignationsList();
    if (designations.size === 0) {
        noDesignationsText.style.display = 'block';
    }
}

// Function to update the designations list in the UI
function updateDesignationsList() {
    designationsList.innerHTML = '';
    designations.forEach(designation => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-gray-50 rounded-md';
        div.innerHTML = `
            <span class="text-gray-700">${designation}</span>
            <button type="button" class="text-red-500 hover:text-red-700" onclick="removeDesignation('${designation}')">
                Remove
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

    if (!company) {
        alert('Please enter a company name');
        return;
    }

    if (designations.size === 0) {
        alert('Please add at least one designation');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="text-center">Searching profiles... Please wait.</div>';

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company,
                designations: Array.from(designations)
            })
        });

        const data = await response.json();
        
        // Display results
        let resultsHTML = '<h2 class="text-xl font-semibold mb-4">Search Results</h2>';
        
        Object.entries(data.Designations).forEach(([designation, profiles]) => {
            resultsHTML += `
                <div class="mb-6">
                    <h3 class="text-lg font-medium mb-2">${designation}</h3>
                    ${profiles.length > 0 
                        ? `<ul class="list-disc pl-5 space-y-1">
                            ${profiles.map(profile => `
                                <li>
                                    <a href="${profile}" target="_blank" class="text-blue-500 hover:underline">
                                        ${profile}
                                    </a>
                                </li>
                            `).join('')}
                           </ul>`
                        : '<p class="text-gray-500">No profiles found</p>'
                    }
                </div>
            `;
        });

        resultsDiv.innerHTML = resultsHTML;
    } catch (error) {
        resultsDiv.innerHTML = '<div class="text-red-500">An error occurred while searching profiles. Please try again.</div>';
        console.error('Error:', error);
    }
}); 