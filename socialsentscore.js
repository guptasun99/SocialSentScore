const fs = require('fs');

// Global Social Sentiment Scores table
const SSS = {};

function buildSocialSentimentTable(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const lines = data.split('\n');
        for (const line of lines) {
            const parts = line.trim().split(',');
            if (parts.length >= 2) {
                const word = parts[0];
                const score = parseFloat(parts[1]);
                if (!isNaN(score)) {
                    SSS[word] = score;
                } else {
                    console.log(`Skipping invalid score in line: ${line.trim()}`);
                }
            } else if (line.trim()) {
                console.log(`Skipping malformed line: ${line.trim()}`);
            }
        }
    } catch (err) {
        console.error(`Error: ${filename} not found or unreadable.`);
        process.exit(1);
    }
}

function getSocialSentimentScore(reviewFilename) {
    let totalScore = 0.0;
    try {
        const text = fs.readFileSync(reviewFilename, 'utf8');
        // Tokenize on word boundaries, ignoring punctuation and whitespace
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        for (const word of words) {
            const score = SSS[word] || 0.0; // Default to 0 if word not in SSS
            totalScore += score;
            console.log(`${word}: ${score.toFixed(2)}, ${totalScore.toFixed(2)}`);
        }
        return totalScore;
    } catch (err) {
        console.error(`Error: ${reviewFilename} not found or unreadable.`);
        process.exit(1);
    }
}

function getStarRating(score) {
    if (score < -5.0) return 1;
    else if (score >= -5.0 && score < -1.0) return 2;
    else if (score >= -1.0 && score < 1.0) return 3;
    else if (score >= 1.0 && score < 5.0) return 4;
    else return 5; // score >= 5.0
}

function main() {
    // Handle command-line argument
    const reviewFile = process.argv[2] || 'review.txt'; // Default to review.txt

    // Build sentiment table
    buildSocialSentimentTable('socialsent.csv');

    // Process review file and calculate score
    console.log('[word: current_score, accumulated_score]');
    const finalScore = getSocialSentimentScore(reviewFile);

    // Calculate and display star rating
    const stars = getStarRating(finalScore);
    console.log(`\n${reviewFile} score: ${finalScore.toFixed(2)}`);
    console.log(`${reviewFile} Stars: ${stars}`);
}

// Run the program
main();