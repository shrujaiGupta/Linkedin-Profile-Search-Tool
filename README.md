# LinkedIn Profile Finder

A web application that helps find LinkedIn profiles based on company names and designations using Google Search.

## Features

- Dynamic addition of designations
- Company-based LinkedIn profile search
- Results saved as JSON files
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js >= 14.0.0
- A SerpApi API key (from https://serpapi.com)

## Local Development

1. Clone the repository
2. Create a `.env` file in the root directory with:
   ```
   PORT=3000
   SERP_API_KEY=your_serp_api_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser

## Deployment on Render

1. Create a new account on [Render](https://render.com)
2. Click on "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: linkedin-profile-finder (or your preferred name)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   - SERP_API_KEY: your_serp_api_key
6. Click "Create Web Service"

The application will be deployed and available at the URL provided by Render.

## Environment Variables

- `PORT`: The port number for the server (default: 3000)
- `SERP_API_KEY`: Your SerpApi API key (required)

## Usage

1. Enter a company name
2. Add desired designations
3. Click "Search Profiles"
4. View and click on found LinkedIn profiles
5. Results are saved in the `results` directory

## Security Notes

- Never commit your `.env` file
- Keep your SERP_API_KEY secure
- The application uses HTTPS for API calls

## License

MIT 