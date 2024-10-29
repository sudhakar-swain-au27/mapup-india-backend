import fs from 'fs';
import csvParser from 'csv-parser';
import DataModel from '../models/DataModel.js';

const parseDate = (dateStr) => (dateStr && !isNaN(Date.parse(dateStr)) ? new Date(dateStr) : null);
const parseNumber = (numStr) => (numStr && !isNaN(parseFloat(numStr)) ? parseFloat(numStr) : null);

/**
 * @function uploadCSVStream - Processes and uploads CSV data in batches to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadCSVStream = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const batchSize = 1000;
  let processingError = null;

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const filePath = file.path;
      let batch = [];
      const readStream = fs.createReadStream(filePath).pipe(csvParser());

      readStream.on('data', (row) => {
        const formattedRow = {
          date: parseDate(row.Date),
          open: parseNumber(row.Open),
          high: parseNumber(row.High),
          low: parseNumber(row.Low),
          close: parseNumber(row.Close),
          volume: parseNumber(row.Volume),
          openInt: parseNumber(row.OpenInt),
        };
        batch.push(formattedRow);

        if (batch.length >= batchSize) {
          readStream.pause();
          DataModel.insertMany(batch)
            .then(() => {
              batch = [];
              readStream.resume();
            })
            .catch((error) => {
              processingError = error;
              readStream.destroy();
              reject(new Error('Error processing file data'));
            });
        }
      });

      readStream.on('end', async () => {
        if (processingError) return reject(processingError);

        if (batch.length > 0) {
          try {
            await DataModel.insertMany(batch);
          } catch (error) {
            return reject(new Error('Error processing final batch'));
          }
        }
        fs.unlinkSync(filePath);
        resolve();
      });

      readStream.on('error', (error) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(new Error('Error reading file'));
      });
    });
  };

  try {
    await Promise.all(req.files.map((file) => processFile(file)));
    res.status(200).json({ message: 'All files processed and data saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @function getPaginatedData - Retrieves all data from the database and returns it in a paginated format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPaginatedData = async (req, res) => {
  try {
    const data = await DataModel.find().sort({ date: -1 });
    res.status(200).json({
      data,
      totalRecords: data.length,
    });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
};
