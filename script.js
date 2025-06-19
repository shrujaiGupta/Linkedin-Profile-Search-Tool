// Store designations and search results
let designations = new Set();
let companies = new Set();
let lastSearchResults = null;

// Global variables
let allProfiles = [];
let currentPage = 1;
const itemsPerPage = 9;
let currentRecentPage = 1;
let currentRecentCompanyPage = 1;
const recentItemsPerPage = 9;

// Recent designations functionality
let recentDesignations = JSON.parse(localStorage.getItem('recentDesignations')) || [];
let filteredRecentDesignations = [];

// Recent companies management
let recentCompanies = JSON.parse(localStorage.getItem('recentCompanies') || '[]');
let filteredRecentCompanies = [...recentCompanies];

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

const suggestionSearch = document.getElementById('suggestionSearch');
const suggestionsList = document.getElementById('suggestionsList');
const recentSearch = document.getElementById('recentSearch');

// Load recent designations from localStorage
function loadRecentDesignations() {
    recentDesignations = JSON.parse(localStorage.getItem('recentDesignations')) || [];
    filteredRecentDesignations = [...recentDesignations];
}

// Add to recent designations
function addToRecent(designation) {
    // Remove if already exists
    recentDesignations = recentDesignations.filter(d => d.toLowerCase() !== designation.toLowerCase());
    
    // Add to beginning
    recentDesignations.unshift(designation);
    
    // Keep only last 50
    if (recentDesignations.length > 50) {
        recentDesignations = recentDesignations.slice(0, 50);
    }
    
    localStorage.setItem('recentDesignations', JSON.stringify(recentDesignations));
    
    // Update filtered list based on current search
    const searchTerm = document.getElementById('recentSearch').value.toLowerCase();
    if (!searchTerm) {
        filteredRecentDesignations = [...recentDesignations];
    } else {
        filteredRecentDesignations = recentDesignations.filter(d => 
            d.toLowerCase().includes(searchTerm)
        );
    }
    
    displayRecentDesignations();
}

