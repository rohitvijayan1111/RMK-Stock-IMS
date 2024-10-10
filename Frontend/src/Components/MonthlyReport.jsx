import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import Logo from '../assets/Logo.png';
import { HashLoader } from 'react-spinners';

const Container = styled.div`
  @media print {
    margin: 20px;
  }

  h1 {
    color: #164863;
    text-align: center;
  }
    height:100%
`;


const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  table-layout: fixed;

  th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    overflow-wrap: break-word;
    word-break: break-word;
    font-size: 18px;
  }

  th {
    background-color: #164863;
    color: white;
    font-size: 15px;
    font-weight: bold;
  }

  tbody tr {
    background-color: #f9f9f9;
  }

  tbody tr:nth-child(even) {
    background-color: #f1f1f1;
  }

  tbody tr:hover {
    background-color: #e0f7fa;
    color: #000;
  }

  td input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 14px;
    width: 90%;
  }

  td select {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px;
    font-size: 12px;
    min-width: 180px;
  }

  .sno {
    min-width: 50px;
  }

  @media print {
    th, td {
      font-size: 7px; 
    }
  }
`;

const DateRange = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 20px;
  }
`;

const PrintHeader = styled.div`
  display: none;
  text-align: center;
  margin-bottom: 20px;

  img {
    width: 150px;
    height: auto;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 30px;
  }

  @media print {
    display: block;
  }
`;

export const MonthlyReport = React.forwardRef(({ fromDate, toDate }, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get(`${import.meta.env.VITE_RMK_MESS_URL}/monthly/report`, {
      params: {
        fdate: fromDate,
        tdate: toDate
      }
    })
    .then(res => {
      setData(res.data || []); 
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching report data:", err);
      setLoading(false);
    });
  }, [fromDate, toDate]);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}>
        <HashLoader color="#164863" loading={loading} size={90} />
      </div>
    );
  }
  const purchaseTotal = data.reduce((acc, row) => acc + row.purchaseAmount, 0).toFixed(2);
  const rmkTotal = data.reduce((acc, row) => acc + (row.RMK * row.unitPrice), 0).toFixed(2);
  const rmdTotal = data.reduce((acc, row) => acc + (row.RMD * row.unitPrice), 0).toFixed(2);
  const rmkcetTotal = data.reduce((acc, row) => acc + (row.RMKCET * row.unitPrice), 0).toFixed(2);
  const schoolTotal = data.reduce((acc, row) => acc + (row.RMKSCHOOL * row.unitPrice), 0).toFixed(2);
  const issueTotalAmount = data.reduce((acc, row) => acc + ((row.RMK + row.RMD + row.RMKCET + row.RMKSCHOOL) * row.unitPrice), 0).toFixed(2);


  return (
    <Container ref={ref} className="print-container">
      <PrintHeader>
        <div className="content">
          <img src={Logo} alt="Logo" />
          <h1>FOOD MANAGEMENT</h1>
        </div>
      </PrintHeader>
      <h1>Monthly Report</h1>
      <DateRange>
        <h2>From: {fromDate}</h2>
        <h2>To: {toDate}</h2>
      </DateRange>
      <ItemTable>
        <thead>
          <tr>
            <th>Item Name</th>
            <th colSpan="2">Opening Stock</th>
            <th colSpan="2">Purchase</th>
            <th colSpan="2">Total</th>
            <th colSpan="2">RMK</th>
            <th colSpan="2">RMD</th>
            <th colSpan="2">RMKCET</th>
            <th colSpan="2">School</th>
            <th colSpan="2">Issue Total</th>
            <th colSpan="2">Closing Stock</th>
          </tr>
          <tr>
            <th></th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amt</th>
            <th>Qty</th>
            <th>Amt</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => {
              const totalQuantity = row.purchaseQuantity + row.openingStock;
              const totalAmount = row.purchaseAmount + row.avgPreviousMonthAmount;
              const issueQuantity = row.RMK + row.RMD + row.RMKCET + row.RMKSCHOOL;
              const issueAmount = (row.RMK + row.RMD + row.RMKCET + row.RMKSCHOOL) * row.unitPrice;
              const closingQuantity = totalQuantity - issueQuantity>0?totalQuantity - issueQuantity:0;
              const closingAmount = totalAmount - issueAmount>0?totalAmount - issueAmount:0;
              return (
                <tr key={index}>
                  <td>{row.item}</td>
                  <td>{row.openingStock}</td>
                  <td>{row.avgPreviousMonthAmount.toFixed(2)}</td>
                  <td>{row.purchaseQuantity}</td>
                  <td>{row.purchaseAmount.toFixed(2)}</td>
                  <td>{totalQuantity}</td>
                  <td>{totalAmount.toFixed(2)}</td>
                  <td>{row.RMK}</td>
                  <td>{(row.RMK * row.unitPrice).toFixed(2)}</td>
                  <td>{row.RMD}</td>
                  <td>{(row.RMD * row.unitPrice).toFixed(2)}</td>
                  <td>{row.RMKCET}</td>
                  <td>{(row.RMKCET * row.unitPrice).toFixed(2)}</td>
                  <td>{row.RMKSCHOOL}</td>
                  <td>{(row.RMKSCHOOL * row.unitPrice).toFixed(2)}</td>
                  <td>{issueQuantity}</td>
                  <td>{issueAmount.toFixed(2)}</td>
                  <td>{closingQuantity}</td>
                  <td>{closingAmount.toFixed(2)}</td>
                </tr>
                
              );
            })
          ) : (
            <tr><td colSpan="20">No data available</td></tr>
          )}
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td><strong>{purchaseTotal}</strong></td>
            <td></td>
            <td></td>
            <td><strong>{rmkTotal}</strong></td>
            <td></td>
            <td><strong>{rmdTotal}</strong></td>
            <td></td>
            <td><strong>{rmkcetTotal}</strong></td>
            <td></td>
            <td><strong>{schoolTotal}</strong></td>
            <td></td>
            <td><strong>{issueTotalAmount}</strong></td>

          </tr>

        </tbody>
      </ItemTable>
      </Container>
  );
});