// Store designations and search results
let designations = new Set();
let companies = new Set();
let lastSearchResults = null;

// Popular designations list
const popularDesignations = [
    "CEO", "CTO", "CFO", "COO", "CMO",
    "Software Engineer", "Senior Software Engineer", "Lead Software Engineer", "Principal Software Engineer", "Software Architect",
    "Product Manager", "Senior Product Manager", "Product Owner", "Product Director", "VP of Product",
    "Data Scientist", "Senior Data Scientist", "Lead Data Scientist", "Data Engineer", "Machine Learning Engineer",
    "UX Designer", "UI Designer", "Product Designer", "Senior Designer", "Design Director",
    "Marketing Manager", "Digital Marketing Manager", "Marketing Director", "Growth Manager", "Brand Manager",
    "Sales Manager", "Account Executive", "Sales Director", "Business Development Manager", "Sales Representative",
    "HR Manager", "HR Director", "Talent Acquisition Manager", "HR Business Partner", "Recruiting Manager",
    "Operations Manager", "Operations Director", "Project Manager", "Program Manager", "Scrum Master",
    "Financial Analyst", "Senior Financial Analyst", "Finance Manager", "Finance Director", "Controller",
    "Business Analyst", "Senior Business Analyst", "Business Intelligence Analyst", "Data Analyst", "Research Analyst",
    "DevOps Engineer", "Site Reliability Engineer", "Systems Engineer", "Cloud Engineer", "Infrastructure Engineer",
    "Full Stack Developer", "Frontend Developer", "Backend Developer", "Mobile Developer", "iOS Developer",
    "Android Developer", "React Developer", "Angular Developer", "Node.js Developer", "Python Developer",
    "Quality Assurance Engineer", "QA Lead", "Test Engineer", "Automation Engineer", "Performance Engineer",
    "Security Engineer", "Information Security Manager", "Security Analyst", "Cybersecurity Engineer", "Security Architect",
    "Content Manager", "Content Strategist", "Content Writer", "Technical Writer", "Copywriter",
    "Customer Success Manager", "Account Manager", "Client Services Manager", "Customer Support Manager", "Customer Experience Manager",
    "Supply Chain Manager", "Procurement Manager", "Logistics Manager", "Inventory Manager", "Supply Chain Director",
    "Legal Counsel", "Corporate Counsel", "Patent Attorney", "Compliance Officer", "Legal Director",
    "Research Scientist", "Research Engineer", "R&D Manager", "Innovation Manager", "Research Director"
];

// Recent designations management
const RECENT_DESIGNATIONS_KEY = 'recentDesignations';
const MAX_RECENT_DESIGNATIONS = 50;
let recentDesignations = [];
let filteredRecentDesignations = [];
let recentPage = 0;

// Load recent designations from localStorage
function loadRecentDesignations() {
    const stored = localStorage.getItem(RECENT_DESIGNATIONS_KEY);
    if (stored) {
        recentDesignations = JSON.parse(stored);
        filteredRecentDesignations = [...recentDesignations];
    }
}

// Save recent designations to localStorage
function saveRecentDesignations() {
    localStorage.setItem(RECENT_DESIGNATIONS_KEY, JSON.stringify(recentDesignations));
}

// Add designation to recent list
function addToRecent(designation) {
    // Remove if already exists
    recentDesignations = recentDesignations.filter(d => d !== designation);
    // Add to front of array
    recentDesignations.unshift(designation);
    // Keep only the most recent MAX_RECENT_DESIGNATIONS
    if (recentDesignations.length > MAX_RECENT_DESIGNATIONS) {
        recentDesignations = recentDesignations.slice(0, MAX_RECENT_DESIGNATIONS);
    }
    filteredRecentDesignations = [...recentDesignations];
    saveRecentDesignations();
    displayRecentDesignations();
}

// Filter recent designations
function filterRecentDesignations(searchText) {
    if (!searchText) {
        filteredRecentDesignations = [...recentDesignations];
    } else {
        const searchLower = searchText.toLowerCase();
        filteredRecentDesignations = recentDesignations.filter(designation => 
            designation.toLowerCase().includes(searchLower)
        );
    }
    recentPage = 0;
    displayRecentDesignations();
}