// Filter recent designations
function filterRecentDesignations(searchTerm) {
    if (!searchTerm) {
        filteredRecentDesignations = [...recentDesignations];
    } else {
        filteredRecentDesignations = recentDesignations.filter(designation => 
            designation.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    currentRecentPage = 1;
    displayRecentDesignations();
}

// Display recent designations
function displayRecentDesignations() {
    const recentDesignationsList = document.getElementById('recentDesignationsList');
    const startIndex = (currentRecentPage - 1) * recentItemsPerPage;
    const endIndex = startIndex + recentItemsPerPage;
    const currentItems = filteredRecentDesignations.slice(startIndex, endIndex);
    
    if (currentItems.length === 0) {
        recentDesignationsList.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                <p>${filteredRecentDesignations.length === 0 ? 'No recent designations' : 'No more items'}</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    currentItems.forEach(designation => {
        html += `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 designation-item">
                <button onclick="addDesignationFromRecent('${designation}')" 
                        class="flex-1 text-left text-gray-700 hover:text-blue-600 transition-colors">
                    <div class="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        <span>${designation}</span>
                    </div>
                </button>
                <button onclick="deleteRecentDesignation('${designation}')" 
                        class="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-1 ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
    });
    
    // Add pagination for recent designations
    const totalPages = Math.ceil(filteredRecentDesignations.length / recentItemsPerPage);
    if (totalPages > 1) {
        html += `
            <div class="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                <button onclick="previousRecentPage()" 
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors ${currentRecentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                    Previous
                </button>
                <span>Page ${currentRecentPage} of ${totalPages}</span>
                <button onclick="nextRecentPage()" 
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors ${currentRecentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                    Next
                </button>
            </div>
        `;
    }
    
    recentDesignationsList.innerHTML = html;
}

// Recent designations pagination
function nextRecentPage() {
    const totalPages = Math.ceil(filteredRecentDesignations.length / recentItemsPerPage);
    if (currentRecentPage < totalPages) {
        currentRecentPage++;
        displayRecentDesignations();
    }
}

function previousRecentPage() {
    if (currentRecentPage > 1) {
        currentRecentPage--;
        displayRecentDesignations();
    }
}

// Add designation from recent
function addDesignationFromRecent(designation) {
    addDesignation(designation);
}

// Delete recent designation
function deleteRecentDesignation(designation) {
    recentDesignations = recentDesignations.filter(d => d !== designation);
    filteredRecentDesignations = filteredRecentDesignations.filter(d => d !== designation);
    localStorage.setItem('recentDesignations', JSON.stringify(recentDesignations));
    displayRecentDesignations();
    showNotification('Designation removed from recent list', 'info');
}

// Popular designations for suggestions
const popularDesignations = [
    "Chief Executive Officer", "Chief Technology Officer", "Chief Financial Officer", "Chief Marketing Officer", "Chief Operating Officer",
    "Software Engineer", "Senior Software Engineer", "Lead Software Engineer", "Principal Software Engineer", "Staff Software Engineer",
    "Product Manager", "Senior Product Manager", "Principal Product Manager", "VP of Product", "Head of Product",
    "Data Scientist", "Senior Data Scientist", "Lead Data Scientist", "Principal Data Scientist", "Chief Data Officer",
    "DevOps Engineer", "Senior DevOps Engineer", "Site Reliability Engineer", "Platform Engineer", "Cloud Architect",
    "UX Designer", "Senior UX Designer", "Lead UX Designer", "UX Researcher", "Design Director",
    "Frontend Developer", "Senior Frontend Developer", "Backend Developer", "Senior Backend Developer", "Full Stack Developer",
    "Mobile Developer", "iOS Developer", "Android Developer", "React Native Developer", "Flutter Developer",
    "QA Engineer", "Senior QA Engineer", "Test Automation Engineer", "QA Manager", "Quality Assurance Lead",
    "Business Analyst", "Senior Business Analyst", "Data Analyst", "Financial Analyst", "Marketing Analyst",
    "Sales Manager", "Senior Sales Manager", "Sales Director", "VP of Sales", "Head of Sales",
    "Marketing Manager", "Senior Marketing Manager", "Digital Marketing Manager", "Content Marketing Manager", "Growth Marketing Manager",
    "HR Manager", "Senior HR Manager", "HR Director", "VP of HR", "Head of HR",
    "Operations Manager", "Senior Operations Manager", "Operations Director", "VP of Operations", "Head of Operations",
    "Finance Manager", "Senior Finance Manager", "Finance Director", "VP of Finance", "Head of Finance",
    "Legal Counsel", "Senior Legal Counsel", "General Counsel", "Legal Director", "Compliance Manager",
    "Customer Success Manager", "Senior Customer Success Manager", "Customer Success Director", "VP of Customer Success", "Head of Customer Success",
    "Account Manager", "Senior Account Manager", "Key Account Manager", "Strategic Account Manager", "Enterprise Account Manager",
    "Project Manager", "Senior Project Manager", "Program Manager", "Senior Program Manager", "Portfolio Manager",
    "Scrum Master", "Agile Coach", "Product Owner", "Technical Product Manager", "Senior Technical Product Manager",
    "Security Engineer", "Senior Security Engineer", "Information Security Manager", "CISO", "Cybersecurity Analyst",
    "Network Engineer", "Senior Network Engineer", "Systems Administrator", "Senior Systems Administrator", "Infrastructure Engineer",
    "Database Administrator", "Senior Database Administrator", "Data Engineer", "Senior Data Engineer", "Big Data Engineer",
    "Machine Learning Engineer", "Senior Machine Learning Engineer", "AI Engineer", "Research Scientist", "Applied Scientist",
    "Technical Writer", "Senior Technical Writer", "Documentation Manager", "Content Strategist", "Technical Communications Manager"
];

// Initialize suggestions
let currentSuggestions = [...popularDesignations];

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
    currentPage = 1;
    displaySuggestions();
}

// Function to display suggestions
function displaySuggestions() {
    const start = (currentPage - 1) * itemsPerPage;
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
                ${currentPage > 1 ? `
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
    if (currentPage > 1) {
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
    saveRecentCompany(company); // Save to recent companies
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

// Function to clear all recent designations
function clearAllRecent() {
    if (recentDesignations.length === 0) {
        showNotification('No recent designations to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all recent designations?')) {
        recentDesignations = [];
        filteredRecentDesignations = [];
        localStorage.setItem('recentDesignations', JSON.stringify(recentDesignations));
        currentRecentPage = 1;
        displayRecentDesignations();
        showNotification('All recent designations cleared', 'success');
    }
}

// Function to prepare data for export
function prepareExportData() {
    if (!lastSearchResults) {
        showNotification('No search results to export', 'error');
        return null;
    }

    const data = [];
    
    // Add header row
    data.push(['Company', 'Designation', 'LinkedIn Profile']);
    
    // Add data rows
    lastSearchResults.Companies.forEach(companyResult => {
        Object.entries(companyResult.Designations).forEach(([designation, profiles]) => {
            profiles.forEach(profile => {
                data.push([companyResult.CompanyName, designation, profile]);
            });
        });
    });

    return data;
}

// Function to export all results to CSV (Global export)
function exportAllToCSV() {
    const data = prepareExportData();
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    data.forEach(row => {
        const csvRow = row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma or quotes
            const escaped = cell.replace(/"/g, '""');
            return /[,"]/.test(cell) ? `"${escaped}"` : cell;
        }).join(',');
        csvContent += csvRow + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `linkedin_profiles_all_results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('All results exported to CSV successfully', 'success');
}



// Function to export to CSV (Individual company - for hover buttons)
function exportToCSV() {
    const data = prepareExportData();
    if (!data) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    data.forEach(row => {
        const csvRow = row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma or quotes
            const escaped = cell.replace(/"/g, '""');
            return /[,"]/.test(cell) ? `"${escaped}"` : cell;
        }).join(',');
        csvContent += csvRow + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `linkedin_profiles_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('CSV file exported successfully', 'success');
}



// Make functions available globally
window.toggleSuggestion = toggleSuggestion;
window.loadMore = loadMore;
window.previousPage = previousPage;
window.nextRecentPage = nextRecentPage;
window.previousRecentPage = previousRecentPage;
window.clearAllRecent = clearAllRecent;
window.deleteRecentDesignation = deleteRecentDesignation;
window.addDesignationFromRecent = addDesignationFromRecent;
window.exportToCSV = exportToCSV;
window.exportAllToCSV = exportAllToCSV;
window.selectRecentCompany = selectRecentCompany;
window.deleteRecentCompany = deleteRecentCompany;
window.nextRecentCompanyPage = nextRecentCompanyPage;
window.previousRecentCompanyPage = previousRecentCompanyPage;
window.clearAllRecentCompanies = clearAllRecentCompanies;

// Update the display results section to include company-specific export buttons
function updateResults(results) {
    const resultsDiv = document.getElementById('results');
    let resultsHTML = `
        <div class="animate-fade-in">
            <h2 class="text-xl font-semibold mb-6 pb-2 border-b">Search Results</h2>
    `;
    
    // Array of gradient backgrounds for different companies
    const companyBackgrounds = [
        'bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500',
        'bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-green-500',
        'bg-gradient-to-br from-purple-50 to-violet-100 border-l-4 border-purple-500',
        'bg-gradient-to-br from-pink-50 to-rose-100 border-l-4 border-pink-500',
        'bg-gradient-to-br from-yellow-50 to-amber-100 border-l-4 border-yellow-500',
        'bg-gradient-to-br from-cyan-50 to-teal-100 border-l-4 border-cyan-500',
        'bg-gradient-to-br from-orange-50 to-red-100 border-l-4 border-orange-500',
        'bg-gradient-to-br from-slate-50 to-gray-100 border-l-4 border-slate-500'
    ];
    
    results.Companies.forEach((companyResult, index) => {
        const backgroundClass = companyBackgrounds[index % companyBackgrounds.length];
        
        resultsHTML += `
            <div class="mb-8 ${backgroundClass} rounded-xl p-6 shadow-lg border backdrop-blur-sm">
                <div class="flex items-center space-x-3 mb-6">
                    <div class="p-2 bg-white rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800">${companyResult.CompanyName}</h3>
                </div>
        `;
        
        Object.entries(companyResult.Designations).forEach(([designation, profiles]) => {
            resultsHTML += `
                <div class="mb-6 animate-fade-in">
                    <div class="flex items-center space-x-2 mb-3">
                        <div class="p-1.5 bg-white rounded-md shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <h4 class="text-md font-semibold text-gray-800">${designation}</h4>
                        <span class="text-sm text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm font-medium">
                            ${profiles.length} profile${profiles.length !== 1 ? 's' : ''} found
                        </span>
                    </div>
                    ${profiles.length > 0 
                        ? `<div class="bg-white rounded-lg shadow-md border border-gray-200 p-4 ml-8">
                            <ul class="space-y-3">
                                ${profiles.map(profile => `
                                    <li class="hover:bg-gray-50 p-3 rounded-lg transition-colors border border-gray-100 hover:border-gray-200 hover:shadow-sm">
                                        <a href="${profile}" target="_blank" 
                                           class="text-blue-600 hover:text-blue-800 flex items-center space-x-3 font-medium">
                                            <div class="p-1.5 bg-blue-50 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                </svg>
                                            </div>
                                            <span class="break-all">${profile}</span>
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                           </div>`
                        : '<div class="ml-8"><p class="text-gray-500 italic bg-white p-4 rounded-lg border border-gray-200 shadow-sm">No profiles found</p></div>'
                    }
                </div>
            `;
        });
        
        resultsHTML += '</div>';
    });

    resultsHTML += '</div>';
    resultsDiv.innerHTML = resultsHTML;
}

// Sleep function removed - no longer needed without rate limiting

// Function to make API call without rate limiting
async function makeSearchRequest(company, designations, resultCount, retryCount = 3) {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.log(`Attempt ${attempt}/${retryCount} failed for ${company}:`, error.message);
            if (attempt === retryCount) {
                throw error;
            }
        }
    }
    throw new Error(`Failed to fetch data for ${company} after ${retryCount} attempts`);
}

// Update the search form submission to use parallel processing without rate limiting
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
        <div class="flex flex-col items-center justify-center space-y-4 text-gray-600">
            <div class="flex items-center space-x-3">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Initializing search...</span>
            </div>
            <div class="text-sm text-gray-500">
                Processing requests at full speed
            </div>
        </div>
    `;

    // Hide sticky export bar while searching
    document.getElementById('stickyExportBar').style.display = 'none';

    // Scroll down to show the results area
    resultsDiv.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });

    try {
        const companiesArray = Array.from(companies);
        const results = [];
        let successCount = 0;
        let failureCount = 0;

        // Parallel API calls for faster processing
        const promises = companiesArray.map(async (company, index) => {
            try {
                resultsDiv.innerHTML = `
                    <div class="flex flex-col items-center justify-center space-y-4 text-gray-600">
                        <div class="flex items-center space-x-3">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Searching profiles... Please wait.</span>
                        </div>
                        <div class="text-sm text-gray-500">
                            Processing all companies simultaneously for faster results
                        </div>
                        <div class="text-xs text-gray-400">
                            Companies: ${companiesArray.join(', ')}
                        </div>
                    </div>
                `;

                const result = await makeSearchRequest(company, designations, resultCount);
                return { company, result, success: true };

            } catch (error) {
                console.error(`Error processing company ${company}:`, error);
                showNotification(`Error processing ${company}. Continuing with other companies.`, 'error');
                return { company, result: { Designations: {} }, success: false };
            }
        });

        const allResults = await Promise.all(promises);
        
        // Process results
        allResults.forEach(({ company, result, success }) => {
            results.push(result);
            if (success) {
                successCount++;
            } else {
                failureCount++;
            }
        });
        
        lastSearchResults = {
            Companies: results.map((result, index) => ({
                CompanyName: companiesArray[index],
                Designations: result.Designations
            }))
        };
        
        updateResults(lastSearchResults);

        // Show sticky export bar if there are results
        if (lastSearchResults.Companies.some(company => 
            Object.values(company.Designations).some(profiles => profiles.length > 0))) {
            document.getElementById('stickyExportBar').style.display = 'block';
        }

        const totalProcessed = successCount + failureCount;
        showNotification(
            `Search completed. Successfully processed ${successCount} out of ${totalProcessed} companies.`,
            successCount === totalProcessed ? 'success' : 'warning'
        );
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

// Validate result count input
resultCountInput.addEventListener('change', () => {
    let value = parseInt(resultCountInput.value);
    if (value < 1) resultCountInput.value = 1;
    if (value > 100) resultCountInput.value = 100;
});

// Add search event listener for recent designations
recentSearch.addEventListener('input', (e) => {
    filterRecentDesignations(e.target.value);
});

// Load recent designations on startup
loadRecentDesignations();
displayRecentDesignations();

// Recent companies functionality
function saveRecentCompany(company) {
    if (!company || company.trim() === '') return;
    
    company = company.trim();
    
    // Remove if already exists
    recentCompanies = recentCompanies.filter(c => c.toLowerCase() !== company.toLowerCase());
    
    // Add to beginning
    recentCompanies.unshift(company);
    
    // Keep only last 50
    if (recentCompanies.length > 50) {
        recentCompanies = recentCompanies.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('recentCompanies', JSON.stringify(recentCompanies));
    
    // Update filtered list
    filteredRecentCompanies = [...recentCompanies];
    displayRecentCompanies();
}

function loadRecentCompanies() {
    recentCompanies = JSON.parse(localStorage.getItem('recentCompanies')) || [];
    filteredRecentCompanies = [...recentCompanies];
}

function displayRecentCompanies() {
    const recentCompaniesList = document.getElementById('recentCompaniesList');
    const startIndex = (currentRecentCompanyPage - 1) * recentItemsPerPage;
    const endIndex = startIndex + recentItemsPerPage;
    const currentItems = filteredRecentCompanies.slice(startIndex, endIndex);
    
    if (currentItems.length === 0) {
        recentCompaniesList.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                <p>No recent companies</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    currentItems.forEach((company, index) => {
        html += `
            <div class="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-200 hover:border-blue-300">
                <span onclick="selectRecentCompany('${company.replace(/'/g, "\\'")}')" 
                      class="flex-1 text-gray-700 hover:text-blue-600 font-medium">
                    ${company}
                </span>
                <button onclick="deleteRecentCompany(${startIndex + index})" 
                        class="text-red-500 hover:text-red-700 ml-2 p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
    });
    
    // Add pagination for recent companies
    const totalPages = Math.ceil(filteredRecentCompanies.length / recentItemsPerPage);
    if (totalPages > 1) {
        html += `
            <div class="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                <button onclick="previousRecentCompanyPage()" 
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors ${currentRecentCompanyPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
                    Previous
                </button>
                <span>Page ${currentRecentCompanyPage} of ${totalPages}</span>
                <button onclick="nextRecentCompanyPage()" 
                        class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors ${currentRecentCompanyPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}">
                    Next
                </button>
            </div>
        `;
    }
    
    recentCompaniesList.innerHTML = html;
}

function selectRecentCompany(company) {
    addCompany(company);
}

function deleteRecentCompany(index) {
    const actualIndex = recentCompanies.findIndex(company => 
        company === filteredRecentCompanies[index]
    );
    
    if (actualIndex !== -1) {
        recentCompanies.splice(actualIndex, 1);
        localStorage.setItem('recentCompanies', JSON.stringify(recentCompanies));
        
        // Update filtered list
        const searchTerm = document.getElementById('recentCompanySearch').value.toLowerCase();
        filteredRecentCompanies = recentCompanies.filter(company =>
            company.toLowerCase().includes(searchTerm)
        );
        
        // Adjust page if necessary
        const totalPages = Math.ceil(filteredRecentCompanies.length / recentItemsPerPage);
        if (currentRecentCompanyPage > totalPages && totalPages > 0) {
            currentRecentCompanyPage = totalPages;
        } else if (filteredRecentCompanies.length === 0) {
            currentRecentCompanyPage = 1;
        }
        
        displayRecentCompanies();
        showNotification('Company removed from recent list', 'success');
    }
}

// Recent companies pagination
function nextRecentCompanyPage() {
    const totalPages = Math.ceil(filteredRecentCompanies.length / recentItemsPerPage);
    if (currentRecentCompanyPage < totalPages) {
        currentRecentCompanyPage++;
        displayRecentCompanies();
    }
}

function previousRecentCompanyPage() {
    if (currentRecentCompanyPage > 1) {
        currentRecentCompanyPage--;
        displayRecentCompanies();
    }
}

// Search recent companies
document.getElementById('recentCompanySearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredRecentCompanies = recentCompanies.filter(company =>
        company.toLowerCase().includes(searchTerm)
    );
    currentRecentCompanyPage = 1;
    displayRecentCompanies();
});

function clearAllRecentCompanies() {
    if (recentCompanies.length === 0) {
        showNotification('No recent companies to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear all recent companies?')) {
        recentCompanies = [];
        filteredRecentCompanies = [];
        localStorage.setItem('recentCompanies', JSON.stringify(recentCompanies));
        currentRecentCompanyPage = 1;
        displayRecentCompanies();
        showNotification('All recent companies cleared', 'success');
    }
}

// Load recent companies on startup
loadRecentCompanies();
displayRecentCompanies(); 