import React, { useState } from 'react'

export default function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', direction: 'rtl', padding: '50px' }}>
      <h1 style={{ color: '#2563eb' }}>ניהול ההוצאות שלי 💰</h1>
      <p>התשתית מוכנה בהצלחה! הענן מחובר ו-Vercel מעדכן את האתר.</p>
      <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
        <h3>בקרוב נוסיף כאן:</h3>
        <p>📊 מעקב אחרי הוצאות והכנסות</p>
        <p>➕ הוספת פעולות חדשות בקלות</p>
      </div>
    </div>
  )
}
