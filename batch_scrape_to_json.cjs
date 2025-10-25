const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CSV_PATH = path.join(__dirname, '..', 'gform.csv');
const SCRAPER_PATH = path.join(__dirname, '..', 'scraper.py');
const OUTPUT_PATH = path.join(__dirname, '..', 'scraped_data.json');

async function main() {
    const allProfiles = [];
    try {
        const csvData = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parse(csvData, {
            // columns: true, // Disable header detection
            skip_empty_lines: true,
            from_line: 2 // Start parsing from the second line to skip the header
        });

        console.log(`Found ${records.length} profiles to scrape.`);

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const name = record[4]; // 5th column is 'Your Full Name'
            const url = record[10]; // 11th column is the URL

            if (!url || !url.startsWith('http')) {
                console.warn(`Skipping row ${i + 2} due to invalid or missing URL: ${url}`);
                continue;
            }

            console.log(`[${i + 1}/${records.length}] Scraping ${name ? name.trim() : 'Unknown Name'}...`);

            try {
                // Pass CSV name to scraper as fallback
                const profileData = await scrapeProfile(url.trim(), name ? name.trim() : '');
                if (profileData) {
                    allProfiles.push(profileData);
                    console.log(`  -> Scraped ${profileData.name} with ${profileData.badges.length} badges.`);
                }
            } catch (error) {
                console.error(`  -> Failed to scrape ${name ? name.trim() : url}:`, error.message);
            }
        }

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    } finally {
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allProfiles, null, 2));
        console.log(`\nScraping complete. All data saved to ${OUTPUT_PATH}`);
        console.log(`Successfully scraped ${allProfiles.length} profiles.`);
    }
}

function scrapeProfile(url, csvName = '') {
    return new Promise((resolve, reject) => {
        // Pass CSV name as second argument to Python scraper
        const pythonProcess = spawn('py', ['-3', SCRAPER_PATH, url, csvName]);

        let data = '';
        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        let error = '';
        pythonProcess.stderr.on('data', (chunk) => {
            error += chunk.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Scraper exited with code ${code}: ${error}`));
            }
            try {
                const profile = JSON.parse(data);
                resolve(profile);
            } catch (e) {
                reject(new Error(`Failed to parse JSON from scraper: ${e.message}. Raw output: ${data}`));
            }
        });
    });
}

main();
