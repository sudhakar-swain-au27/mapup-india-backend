import csv from 'csv-parser';
import fs from 'fs';

export const parseCSV = (filePath, callback) => {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => callback(null, results))
    .on('error', (error) => callback(error, null));
};
