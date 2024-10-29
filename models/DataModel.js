import mongoose from 'mongoose';

/**
 * @constant dataSchema - Mongoose schema for storing financial data
 * @property {Date} date - The date of the data entry, validated and indexed for efficient querying
 * @property {Number} open - The opening price, validated as a number
 * @property {Number} high - The highest price, validated as a number
 * @property {Number} low - The lowest price, validated as a number
 * @property {Number} close - The closing price, validated as a number
 * @property {Number} volume - The volume of trades, validated and indexed for efficient querying
 * @property {Number} openInt - The open interest, validated as a number
 */
const dataSchema = new mongoose.Schema({
  date: {
    type: Date,
    validate: {
      validator: (v) => v === null || !isNaN(Date.parse(v)),
      message: (props) => `${props.value} is not a valid date`,
    },
    index: true,
  },
  open: {
    type: Number,
    validate: {
      validator: (v) => v === null || typeof v === 'number',
      message: (props) => `${props.value} is not a valid number`,
    },
  },
  high: {
    type: Number,
    validate: {
      validator: (v) => v === null || typeof v === 'number',
      message: (props) => `${props.value} is not a valid number`,
    },
  },
  low: {
    type: Number,
    validate: {
      validator: (v) => v === null || typeof v === 'number',
      message: (props) => `${props.value} is not a valid number`,
    },
  },
  close: {
    type: Number,
    validate: {
      validator: (v) => v === null || typeof v === 'number',
      message: (props) => `${props.value} is not a valid number`,
    },
  },
  volume: {
    type: Number,
    validate: {
      validator: (v) => v === null || typeof v === 'number',
      message: (props) => `${props.value} is not a valid number`,
    },
    index: true,
  },
  openInt: {
    type: Number,
    validate: {
      validator: (v) => v === null || typeof v === 'number',
      message: (props) => `${props.value} is not a valid number`,
    },
  },
});

/**
 * Defines compound index on date (ascending) and volume (descending) for optimized queries
 */
dataSchema.index({ date: 1, volume: -1 });

export default mongoose.model('Data', dataSchema);
