const fs = require("fs");
const path = require("path");

// Define the root directory and the target folder based on the working directory
const rootDir = path.join(process.cwd(), "apps/api/src"); // Starting from "apps/api/src" specifically
const outputFilePath = path.join(process.cwd(), "combinedOutput.txt");

// Define the prefix to remove from paths
const pathPrefixToRemove = path.join(process.cwd());

// Check if rootDir exists
if (!fs.existsSync(rootDir)) {
  console.error(`Directory not found: ${rootDir}`);
  process.exit(1);
}

// Clear or create the output file
fs.writeFileSync(outputFilePath, "", "utf8");

// Function to traverse folders and process files
function traverseAndCombine(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      // Recursive call if it's a directory
      traverseAndCombine(filePath);
    } else if (
      fileStat.isFile() &&
      path.extname(file) === ".ts" && // Only .ts files
      file !== "jest.config.ts" && // Exclude jest.config.ts
      file !== "test-setup.ts" // Exclude test-setup.ts
    ) {
      // Remove the prefix from the file path
      const relativeFilePath = filePath.replace(pathPrefixToRemove, "");
      const fileContent = fs.readFileSync(filePath, "utf8");
      fs.appendFileSync(outputFilePath, `\n// File: ${relativeFilePath}\n`);
      fs.appendFileSync(outputFilePath, fileContent + "\n");
    }
  });
}

// Start traversing from the root directory
traverseAndCombine(rootDir);

console.log(`All relevant .ts files combined into ${outputFilePath}`);
