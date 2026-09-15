import React, { useState } from 'react';

// === הגדרות שערי חליפין (יחסי לדולר) ===
const exchangeRates = {
  USD: 1.0, ILS: 3.70, EUR: 0.92, GBP: 0.78, CAD: 1.36, 
  AUD: 1.52, JPY: 155.0, CNY: 7.23, RUB: 90.0, BRL: 5.40, CHF: 0.90
};

// === מערכת תרגומים (11 שפות) ===
const translations = {
  en: {
    appTitle: "Nest Budget",
    totalSavings: "Total Savings Goal",
    monthlyDebitTotal: "Total Standing Orders",
    couplePlan: "Couple Account Active",
    autoMonthly: "Auto-deducted monthly",
    addGoalTitle: "Define Savings & Standing Order",
    goalNameLabel: "Savings Goal Name",
    targetAmountLabel: "Target Amount",
    targetDateLabel: "Target Date",
    enableStandingOrder: "Enable Standing Order (Direct Debit)",
    monthlyDebitLabel: "Monthly Amount",
    debitEndDateLabel: "Standing Order End Date",
    saveGoalBtn: "Create Savings Plan",
    tabDashboard: "Dashboard",
    tabGoals: "Savings",
    tabDebits: "Standing Orders",
    noDebit: "Manual Savings"
  },
  he: {
    appTitle: "Nest Budget (תקציב זוגי)",
    totalSavings: "סה״כ יעד חיסכון",
    monthlyDebitTotal: "סה״כ הוראות קבע",
    couplePlan: "חשבון זוגי מחובר",
    autoMonthly: "יורד אוטומטית כל חודש",
    addGoalTitle: "הגדרת חיסכון והוראת קבע",
    goalNameLabel: "שם החיסכון",
    targetAmountLabel: "סכום יעד",
    targetDateLabel: "תאריך יעד",
    enableStandingOrder: "הפעל הוראת קבע לחיסכון זה",
    monthlyDebitLabel: "סכום הוראת קבע חודשי",
    debitEndDateLabel: "תאריך גמירת הוראת קבע",
    saveGoalBtn: "הקם תוכנית חיסכון",
    tabDashboard: "סקירה",
    tabGoals: "חסכונות",
    tabDebits: "הוראות קבע",
    noDebit: "חיסכון ידני"
  },
  ar: {
    appTitle: "ميزانية العش",
    totalSavings: "إجمالي هدف التوفير",
    monthlyDebitTotal: "إجمالي الأوامر المستديمة",
    couplePlan: "حساب زوجي نشط",
    autoMonthly: "خصم تلقائي",
    addGoalTitle: "تحديد التوفير والأمر المستديم",
    goalNameLabel: "اسم الهدف",
    targetAmountLabel: "المبلغ المستهدف",
    targetDateLabel: "تاريخ الهدف",
    enableStandingOrder: "تفعيل الأمر المستديم",
    monthlyDebitLabel: "المبلغ الشهري",
    debitEndDateLabel: "تاريخ انتهاء الأمر المستديم",
    saveGoalBtn: "إنشاء الخطة",
    tabDashboard: "الرئيسية",
    tabGoals: "المدخرات",
    tabDebits: "الالتزامات",
    noDebit: "توفير يدوي"
  },
  es: { appTitle: "Nest Budget", totalSavings: "Meta Total", monthlyDebitTotal: "Débitos Totales", couplePlan: "Cuenta Pareja", autoMonthly: "Deducción auto", addGoalTitle: "Definir Meta", goalNameLabel: "Nombre", targetAmountLabel: "Monto", targetDateLabel: "Fecha", enableStandingOrder: "Activar Débito Directo", monthlyDebitLabel: "Monto Mensual", debitEndDateLabel: "Fin del Débito", saveGoalBtn: "Crear Plan", tabDashboard: "Panel", tabGoals: "Ahorros", tabDebits: "Débitos", noDebit: "Manual" },
  fr: { appTitle: "Nest Budget", totalSavings: "Objectif Total", monthlyDebitTotal: "Prélèvements Totaux", couplePlan: "Compte Couple", autoMonthly: "Déduction auto", addGoalTitle: "Définir Objectif", goalNameLabel: "Nom", targetAmountLabel: "Montant", targetDateLabel: "Date", enableStandingOrder: "Activer Prélèvement", monthlyDebitLabel: "Montant Mensuel", debitEndDateLabel: "Fin du Prélèvement", saveGoalBtn: "Créer Plan", tabDashboard: "Tableau", tabGoals: "Épargnes", tabDebits: "Prélèvements", noDebit: "Manuel" },
  de: { appTitle: "Nest Budget", totalSavings: "Gesamtziel", monthlyDebitTotal: "Gesamte Daueraufträge", couplePlan: "Paarkonto", autoMonthly: "Auto-Abzug", addGoalTitle: "Ziel Definieren", goalNameLabel: "Name", targetAmountLabel: "Betrag", targetDateLabel: "Datum", enableStandingOrder: "Dauerauftrag Aktivieren", monthlyDebitLabel: "Monatlicher Betrag", debitEndDateLabel: "Enddatum Dauerauftrag", saveGoalBtn: "Plan Erstellen", tabDashboard: "Übersicht", tabGoals: "Sparen", tabDebits: "Daueraufträge", noDebit: "Manuell" },
  it: { appTitle: "Nest Budget", totalSavings: "Obiettivo Totale", monthlyDebitTotal: "Addebiti Totali", couplePlan: "Conto Coppia", autoMonthly: "Deduzione auto", addGoalTitle: "Definisci Obiettivo", goalNameLabel: "Nome", targetAmountLabel: "Importo", targetDateLabel: "Data", enableStandingOrder: "Attiva Addebito", monthlyDebitLabel: "Importo Mensile", debitEndDateLabel: "Fine Addebito", saveGoalBtn: "Crea Piano", tabDashboard: "Dashboard", tabGoals: "Risparmi", tabDebits: "Addebiti", noDebit: "Manuale" },
  pt: { appTitle: "Nest Budget", totalSavings: "Meta Total", monthlyDebitTotal: "Débitos Totais", couplePlan: "Conta Casal", autoMonthly: "Dedução auto", addGoalTitle: "Definir Meta", goalNameLabel: "Nome", targetAmountLabel: "Valor", targetDateLabel: "Data", enableStandingOrder: "Ativar Débito Direto", monthlyDebitLabel: "Valor Mensal", debitEndDateLabel: "Fim do Débito", saveGoalBtn: "Criar Plano", tabDashboard: "Painel", tabGoals: "Poupanças", tabDebits: "Débitos", noDebit: "Manual" },
  ru: { appTitle: "Nest Budget", totalSavings: "Общая цель", monthlyDebitTotal: "Всего автоплатежей", couplePlan: "Счет пары", autoMonthly: "Автосписание", addGoalTitle: "Добавить цель", goalNameLabel: "Название", targetAmountLabel: "Сумма", targetDateLabel: "Дата", enableStandingOrder: "Включить автоплатеж", monthlyDebitLabel: "Сумма в месяц", debitEndDateLabel: "Конец автоплатежа", saveGoalBtn: "Создать план", tabDashboard: "Обзор", tabGoals: "Накопления", tabDebits: "Платежи", noDebit: "Вручную" },
  zh: { appTitle: "Nest Budget", totalSavings: "总目标", monthlyDebitTotal: "总定额扣款", couplePlan: "情侣账户", autoMonthly: "自动扣款", addGoalTitle: "设定目标", goalNameLabel: "名称", targetAmountLabel: "金额", targetDateLabel: "日期", enableStandingOrder: "启用定额扣款", monthlyDebitLabel: "每月金额", debitEndDateLabel: "扣款结束日期", saveGoalBtn: "创建计划", tabDashboard: "主页", tabGoals: "储蓄", tabDebits: "扣款", noDebit: "手动" },
  ja: { appTitle: "Nest Budget", totalSavings: "総合目標", monthlyDebitTotal: "総口座振替", couplePlan: "カップル口座", autoMonthly: "自動引き落とし", addGoalTitle: "目標設定", goalNameLabel: "名前", targetAmountLabel: "金額", targetDateLabel: "日付", enableStandingOrder: "口座振替を有効化", monthlyDebitLabel: "月額", debitEndDateLabel: "振替終了日", saveGoalBtn: "プラン作成", tabDashboard: "ダッシュボード", tabGoals: "貯金", tabDebits: "振替", noDebit: "手動" }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [goals, setGoals] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '', targetAmount: '', targetDate: '',
    hasStandingOrder: false, monthlyDebit: '', debitEndDate: ''
  });

  const t = translations[lang] || translations.en;
  const isRtl = lang === 'he' || lang === 'ar';

  const formatCurrency = (amountUSD) => {
    const converted = amountUSD * (exchangeRates[currency] || 1);
    return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(converted);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(new Date(dateStr));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rate = exchangeRates[currency] || 1;
    const newGoal = {
      id: Date.now(),
      name: formData.name,
      targetAmountUSD: parseFloat(formData.targetAmount) / rate,
      targetDate: formData.targetDate,
      hasStandingOrder: formData.hasStandingOrder,
      monthlyDebitUSD: formData.hasStandingOrder ? parseFloat(formData.monthlyDebit || 0) / rate : 0,
      debitEndDate: formData.debitEndDate
    };
    
    setGoals([...goals, newGoal]);
    setFormData({ name: '', targetAmount: '', targetDate: '', hasStandingOrder: false, monthlyDebit: '', debitEndDate: '' });
  };

  const totalTargetUSD = goals.reduce((sum, g) => sum + g.targetAmountUSD, 0);
  const totalDebitUSD = goals.reduce((sum, g) => sum + g.monthlyDebitUSD, 0);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
        body { margin: 0; background: #0b0f19; color: #f8fafc; padding-bottom: 100px; }
        .grid-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .square-card { background: #151c2c; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; position: relative; }
        .floating-nav { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(21,28,44,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); padding: 8px; border-radius: 999px; display: flex; gap: 8px; z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        html[dir="rtl"] .floating-nav { transform: translateX(50%); }
        .nav-btn { background: transparent; color: #94a3b8; border: none; padding: 10px 20px; border-radius: 999px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .nav-btn.active { background: #10b981; color: #051610; }
        input, select { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 12px; font-size: 1rem; width: 100%; outline: none; }
        input:focus, select:focus { border-color: #10b981; }
        .badge { background: rgba(16,185,129,0.15); color: #10b981; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; display: inline-block; }
      `}</style>

      <div dir={isRtl ? 'rtl' : 'ltr'} style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>N</div>
            <h1 style={{ fontSize: '1.4rem', margin: 0 }}>{t.appTitle}</h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: 'auto' }}>
              {Object.keys(exchangeRates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: 'auto' }}>
              {Object.keys(translations).map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>
        </header>

        {/* Dashboard Overview */}
        {(activeTab === 'dashboard' || activeTab === 'all') && (
          <div className="grid-cards" style={{ marginBottom: '32px' }}>
            <div className="square-card">
              <div style={{ color: '#94a3b8', marginBottom: '8px' }}>{t.totalSavings}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f8fafc' }}>{formatCurrency(totalTargetUSD)}</div>
              <div style={{ marginTop: '16px' }}><span className="badge">{t.couplePlan}</span></div>
            </div>
            <div className="square-card">
              <div style={{ color: '#94a3b8', marginBottom: '8px' }}>{t.monthlyDebitTotal}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(totalDebitUSD)}</div>
              <div style={{ marginTop: '16px' }}><span className="badge" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>{t.autoMonthly}</span></div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="square-card" style={{ marginBottom: '32px' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '24px' }}>{t.addGoalTitle}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t.goalNameLabel}</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t.targetAmountLabel}</label>
              <input type="number" required min="1" step="any" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t.targetDateLabel}</label>
              <input type="date" required value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
              <input type="checkbox" id="standingOrder" style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }} checked={formData.hasStandingOrder} onChange={e => setFormData({...formData, hasStandingOrder: e.target.checked})} />
              <label htmlFor="standingOrder" style={{ cursor: 'pointer', fontWeight: '500' }}>{t.enableStandingOrder}</label>
            </div>

            {formData.hasStandingOrder && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t.monthlyDebitLabel}</label>
                  <input type="number" required min="1" step="any" value={formData.monthlyDebit} onChange={e => setFormData({...formData, monthlyDebit: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>{t.debitEndDateLabel}</label>
                  <input type="date" required value={formData.debitEndDate} onChange={e => setFormData({...formData, debitEndDate: e.target.value})} />
                </div>
              </>
            )}

            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <button type="submit" style={{ width: '100%', background: '#10b981', color: '#051610', padding: '16px', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {t.saveGoalBtn}
              </button>
            </div>
          </form>
        </div>

        {/* Goals List */}
        <div className="grid-cards">
          {goals.map(goal => (
            <div key={goal.id} className="square-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{goal.name}</h3>
                <span className="badge" style={{ background: goal.hasStandingOrder ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.1)', color: goal.hasStandingOrder ? '#6366f1' : '#94a3b8' }}>
                  {goal.hasStandingOrder ? t.tabDebits : t.noDebit}
                </span>
              </div>
              
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px' }}>
                {formatCurrency(goal.targetAmountUSD)}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t.targetDateLabel}:</span>
                  <strong style={{ color: '#f8fafc' }}>{formatDate(goal.targetDate)}</strong>
                </div>
                
                {goal.hasStandingOrder && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t.monthlyDebitLabel}:</span>
                      <strong style={{ color: '#10b981' }}>{formatCurrency(goal.monthlyDebitUSD)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t.debitEndDateLabel}:</span>
                      <strong style={{ color: '#f8fafc' }}>{formatDate(goal.debitEndDate)}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Nav */}
        <nav className="floating-nav">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>{t.tabDashboard}</button>
          <button className={`nav-btn ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>{t.tabGoals}</button>
          <button className={`nav-btn ${activeTab === 'debits' ? 'active' : ''}`} onClick={() => setActiveTab('debits')}>{t.tabDebits}</button>
        </nav>

      </div>
    </>
  );
}
