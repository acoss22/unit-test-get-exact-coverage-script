const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the path to the coverage summary JSON file
const coverageSummaryPath = "./coverage/coverage-summary.json";

/**
 * Calculates and logs the total coverage percentage.
 */
function calculateCoverage() {
  if (!fs.existsSync(coverageSummaryPath)) {
    console.error('Error: Coverage summary file does not exist. Ensure Jest has been run with coverage enabled.');
    process.exit(1);
  }

  const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
  let totalSum = 0;
  let coveredSum = 0;

  Object.values(coverageSummary).forEach(file => {
    ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
      totalSum += file[metric].total;
      coveredSum += file[metric].covered;
    });
  });

  const coveragePercentage = (coveredSum / totalSum) * 100;
  console.log(`Total Coverage: ${coveragePercentage.toFixed(2)}%`);
}

/**
 * Runs the Jest coverage command and then calculates coverage.
 */
function runCoverageAndCalculate() {
  console.log('Running Jest coverage...');
  exec('npm run test -- --coverage', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Jest: ${error}`);
      return;
    }

    console.log(stdout);
    if (stderr) {
      console.error(`Jest stderr: ${stderr}`);
    }

    // Calculate the coverage after Jest has successfully run
    calculateCoverage();
  });
}

// Start the process by running Jest coverage first, then calculate the total coverage percentage
runCoverageAndCalculate();