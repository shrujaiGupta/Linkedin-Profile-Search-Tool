const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// SerpApi key from environment variable
const SERP_API_KEY = process.env.SERP_API_KEY;

// Create a custom axios instance with SSL verification disabled
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

app.use(express.json());
app.use(express.static('.'));

// Function to search LinkedIn profiles
async function searchProfiles(designation, company) {
    try {
        if (!SERP_API_KEY) {
            throw new Error('SERP_API_KEY is not configured');
        }

        const query = `${designation} ${company} site:linkedin.com/in`;
        const response = await axiosInstance.get('https://serpapi.com/search', {
            params: {
                api_key: SERP_API_KEY,
                engine: 'google',
                q: query,
                num: 10
            }
        });

        const profiles = response.data.organic_results
            ? response.data.organic_results
                .filter(result => result.link.includes('linkedin.com/in'))
                .map(result => result.link)
            : [];

        return profiles;
    } catch (error) {
        console.error(`Error searching for ${designation} at ${company}:`, error.message);
        return [];
    }
}

app.post('/search', async (req, res) => {
    try {
        const { company, designations } = req.body;

        // Initialize results structure
        const results = {
            CompanyName: company,
            Designations: {}
        };

        // Search for each designation
        for (const designation of designations) {
            const profiles = await searchProfiles(designation, company);
            results.Designations[designation] = profiles;
        }

        // Save results to file
        const resultsDir = path.join(__dirname, 'results');
        await fs.mkdir(resultsDir, { recursive: true });
        
        const fileName = `results_${company.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
        await fs.writeFile(
            path.join(resultsDir, fileName),
            JSON.stringify(results, null, 2)
        );

        res.json(results);
    } catch (error) {
        console.error('Error processing search request:', error);
        res.status(500).json({ error: 'An error occurred while searching profiles' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 