document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const amount = document.getElementById('amount').value;
      const fromCurrency = document.getElementById('fromCurrency').value;
      const toCurrency = document.getElementById('toCurrency').value;
  
      try {
        const response = await fetch(`/convert?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`);
        const data = await response.json();
  
        resultDiv.innerHTML = `${amount} ${fromCurrency} is approximately ${data.convertedAmount.toFixed(2)} ${toCurrency}`;
      } catch (error) {
        console.error(error);
        resultDiv.innerHTML = 'An error occurred';
      }
    });

    const historyButton = document.getElementById('history-button');
    const historyTable = document.getElementById('history-table');



    historyButton.addEventListener('click', async () => {
      try {
        const response = await fetch('/history');
        const data = await response.json();
  
        let historyHTML = '<h2>Conversion History</h2><table>';
        historyHTML += '<tr><th>From Currency</th><th>To Currency</th><th>Amount</th><th>Converted Amount</th><th>Timing</th></tr>';
  
        data.forEach(item => {
          historyHTML += 
            `<tr>
              <td>${item.from_currency}</td>
              <td>${item.to_currency}</td>
              <td>${item.amount}</td>
              <td>${item.converted_amount}</td>
              <td>${new Date(item.created_at).toLocaleString()}</td>
            </tr>`;
        });
  
        historyHTML += '</table>';
        historyTable.innerHTML = historyHTML;
      } catch (error) {
        console.error(error);
        historyTable.innerHTML = 'An error occurred';
      }
    });
  });
  