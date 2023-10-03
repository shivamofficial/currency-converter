const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:AShiv@localhost:5432/currency_converter'
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/convert', async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.query;

  try {
    const conversionRate = getConversionRate(fromCurrency, toCurrency);
    const convertedAmount = parseFloat(amount) * conversionRate;

    const query = {
      text: 'INSERT INTO conversions (from_currency, to_currency, amount, converted_amount) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [fromCurrency, toCurrency, amount, convertedAmount]
    };
    const result = await pool.query(query);

    res.json({ convertedAmount, id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function getConversionRate(fromCurrency, toCurrency) {
  const conversionRates = {
    USD: {
      EUR: 0.92,
      USD: 1,
    },
    EUR: {
      USD: 1.09,
      EUR: 1,
    },
  };

  if (fromCurrency in conversionRates && toCurrency in conversionRates[fromCurrency]) {
    return conversionRates[fromCurrency][toCurrency];
  } else {
    throw new Error('Conversion rate not found');
  }
}

app.get('/history', async (req, res) => {
  try {
    const query = 'SELECT * FROM conversions ORDER BY created_at DESC';
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