// Display recent designations
function displayRecentDesignations() {
    const recentList = document.getElementById('recentDesignationsList');
    const start = recentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredRecentDesignations.slice(start, end);
    
    let html = '';
    
    if (filteredRecentDesignations.length === 0) {
        html = `
            <div class="text-center text-gray-500 py-4">
                <p>No recent designations</p>
            </div>
        `;
    } else {
        pageItems.forEach(designation => {
            const isSelected = designations.has(designation);
            html += `
                <div class="designation-suggestion p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''}"
                     onclick="toggleSuggestion('${designation.replace(/'/g, "\\'")}')">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700">${designation}</span>
                        <div class="flex items-center space-x-2">
                            ${isSelected ? `
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            ` : ''}
                            <button onclick="deleteRecentDesignation('${designation.replace(/'/g, "\\'")}', event)"
                                    class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        // Add navigation controls
        if (filteredRecentDesignations.length > itemsPerPage) {
            html += `
                <div class="flex justify-between items-center py-4">
                    ${recentPage > 0 ? `
                        <button onclick="previousRecentPage()" 
                                class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span>Previous</span>
                        </button>
                    ` : `<div></div>`}
                    
                    ${end < filteredRecentDesignations.length ? `
                        <button onclick="nextRecentPage()" 
                                class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2">
                            <span>Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    ` : `<div></div>`}
                </div>
                <div class="text-center text-sm text-gray-500">
                    Showing ${start + 1}-${end} of ${filteredRecentDesignations.length}
                </div>
            `;
        }
    }

    recentList.innerHTML = html;
}

// Navigation functions for recent designations
function nextRecentPage() {
    if ((recentPage + 1) * itemsPerPage < filteredRecentDesignations.length) {
        recentPage++;
        displayRecentDesignations();
        document.getElementById('recentDesignationsList').scrollTop = 0;
    }
}

function previousRecentPage() {
    if (recentPage > 0) {
        recentPage--;
        displayRecentDesignations();
        document.getElementById('recentDesignationsList').scrollTop = 0;
    }
}

// Get DOM elements
const designationInput = document.getElementById('designationInput');
const addDesignationBtn = document.getElementById('addDesignation');
const designationsList = document.getElementById('designationsList');
const noDesignationsText = document.getElementById('noDesignations');
const companyInput = document.getElementById('companyInput');
const addCompanyBtn = document.getElementById('addCompany');
const companiesList = document.getElementById('companiesList');
const noCompaniesText = document.getElementById('noCompanies');
const searchForm = document.getElementById('searchForm');
const resultCountInput = document.getElementById('resultCount');
const exportButtons = document.getElementById('exportButtons');
const suggestionSearch = document.getElementById('suggestionSearch');
const suggestionsList = document.getElementById('suggestionsList');
const recentSearch = document.getElementById('recentSearch');

// Initialize suggestions
let currentSuggestions = [...popularDesignations];
let currentPage = 0;
const itemsPerPage = 9;

// Load recent designations on startup
loadRecentDesignations();
displayRecentDesignations();

// Add search event listener for recent designations
recentSearch.addEventListener('input', (e) => {
    filterRecentDesignations(e.target.value);
});

// Function to filter suggestions based on search
function filterSuggestions(searchText) {
    if (!searchText) {
        currentSuggestions = [...popularDesignations];
    } else {
        const searchLower = searchText.toLowerCase();
        currentSuggestions = popularDesignations.filter(designation => 
            designation.toLowerCase().includes(searchLower)
        );
    }
    currentPage = 0;
    displaySuggestions();
}

// Function to display suggestions
function displaySuggestions() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = currentSuggestions.slice(start, end);
    
    let html = '';
    
    if (pageItems.length === 0) {
        html = `
            <div class="text-center text-gray-500 py-4">
                <p>No matching designations found</p>
            </div>
        `;
    } else {
        pageItems.forEach(designation => {
            const isSelected = designations.has(designation);
            html += `
                <div class="designation-suggestion p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''}"
                     onclick="toggleSuggestion('${designation.replace(/'/g, "\\'")}')">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-700">${designation}</span>
                        ${isSelected ? `
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        // Add navigation controls
        html += `
            <div class="flex justify-between items-center py-4">
                ${currentPage > 0 ? `
                    <button onclick="previousPage()" 
                            class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        <span>Previous</span>
                    </button>
                ` : `<div></div>`}
                
                ${end < currentSuggestions.length ? `
                    <button onclick="loadMore()" 
                            class="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2">
                        <span>Next</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                ` : `<div></div>`}
            </div>
            <div class="text-center text-sm text-gray-500">
                Showing ${start + 1}-${end} of ${currentSuggestions.length}
            </div>
        `;
    }

    suggestionsList.innerHTML = html;
}

// Function to load more suggestions
function loadMore() {
    if ((currentPage + 1) * itemsPerPage < currentSuggestions.length) {
        currentPage++;
        displaySuggestions();
        // Scroll to top of suggestions list
        suggestionsList.scrollTop = 0;
    }
}

// Function to go to previous page
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displaySuggestions();
        // Scroll to top of suggestions list
        suggestionsList.scrollTop = 0;
    }
}

// Function to toggle suggestion selection
function toggleSuggestion(designation) {
    if (designations.has(designation)) {
        removeDesignation(designation);
    } else {
        addDesignation(designation);
    }
    displaySuggestions(); // Refresh the suggestions list to update selection status
}

// Initialize suggestions display
displaySuggestions();

// Add search event listener
suggestionSearch.addEventListener('input', (e) => {
    filterSuggestions(e.target.value);
});

// Make toggleSuggestion available globally
window.toggleSuggestion = toggleSuggestion;
window.loadMore = loadMore;
window.previousPage = previousPage;
window.nextRecentPage = nextRecentPage;
window.previousRecentPage = previousRecentPage;

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
    addToRecent(designation); // Add to recent designations
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

// Function to add a new company
function addCompany(company) {
    if (!company) return;
    
    // Add to Set to prevent duplicates
    if (companies.has(company)) {
        showNotification('This company has already been added', 'error');
        return;
    }
    
    companies.add(company);
    updateCompaniesList();
    companyInput.value = '';
    noCompaniesText.style.display = 'none';
    showNotification('Company added successfully', 'success');
}

// Function to remove a company
function removeCompany(company) {
    companies.delete(company);
    updateCompaniesList();
    if (companies.size === 0) {
        noCompaniesText.style.display = 'block';
    }
    showNotification('Company removed', 'info');
}

// Function to update the companies list in the UI
function updateCompaniesList() {
    companiesList.innerHTML = '';
    companies.forEach(company => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200';
        div.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">${company}</span>
            </div>
            <button type="button" 
                    class="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1"
                    onclick="removeCompany('${company}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        `;
        companiesList.appendChild(div);
    });
}

// Add company when button is clicked
addCompanyBtn.addEventListener('click', () => {
    const company = companyInput.value.trim();
    addCompany(company);
});

// Add company when Enter is pressed
companyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const company = companyInput.value.trim();
        addCompany(company);
    }
});

// Function to prepare data for export
function prepareExportData(companyName = null) {
    if (!lastSearchResults) {
        showNotification('No search results to export', 'error');
        return null;
    }

    const data = [];
    
    // Add header row
    data.push(['Company', 'Designation', 'LinkedIn Profile']);
    
    // Add data rows
    if (companyName) {
        // Export data for specific company
        const companyResult = lastSearchResults.Companies.find(c => c.CompanyName === companyName);
        if (companyResult) {
            Object.entries(companyResult.Designations).forEach(([designation, profiles]) => {
                profiles.forEach(profile => {
                    data.push([companyResult.CompanyName, designation, profile]);
                });
            });
        }
    } else {
        // Export all data
        lastSearchResults.Companies.forEach(companyResult => {
            Object.entries(companyResult.Designations).forEach(([designation, profiles]) => {
                profiles.forEach(profile => {
                    data.push([companyResult.CompanyName, designation, profile]);
                });
            });
        });
    }

    return data;
}

// Function to export data as CSV
function exportCSV(companyName = null) {
    const data = prepareExportData(companyName);
    if (!data) return;

    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `linkedin_profiles${companyName ? '_' + companyName : ''}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`CSV file exported successfully${companyName ? ' for ' + companyName : ''}`, 'success');
}

// Function to export data as Excel
function exportExcel(companyName = null) {
    const data = prepareExportData(companyName);
    if (!data) return;

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LinkedIn Profiles');
    XLSX.writeFile(wb, `linkedin_profiles${companyName ? '_' + companyName : ''}.xlsx`);
    showNotification(`Excel file exported successfully${companyName ? ' for ' + companyName : ''}`, 'success');
}

// Update the display results section to include company-specific export buttons
function updateResults(results) {
    const resultsDiv = document.getElementById('results');
    let resultsHTML = `
        <div class="animate-fade-in">
            <h2 class="text-xl font-semibold mb-6 pb-2 border-b">Search Results</h2>
    `;
    
    results.Companies.forEach(companyResult => {
        resultsHTML += `
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${companyResult.CompanyName}</h3>
                    <div class="flex items-center space-x-2 opacity-0 transition-opacity duration-200 hover:opacity-100 export-buttons">
                        <button onclick="exportCSV('${companyResult.CompanyName}')"
                                class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span>CSV</span>
                        </button>
                        <button onclick="exportExcel('${companyResult.CompanyName}')"
                                class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                            <span>Excel</span>
                        </button>
                    </div>
                </div>
        `;
        
        Object.entries(companyResult.Designations).forEach(([designation, profiles]) => {
            resultsHTML += `
                <div class="mb-6 animate-fade-in">
                    <div class="flex items-center space-x-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        <h4 class="text-md font-medium text-gray-800">${designation}</h4>
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
    });

    resultsHTML += '</div>';
    resultsDiv.innerHTML = resultsHTML;

    // Add CSS for export buttons hover effect
    const style = document.createElement('style');
    style.textContent = `
        .export-buttons {
            opacity: 0;
        }
        .mb-8:hover .export-buttons {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Update the search form submission to use the new updateResults function
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (companies.size === 0) {
        showNotification('Please add at least one company', 'error');
        return;
    }

    if (designations.size === 0) {
        showNotification('Please add at least one designation', 'error');
        return;
    }

    const resultCount = parseInt(resultCountInput.value);
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

    // Hide export buttons while searching
    exportButtons.style.display = 'none';

    try {
        const searchPromises = Array.from(companies).map(company => 
            fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    company,
                    designations: Array.from(designations),
                    resultCount
                })
            }).then(response => response.json())
        );

        const results = await Promise.all(searchPromises);
        
        lastSearchResults = {
            Companies: results.map((result, index) => ({
                CompanyName: Array.from(companies)[index],
                Designations: result.Designations
            }))
        };
        
        updateResults(lastSearchResults);

        // Show export buttons if there are results
        if (lastSearchResults.Companies.some(company => 
            Object.values(company.Designations).some(profiles => profiles.length > 0))) {
            exportButtons.style.display = 'flex';
        }

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

// Function to clear all recent designations
function clearAllRecent() {
    if (confirm('Are you sure you want to clear all recent designations?')) {
        recentDesignations = [];
        filteredRecentDesignations = [];
        saveRecentDesignations();
        displayRecentDesignations();
        showNotification('All recent designations cleared', 'info');
    }
}

// Function to delete a single recent designation
function deleteRecentDesignation(designation, event) {
    // Prevent the click from triggering the parent's onclick
    event.stopPropagation();
    
    recentDesignations = recentDesignations.filter(d => d !== designation);
    filteredRecentDesignations = filteredRecentDesignations.filter(d => d !== designation);
    saveRecentDesignations();
    displayRecentDesignations();
    showNotification('Designation removed from recent list', 'info');
}

// Make functions available globally
window.toggleSuggestion = toggleSuggestion;
window.loadMore = loadMore;
window.previousPage = previousPage;
window.nextRecentPage = nextRecentPage;
window.previousRecentPage = previousRecentPage;
window.clearAllRecent = clearAllRecent;
window.deleteRecentDesignation = deleteRecentDesignation;
window.toggleSuggestion = toggleSuggestion;
window.loadMore = loadMore;
window.previousPage = previousPage;
window.nextRecentPage = nextRecentPage;
window.previousRecentPage = previousRecentPage;
window.clearAllRecent = clearAllRecent;
window.deleteRecentDesignation = deleteRecentDesignation;
window.toggleSuggestion = toggleSuggestion;
window.loadMore = loadMore;
window.previousPage = previousPage;
window.nextRecentPage = nextRecentPage;
window.previousRecentPage = previousRecentPage;
window.clearAllRecent = clearAllRecent;
window.deleteRecentDesignation = deleteRecentDesignation; 