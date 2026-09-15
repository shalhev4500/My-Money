import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const TRANSLATIONS = {
  en: {
    appName: 'My Money',
    tagline: 'Private Wealth & Household Finance',
    dashboard: 'Overview',
    transactions: 'Transactions',
    budgets: 'Budgets & Goals',
    tools: 'Tools & Analytics',
    netBalance: 'Net Monthly Balance',
    income: 'Income',
    expenses: 'Expenses',
    safeSpend: 'Daily Safe-to-Spend',
    daysLeft: 'days left',
    targetDate: 'Estimated Target Date',
    noTarget: 'Save consistently to calculate target date',
    goalReached: 'Goal Reached! 🎉',
    categoryBreakdown: 'Expense Breakdown by Category',
    searchPlaceholder: 'Quick search...',
    noTransactions: 'No transactions recorded for this month.',
    recurringBadge: 'Recurring 🔄',
    newTransaction: 'New Transaction',
    expenseType: 'Expense 📉',
    incomeType: 'Income 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'e.g. Supermarket, Fuel...',
    amountLabel: 'Amount (₪)',
    categoryLabel: 'Category',
    recurringCheckbox: 'Recurring subscription / Fixed expense',
    saveButton: 'Save Transaction',
    exportCSV: 'Export Backup (CSV) 📊',
    subscriptionRadar: 'Subscription Radar',
    yearlyTotal: 'Total yearly commitment:',
    systemSettings: 'System Settings',
    themeToggle: 'Appearance Mode',
    darkMode: 'Dark Mode 🌙',
    lightMode: 'Light Mode ☀️',
    language: 'Language 🌐',
    savingsGoalsTitle: 'Personal Savings Goals',
    addGoal: 'Add New Goal',
    goalNamePlaceholder: 'Goal name (e.g. Car, Vacation...)',
    goalAmountPlaceholder: 'Target Amount (₪)',
    smartBudgetTitle: 'Smart Monthly Budget & Limits',
    totalMonthlyBudgetLabel: 'Total Monthly Budget Limit (₪)',
    categoryLimitsTitle: 'Category Budget Allocations',
    budgetExceededError: 'Error: Sum of category limits exceeds your total monthly budget limit!',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
  },
  he: {
    appName: 'My Money',
    tagline: 'ניהול הון אישי וכלכלת בית',
    dashboard: 'סקירה כללית',
    transactions: 'תנועות',
    budgets: 'יעדים ותקציב',
    tools: 'כלים וניתוחים',
    netBalance: 'מאזן חודשי נקי',
    income: 'הכנסות',
    expenses: 'הוצאות',
    safeSpend: 'תקציב יומי מומלץ',
    daysLeft: 'ימים שנותרו',
    targetDate: 'תאריך הגעה משוער ליעד',
    noTarget: 'חסוך בעקביות כדי לחשב תאריך יעד',
    goalReached: 'היעד הושג בהצלחה! 🎉',
    categoryBreakdown: 'פילוח הוצאות לפי קטגוריות',
    searchPlaceholder: 'חיפוש מהיר...',
    noTransactions: 'אין תנועות להצגה בחודש זה.',
    recurringBadge: 'קבוע 🔄',
    newTransaction: 'הוספת תנועה חדשה',
    expenseType: 'הוצאה 📉',
    incomeType: 'הכנסה 📈',
    titleLabel: 'תיאור',
    titlePlaceholder: 'למשל: סופרמרקט, דלק...',
    amountLabel: 'סכום (₪)',
    categoryLabel: 'קטגוריה',
    recurringCheckbox: 'הוצאה קבועה / מנוי חודשי ברדאר',
    saveButton: 'שמור תנועה',
    exportCSV: 'הורד קובץ גיבוי (CSV) 📊',
    subscriptionRadar: 'רדאר מנויים והוצאות קבועות',
    yearlyTotal: 'עלות שנתית מצטברת:',
    systemSettings: 'הגדרות מערכת',
    themeToggle: 'מצב תצוגה',
    darkMode: 'מצב לילה 🌙',
    lightMode: 'מצב יום ☀️',
    language: 'שפה 🌐',
    savingsGoalsTitle: 'יעדי חיסכון אישיים',
    addGoal: 'הוסף יעד חדש',
    goalNamePlaceholder: 'שם היעד (למשל: רכב, חופשה...)',
    goalAmountPlaceholder: 'סכום יעד (₪)',
    smartBudgetTitle: 'תקציב חודשי חכם ומגבלות',
    totalMonthlyBudgetLabel: 'מסגרת תקציב חודשית כוללת (₪)',
    categoryLimitsTitle: 'הקצאות תקציב לקטגוריות',
    budgetExceededError: 'שגיאה: סכום ההקצאות לקטגוריות עובר את מסגרת התקציב החודשית הכוללת שהגדרת!',
    cancel: 'ביטול',
    delete: 'מחיקה',
    edit: 'עריכה'
  },
  ar: {
    appName: 'My Money',
    tagline: 'الإدارة المالية الشخصية',
    dashboard: 'نظرة عامة',
    transactions: 'المعاملات',
    budgets: 'الميزانية والأهداف',
    tools: 'الأدوات والتحليلات',
    netBalance: 'الرصيد الشهري الصافي',
    income: 'الدخل',
    expenses: 'المصروفات',
    safeSpend: 'الإنفاق اليومي الآمن',
    daysLeft: 'أيام متبقية',
    targetDate: 'تاريخ الهدف المقدر',
    noTarget: 'وفر باستمرار لحساب تاريخ الهدف',
    goalReached: 'تم تحقيق الهدف! 🎉',
    categoryBreakdown: 'توزيع المصروفات حسب الفئة',
    searchPlaceholder: 'بحث سريع...',
    noTransactions: 'لا توجد معاملات مسجلة لهذا الشهر.',
    recurringBadge: 'متكرر 🔄',
    newTransaction: 'معاملة جديدة',
    expenseType: 'مصروف 📉',
    incomeType: 'دخل 📈',
    titleLabel: 'الوصف',
    titlePlaceholder: 'مثل: سوبرماركت، وقود...',
    amountLabel: 'المبلغ (₪)',
    categoryLabel: 'الفئة',
    recurringCheckbox: 'اشتراك متكرر / مصروف ثابت',
    saveButton: 'حفظ المعاملة',
    exportCSV: 'تصدير نسخة احتياطية (CSV) 📊',
    subscriptionRadar: 'رادار الاشتراكات',
    yearlyTotal: 'إجمالي الالتزام السنوي:',
    systemSettings: 'إعدادات النظام',
    themeToggle: 'وضع العرض',
    darkMode: 'الوضع الليلي 🌙',
    lightMode: 'الوضع النهاري ☀️',
    language: 'اللغة 🌐',
    savingsGoalsTitle: 'أهداف الادخار الشخصية',
    addGoal: 'إضافة هدف جديد',
    goalNamePlaceholder: 'اسم الهدف (سيارة، إجازة...)',
    goalAmountPlaceholder: 'المبلغ المستهدف (₪)',
    smartBudgetTitle: 'الميزانية الشهرية الذكية والحدود',
    totalMonthlyBudgetLabel: 'إجمالي حد الميزانية الشهرية (₪)',
    categoryLimitsTitle: 'تخصيص ميزانية الفئات',
    budgetExceededError: 'خطأ: مجموع حدود الفئات يتجاوز إجمالي الميزانية الشهرية!',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل'
  },
  es: {
    appName: 'My Money',
    tagline: 'Riqueza Privada y Finanzas',
    dashboard: 'Resumen',
    transactions: 'Transacciones',
    budgets: 'Presupuestos y Metas',
    tools: 'Herramientas',
    netBalance: 'Balance Neto Mensual',
    income: 'Ingresos',
    expenses: 'Gastos',
    safeSpend: 'Gasto Diario Seguro',
    daysLeft: 'días restantes',
    targetDate: 'Fecha estimada',
    noTarget: 'Ahorra constantemente',
    goalReached: '¡Meta alcanzada! 🎉',
    categoryBreakdown: 'Desglose por Categoría',
    searchPlaceholder: 'Búsqueda rápida...',
    noTransactions: 'No hay transacciones este mes.',
    recurringBadge: 'Recurrente 🔄',
    newTransaction: 'Nueva Transacción',
    expenseType: 'Gasto 📉',
    incomeType: 'Ingreso 📈',
    titleLabel: 'Descripción',
    titlePlaceholder: 'ej. Supermercado...',
    amountLabel: 'Monto (₪)',
    categoryLabel: 'Categoría',
    recurringCheckbox: 'Suscripción recurrente / Gasto fijo',
    saveButton: 'Guardar',
    exportCSV: 'Exportar CSV 📊',
    subscriptionRadar: 'Radar de Suscripciones',
    yearlyTotal: 'Compromiso anual total:',
    systemSettings: 'Configuración',
    themeToggle: 'Modo de Tema',
    darkMode: 'Modo Oscuro 🌙',
    lightMode: 'Modo Claro ☀️',
    language: 'Idioma 🌐',
    savingsGoalsTitle: 'Metas de Ahorro Personales',
    addGoal: 'Agregar Meta',
    goalNamePlaceholder: 'Nombre de la meta...',
    goalAmountPlaceholder: 'Monto objetivo (₪)',
    smartBudgetTitle: 'Presupuesto Mensual Inteligente',
    totalMonthlyBudgetLabel: 'Límite Presupuestario Mensual (₪)',
    categoryLimitsTitle: 'Asignaciones por Categoría',
    budgetExceededError: 'Error: ¡La suma de los límites supera el presupuesto total!',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar'
  },
  fr: {
    appName: 'My Money',
    tagline: 'Finances Personnelles',
    dashboard: 'Aperçu',
    transactions: 'Transactions',
    budgets: 'Budgets & Objectifs',
    tools: 'Outils',
    netBalance: 'Solde Net Mensuel',
    income: 'Revenus',
    expenses: 'Dépenses',
    safeSpend: 'Dépense Sûre Quotidienne',
    daysLeft: 'jours restants',
    targetDate: 'Date estimée',
    noTarget: 'Épargnez régulièrement',
    goalReached: 'Objectif Atteint ! 🎉',
    categoryBreakdown: 'Répartition par Catégorie',
    searchPlaceholder: 'Recherche rapide...',
    noTransactions: 'Aucune transaction ce mois-ci.',
    recurringBadge: 'Récurrent 🔄',
    newTransaction: 'Nouvelle Transaction',
    expenseType: 'Dépense 📉',
    incomeType: 'Revenu 📈',
    titleLabel: 'Description',
    titlePlaceholder: 'ex. Supermarché...',
    amountLabel: 'Montant (₪)',
    categoryLabel: 'Catégorie',
    recurringCheckbox: 'Abonnement récurrent',
    saveButton: 'Enregistrer',
    exportCSV: 'Exporter CSV 📊',
    subscriptionRadar: 'Radar des Abonnements',
    yearlyTotal: 'Engagement annuel total:',
    systemSettings: 'Paramètres',
    themeToggle: 'Mode d’affichage',
    darkMode: 'Mode Sombre 🌙',
    lightMode: 'Mode Clair ☀️',
    language: 'Langue 🌐',
    savingsGoalsTitle: 'Objectifs d’Épargne Personnels',
    addGoal: 'Ajouter un Objectif',
    goalNamePlaceholder: 'Nom de l’objectif...',
    goalAmountPlaceholder: 'Montant cible (₪)',
    smartBudgetTitle: 'Budget Mensuel Intelligent',
    totalMonthlyBudgetLabel: 'Limite Budgétaire Mensuelle (₪)',
    categoryLimitsTitle: 'Limites par Catégorie',
    budgetExceededError: 'Erreur : La somme des limites dépasse le budget total !',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier'
  },
  de: {
    appName: 'My Money',
    tagline: 'Privates Vermögen & Haushaltsfinanzen',
    dashboard: 'Übersicht',
    transactions: 'Transaktionen',
    budgets: 'Budgets & Ziele',
    tools: 'Werkzeuge',
    netBalance: 'Nettosaldo',
    income: 'Einnahmen',
    expenses: 'Ausgaben',
    safeSpend: 'Tägliches Budget',
    daysLeft: 'Tage übrig',
    targetDate: 'Geschätztes Zieldatum',
    noTarget: 'Regelmäßig sparen',
    goalReached: 'Ziel erreicht! 🎉',
    categoryBreakdown: 'Kategorienübersicht',
    searchPlaceholder: 'Schnellsuche...',
    noTransactions: 'Keine Transaktionen diesen Monat.',
    recurringBadge: 'Wiederkehrend 🔄',
    newTransaction: 'Neue Transaktion',
    expenseType: 'Ausgabe 📉',
    incomeType: 'Einnahme 📈',
    titleLabel: 'Beschreibung',
    titlePlaceholder: 'z.B. Supermarkt...',
    amountLabel: 'Betrag (₪)',
    categoryLabel: 'Kategorie',
    recurringCheckbox: 'Wiederkehrendes Abo',
    saveButton: 'Speichern',
    exportCSV: 'CSV Exportieren 📊',
    subscriptionRadar: 'Abo-Radar',
    yearlyTotal: 'Gesamte jährliche Bindung:',
    systemSettings: 'Einstellungen',
    themeToggle: 'Design-Modus',
    darkMode: 'Dunkelmodus 🌙',
    lightMode: 'Hellmodus ☀️',
    language: 'Sprache 🌐',
    savingsGoalsTitle: 'Persönliche Sparziele',
    addGoal: 'Ziel hinzufügen',
    goalNamePlaceholder: 'Zielname...',
    goalAmountPlaceholder: 'Zielbetrag (₪)',
    smartBudgetTitle: 'Intelligentes Monatsbudget',
    totalMonthlyBudgetLabel: 'Monatliches Gesamtbudget (₪)',
    categoryLimitsTitle: 'Kategorienlimits',
    budgetExceededError: 'Fehler: Die Summe der Limits übersteigt das Gesamtbudget!',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten'
  },
  it: {
    appName: 'My Money',
    tagline: 'Finanza Personale',
    dashboard: 'Panoramica',
    transactions: 'Transazioni',
    budgets: 'Budget e Obiettivi',
    tools: 'Strumenti',
    netBalance: 'Bilancio Netto',
    income: 'Entrate',
    expenses: 'Uscite',
    safeSpend: 'Spesa Sicura Giornaliera',
    daysLeft: 'giorni rimanenti',
    targetDate: 'Data stimata',
    noTarget: 'Risparmia costantemente',
    goalReached: 'Obiettivo Raggiunto! 🎉',
    categoryBreakdown: 'Ripartizione per Categoria',
    searchPlaceholder: 'Ricerca rapida...',
    noTransactions: 'Nessuna transazione questo mese.',
    recurringBadge: 'Ricorrente 🔄',
    newTransaction: 'Nuova Transazione',
    expenseType: 'Spesa 📉',
    incomeType: 'Entrata 📈',
    titleLabel: 'Descrizione',
    titlePlaceholder: 'es. Supermercato...',
    amountLabel: 'Importo (₪)',
    categoryLabel: 'Categoria',
    recurringCheckbox: 'Abbonamento ricorrente',
    saveButton: 'Salva',
    exportCSV: 'Esporta CSV 📊',
    subscriptionRadar: 'Radar Abbonamenti',
    yearlyTotal: 'Impegno annuale totale:',
    systemSettings: 'Impostazioni',
    themeToggle: 'Modalità Tema',
    darkMode: 'Modalità Scura 🌙',
    lightMode: 'Modalità Chiara ☀️',
    language: 'Lingua 🌐',
    savingsGoalsTitle: 'Obiettivi di Risparmio Personali',
    addGoal: 'Aggiungi Obiettivo',
    goalNamePlaceholder: 'Nome obiettivo...',
    goalAmountPlaceholder: 'Importo obiettivo (₪)',
    smartBudgetTitle: 'Budget Mensile Intelligente',
    totalMonthlyBudgetLabel: 'Limite Budget Mensile (₪)',
    categoryLimitsTitle: 'Limiti per Categoria',
    budgetExceededError: 'Errore: La somma dei limiti supera il budget totale!',
    cancel: 'Annulla',
    delete: 'Elimina',
    edit: 'Modifica'
  },
  ru: {
    appName: 'My Money',
    tagline: 'Личные финансы и богатство',
    dashboard: 'Обзор',
    transactions: 'Транзакции',
    budgets: 'Бюджет и цели',
    tools: 'Инструменты',
    netBalance: 'Чистый месячный баланс',
    income: 'Доходы',
    expenses: 'Расходы',
    safeSpend: 'Дневной лимит трат',
    daysLeft: 'дней осталось',
    targetDate: 'Ориентировочная дата цели',
    noTarget: 'Копите регулярно',
    goalReached: 'Цель достигнута! 🎉',
    categoryBreakdown: 'Расходы по категориям',
    searchPlaceholder: 'Быстрый поиск...',
    noTransactions: 'Нет транзакций за этот месяц.',
    recurringBadge: 'Повторяющийся 🔄',
    newTransaction: 'Новая транзакция',
    expenseType: 'Расход 📉',
    incomeType: 'Доход 📈',
    titleLabel: 'Описание',
    titlePlaceholder: 'напр. Супермаркет...',
    amountLabel: 'Сумма (₪)',
    categoryLabel: 'Категория',
    recurringCheckbox: 'Регулярный платеж / подписка',
    saveButton: 'Сохранить',
    exportCSV: 'Экспорт CSV 📊',
    subscriptionRadar: 'Радар подписок',
    yearlyTotal: 'Итого годовые обязательства:',
    systemSettings: 'Системные настройки',
    themeToggle: 'Режим темы',
    darkMode: 'Темный режим 🌙',
    lightMode: 'Светлый режим ☀️',
    language: 'Язык 🌐',
    savingsGoalsTitle: 'Личные цели накопления',
    addGoal: 'Добавить цель',
    goalNamePlaceholder: 'Название цели (авто, отпуск...)',
    goalAmountPlaceholder: 'Сумма цели (₪)',
    smartBudgetTitle: 'Умный месячный бюджет и лимиты',
    totalMonthlyBudgetLabel: 'Общий месячный лимит бюджета (₪)',
    categoryLimitsTitle: 'Лимиты по категориям',
    budgetExceededError: 'Ошибка: Сумма лимитов категорий превышает общий месячный бюджет!',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Изменить'
  },
  pt: {
    appName: 'My Money',
    tagline: 'Finanças Pessoais',
    dashboard: 'Visão Geral',
    transactions: 'Transações',
    budgets: 'Orçamentos e Metas',
    tools: 'Ferramentas',
    netBalance: 'Saldo Mensal Líquido',
    income: 'Receitas',
    expenses: 'Despesas',
    safeSpend: 'Gasto Diário Seguro',
    daysLeft: 'dias restantes',
    targetDate: 'Data estimada',
    noTarget: 'Poupe consistentemente',
    goalReached: 'Meta Alcançada! 🎉',
    categoryBreakdown: 'Despesas por Categoria',
    searchPlaceholder: 'Busca rápida...',
    noTransactions: 'Sem transações este mês.',
    recurringBadge: 'Recorrente 🔄',
    newTransaction: 'Nova Transação',
    expenseType: 'Despesa 📉',
    incomeType: 'Receita 📈',
    titleLabel: 'Descrição',
    titlePlaceholder: 'ex. Supermercado...',
    amountLabel: 'Montante (₪)',
    categoryLabel: 'Categoria',
    recurringCheckbox: 'Assinatura recorrente',
    saveButton: 'Salvar',
    exportCSV: 'Exportar CSV 📊',
    subscriptionRadar: 'Radar de Assinaturas',
    yearlyTotal: 'Compromisso anual total:',
    systemSettings: 'Configurações',
    themeToggle: 'Modo de Tema',
    darkMode: 'Modo Escuro 🌙',
    lightMode: 'Modo Claro ☀️',
    language: 'Idioma 🌐',
    savingsGoalsTitle: 'Metas de Poupança Pessoais',
    addGoal: 'Adicionar Meta',
    goalNamePlaceholder: 'Nome da meta...',
    goalAmountPlaceholder: 'Montante alvo (₪)',
    smartBudgetTitle: 'Orçamento Mensal Inteligente',
    totalMonthlyBudgetLabel: 'Limite de Orçamento Mensal (₪)',
    categoryLimitsTitle: 'Limites por Categoria',
    budgetExceededError: 'Erro: A soma dos limites excede o orçamento total!',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar'
  },
  ja: {
    appName: 'My Money',
    tagline: 'プライベート家計管理',
    dashboard: '概要',
    transactions: '取引',
    budgets: '予算と目標',
    tools: 'ツール',
    netBalance: '月間純残高',
    income: '収入',
    expenses: '支出',
    safeSpend: '1日の安全な支出',
    daysLeft: '残り日数',
    targetDate: '推定達成日',
    noTarget: '継続して貯金しましょう',
    goalReached: '目標達成！ 🎉',
    categoryBreakdown: 'カテゴリ別支出',
    searchPlaceholder: 'クイック検索...',
    noTransactions: '今月の取引はありません。',
    recurringBadge: '定期 🔄',
    newTransaction: '新しい取引',
    expenseType: '支出 📉',
    incomeType: '収入 📈',
    titleLabel: '説明',
    titlePlaceholder: '例：スーパー、ガソリン...',
    amountLabel: '金額 (₪)',
    categoryLabel: 'カテゴリ',
    recurringCheckbox: '定期サブスクリプション',
    saveButton: '保存',
    exportCSV: 'CSVエクスポート 📊',
    subscriptionRadar: 'サブスクレーダー',
    yearlyTotal: '年間総コミットメント:',
    systemSettings: 'システム設定',
    themeToggle: 'テーマモード',
    darkMode: 'ダークモード 🌙',
    lightMode: 'ライトモード ☀️',
    language: '言語 🌐',
    savingsGoalsTitle: '個人貯蓄目標',
    addGoal: '目標を追加',
    goalNamePlaceholder: '目標名（車、旅行など）',
    goalAmountPlaceholder: '目標金額 (₪)',
    smartBudgetTitle: 'スマート月間予算と制限',
    totalMonthlyBudgetLabel: '月間予算総額上限 (₪)',
    categoryLimitsTitle: 'カテゴリ別予算配分',
    budgetExceededError: 'エラー：カテゴリ上限の合計が月間予算総額を超えています！',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集'
  },
  zh: {
    appName: 'My Money',
    tagline: '私人财富与家庭财务',
    dashboard: '概览',
    transactions: '交易',
    budgets: '预算与目标',
    tools: '工具',
    netBalance: '月度净结余',
    income: '收入',
    expenses: '支出',
    safeSpend: '每日安全支出',
    daysLeft: '剩余天数',
    targetDate: '预计达成日期',
    noTarget: '持续储蓄以计算目标日期',
    goalReached: '达成目标！ 🎉',
    categoryBreakdown: '按类别支出的明细',
    searchPlaceholder: '快速搜索...',
    noTransactions: '本月暂无交易记录。',
    recurringBadge: '周期性 🔄',
    newTransaction: '新交易',
    expenseType: '支出 📉',
    incomeType: '收入 📈',
    titleLabel: '描述',
    titlePlaceholder: '例如：超市、油费...',
    amountLabel: '金额 (₪)',
    categoryLabel: '类别',
    recurringCheckbox: '定期订阅 / 固定支出',
    saveButton: '保存交易',
    exportCSV: '导出备份 (CSV) 📊',
    subscriptionRadar: '订阅雷达',
    yearlyTotal: '年度总承诺：',
    systemSettings: '系统设置',
    themeToggle: '外观模式',
    darkMode: '深色模式 🌙',
    lightMode: '浅色模式 ☀️',
    language: '语言 🌐',
    savingsGoalsTitle: '个人储蓄目标',
    addGoal: '添加新目标',
    goalNamePlaceholder: '目标名称（如：车、度假...）',
    goalAmountPlaceholder: '目标金额 (₪)',
    smartBudgetTitle: '智能月度预算与限制',
    totalMonthlyBudgetLabel: '每月总预算上限 (₪)',
    categoryLimitsTitle: '类别预算分配',
    budgetExceededError: '错误：分类限额之和超出了您的每月总预算上限！',
    cancel: '取消',
    delete: '删除',
    edit: '编辑'
  },
  nl: {
    appName: 'My Money',
    tagline: 'Privé Vermogen & Huishoudfinanciën',
    dashboard: 'Overzicht',
    transactions: 'Transacties',
    budgets: 'Budgetten & Doelen',
    tools: 'Hulpmiddelen',
    netBalance: 'Netto Maandbalans',
    income: 'Inkomsten',
    expenses: 'Uitgaven',
    safeSpend: 'Dagelijks Veilig Uit te Geven',
    daysLeft: 'dagen over',
    targetDate: 'Geschatte streefdatum',
    noTarget: 'Spaar consistent',
    goalReached: 'Doel Bereikt! 🎉',
    categoryBreakdown: 'Uitgaven per Categorie',
    searchPlaceholder: 'Snel zoeken...',
    noTransactions: 'Geen transacties voor deze maand.',
    recurringBadge: 'Terugkerend 🔄',
    newTransaction: 'Nieuwe Transactie',
    expenseType: 'Uitgave 📉',
    incomeType: 'Inkomsten 📈',
    titleLabel: 'Beschrijving',
    titlePlaceholder: 'bijv. Supermarkt...',
    amountLabel: 'Bedrag (₪)',
    categoryLabel: 'Categorie',
    recurringCheckbox: 'Terugkerend abonnement',
    saveButton: 'Opslaan',
    exportCSV: 'Exporteer CSV 📊',
    subscriptionRadar: 'Abonnementen Radar',
    yearlyTotal: 'Totale jaarlijkse verplichting:',
    systemSettings: 'Systeeminstellingen',
    themeToggle: 'Weergavemodus',
    darkMode: 'Donkere Modus 🌙',
    lightMode: 'Lichte Modus ☀️',
    language: 'Taal 🌐',
    savingsGoalsTitle: 'Persoonlijke Spaardoelen',
    addGoal: 'Voeg doel toe',
    goalNamePlaceholder: 'Doelnaam (auto, vakantie...)',
    goalAmountPlaceholder: 'Doelbedrag (₪)',
    smartBudgetTitle: 'Slim Maandelijks Budget & Limieten',
    totalMonthlyBudgetLabel: 'Totaal Maandelijks Budgetlimiet (₪)',
    categoryLimitsTitle: 'Categorie Budgettoewijzingen',
    budgetExceededError: 'Fout: Som van categorielimieten overschrijdt je totale maandbudget!',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    edit: 'Bewerken'
  }
}

const LANGUAGES_LIST = [
  { code: 'en', name: 'English' },
  { code: 'he', name: 'עברית' },
  { code: 'ar', name: 'العربية' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
  { code: 'nl', name: 'Nederlands' }
]

const INITIAL_CATEGORIES = {
  'מזון וסופר': { icon: '🛒', color: '#10b981', limit: 2500 },
  'שכירות ודיור': { icon: '🏠', color: '#3b82f6', limit: 4000 },
  'תחבורה ודלק': { icon: '⛽', color: '#f59e0b', limit: 1200 },
  'בילויים ופנאי': { icon: '🎉', color: '#ec4899', limit: 1000 },
  'חשבונות וארנונה': { icon: '💡', color: '#8b5cf6', limit: 900 },
  'שונות': { icon: '📦', color: '#64748b', limit: 500 }
}

const INITIAL_SAVINGS_GOALS = [
  { id: 1, name: '🚗 רכב חדש', target: 40000 },
  { id: 2, name: '✈️ חופשה בחו"ל', target: 8000 },
  { id: 3, name: '🏠 דירה / הון עצמי', target: 100000 }
]

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('mymoney_lang') || 'en')
  const [theme, setTheme] = useState(() => localStorage.getItem('mymoney_theme') || 'dark')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('מזון וסופר')
  const [isRecurring, setIsRecurring] = useState(false)

  // ניהול יעדי חיסכון ריבוי יעדים ערוכים מלאים
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem('mymoney_savings_goals')
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS
  })
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalAmount, setNewGoalAmount] = useState('')
  const [editingGoalId, setEditingGoalId] = useState(null)
  const [editGoalName, setEditGoalName] = useState('')
  const [editGoalAmount, setEditGoalAmount] = useState('')

  // תקציב חודשי חכם ומגבלות
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(() => Number(localStorage.getItem('mymoney_monthly_budget')) || 9000)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('mymoney_categories')
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })
  const [budgetError, setBudgetError] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [tempCategoryLimit, setTempCategoryLimit] = useState('')

  const getCurrentMonthString = () => new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthString())

  useEffect(() => { localStorage.setItem('mymoney_lang', lang) }, [lang])
  useEffect(() => { localStorage.setItem('mymoney_theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('mymoney_savings_goals', JSON.stringify(savingsGoals)) }, [savingsGoals])
  useEffect(() => { localStorage.setItem('mymoney_monthly_budget', monthlyBudgetLimit) }, [monthlyBudgetLimit])
  useEffect(() => { localStorage.setItem('mymoney_categories', JSON.stringify(categories)) }, [categories])

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function fetchTransactions() {
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false })
    if (error) console.log('Error fetching:', error)
    else setTransactions(data || [])
  }

  async function addTransaction(e) {
    e.preventDefault()
    if (!title || !amount) return

    const numericAmount = parseFloat(amount)
    const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount)

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ 
        title: title.trim(), 
        amount: finalAmount, 
        category: type === 'expense' ? category : 'Income',
        is_recurring: type === 'expense' ? isRecurring : false
      }])
      .select()

    if (error) {
      alert('Error: ' + error.message)
    } else if (data) {
      setTransactions([data[0], ...transactions])
      setTitle('')
      setAmount('')
      setIsRecurring(false)
      setIsModalOpen(false)
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) {
      setTransactions(transactions.filter(item => item.id !== id))
    }
  }

  // ניהול הוספה ועריכה של יעדי חיסכון
  function handleAddGoal(e) {
    e.preventDefault()
    if (!newGoalName || !newGoalAmount) return
    const newItem = { id: Date.now(), name: newGoalName.trim(), target: parseFloat(newGoalAmount) }
    setSavingsGoals([...savingsGoals, newItem])
    setNewGoalName('')
    setNewGoalAmount('')
  }

  function deleteGoal(id) {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id))
  }

  function saveEditedGoal(id) {
    setSavingsGoals(savingsGoals.map(g => g.id === id ? { ...g, name: editGoalName, target: parseFloat(editGoalAmount) || g.target } : g))
    setEditingGoalId(null)
  }

  // עדכון גבולות תקציב חכם עם בדיקה שלא חורגים מהמסגרת הכוללת
  function handleUpdateCategoryLimit(catName, newLimitVal) {
    const parsedLimit = parseFloat(newLimitVal) || 0
    // חישוב שאר הקטגוריות בלי הקטגוריה הנוכחית
    let sumOtherLimits = 0
    Object.keys(categories).forEach(c => {
      if (c !== catName) sumOtherLimits += categories[c].limit
    })

    if (sumOtherLimits + parsedLimit > monthlyBudgetLimit) {
      setBudgetError(t.budgetExceededError)
      return
    }

    setBudgetError('')
    setCategories({
      ...categories,
      [catName]: { ...categories[catName], limit: parsedLimit }
    })
    setEditingCategory(null)
  }

  function handleUpdateTotalBudget(newTotal) {
    const val = parseFloat(newTotal) || 0
    // בדיקה האם סך ההקצאות הנוכחיות גדול מהתקציב החדש
    const currentSumLimits = Object.values(categories).reduce((acc, c) => acc + c.limit, 0)
    if (currentSumLimits > val) {
      setBudgetError(t.budgetExceededError)
      return
    }
    setBudgetError('')
    setMonthlyBudgetLimit(val)
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en
  const isRTL = lang === 'he' || lang === 'ar'

  const monthTransactions = transactions.filter(tr => {
    const tDate = tr.created_at ? tr.created_at.slice(0, 7) : getCurrentMonthString()
    return tDate === selectedMonth
  })

  const totalIncome = monthTransactions.filter(tr => Number(tr.amount) > 0).reduce((sum, tr) => sum + Number(tr.amount), 0)
  const totalExpense = monthTransactions.filter(tr => Number(tr.amount) < 0).reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const netBalance = totalIncome - totalExpense

  const daysInMonth = new Date(selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), 0).getDate()
  const currentDay = new Date().getDate()
  const daysRemaining = Math.max(daysInMonth - currentDay + 1, 1)
  const remainingBudgetMoney = Math.max(monthlyBudgetLimit - totalExpense, 0)
  const dailySafeSpend = Math.round(remainingBudgetMoney / daysRemaining)

  const recurringExpenses = monthTransactions.filter(tr => tr.is_recurring && Number(tr.amount) < 0)
  const totalRecurringMonthly = recurringExpenses.reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
  const totalRecurringYearly = totalRecurringMonthly * 12

  const expensesByCategory = Object.keys(categories).map(catName => {
    const total = monthTransactions
      .filter(tr => tr.category === catName && Number(tr.amount) < 0)
      .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
    return { name: catName, total, ...categories[catName] }
  }).filter(cat => cat.total > 0)

  // יצירת גרף עוגה מבוסס SVG חכם ונקי
  let cumulativePercent = 0
  const svgSlices = expensesByCategory.map((cat, index) => {
    const percentage = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0
    const startAngle = (cumulativePercent / 100) * 360
    cumulativePercent += percentage
    const endAngle = (cumulativePercent / 100) * 360

    const x1 = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180)
    const y1 = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180)
    const x2 = 50 + 40 * Math.cos((Math.PI * (endAngle - 90)) / 180)
    const y2 = 50 + 40 * Math.sin((Math.PI * (endAngle - 90)) / 180)
    const largeArcFlag = percentage > 50 ? 1 : 0
    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    return <path key={index} d={pathData} fill={cat.color} stroke={theme === 'dark' ? '#1e293b' : '#ffffff'} strokeWidth="1.5" />
  })

  function exportToCSV() {
    const headers = "ID,Title,Amount,Category,Date,Recurring\n"
    const rows = transactions.map(tr => `${tr.id},"${tr.title}",${tr.amount},"${tr.category || ''}",${tr.created_at || ''},${tr.is_recurring || false}`).join("\n")
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mymoney_export_${selectedMonth}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredTransactions = monthTransactions.filter(tr => tr.title.toLowerCase().includes(searchTerm.toLowerCase()) || (tr.category && tr.category.includes(searchTerm)))

  // עיצוב לפי מצב לילה / יום
  const bgApp = theme === 'dark' ? '#0b0f19' : '#f8fafc'
  const cardBg = theme === 'dark' ? '#131c31' : '#ffffff'
  const textMain = theme === 'dark' ? '#f1f5f9' : '#0f172a'
  const textMuted = theme === 'dark' ? '#94a3b8' : '#64748b'
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const inputBg = theme === 'dark' ? '#090d16' : '#f1f5f9'

  return (
    <div style={{ maxWidth: '480px', margin: '15px auto', minHeight: '94vh', padding: '16px 16px 100px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', background: bgApp, color: textMain, borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: `1px solid ${borderColor}`, position: 'relative', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${borderColor}` }}>
        <div>
          <h1 style={{ color: textMain, margin: '0 0 2px 0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>{t.appName} 💼</h1>
          <span style={{ color: textMuted, fontSize: '11px', fontWeight: '500' }}>{t.tagline}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* בחירת שפה - 12 שפות */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '6px 4px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none', cursor: 'pointer' }}
            title={t.language}
          >
            {LANGUAGES_LIST.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>

          {/* כפתור החלפת תאורת לילה / יום */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '6px 8px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '12px', background: cardBg, color: textMain, cursor: 'pointer', fontWeight: 'bold' }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '10px', border: `1px solid ${borderColor}`, fontSize: '11px', fontWeight: 'bold', background: cardBg, color: textMain, outline: 'none' }}
          />
        </div>
      </header>

      {/* 1. Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '20px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <span style={{ display: 'block', fontSize: '12px', color: textMuted, marginBottom: '6px', fontWeight: '600' }}>{t.netBalance}</span>
            <span style={{ fontSize: '30px', fontWeight: '900', color: netBalance >= 0 ? '#10b981' : '#ef4444', letterSpacing: '-1px' }}>
              ₪{netBalance.toLocaleString()}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${borderColor}` }}>
              <div>
                <span style={{ fontSize: '11px', color: textMuted, display: 'block' }}>{t.income}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#10b981' }}>+₪{totalIncome.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: textMuted, display: 'block' }}>{t.expenses}</span>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#ef4444' }}>-₪{totalExpense.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>💡 {t.safeSpend}</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: textMain }}>₪{dailySafeSpend.toLocaleString()}</span>
            </div>
            <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
              <span style={{ fontSize: '10px', color: textMuted, display: 'block' }}>{t.daysLeft}</span>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: textMain }}>{daysRemaining}</span>
            </div>
          </div>

          {/* גרף עוגה ופילוח הוצאות ויזואלי */}
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 12px 0', color: textMain, fontWeight: '700' }}>{t.categoryBreakdown}</h3>
            {expensesByCategory.length === 0 ? (
              <p style={{ textAlign: 'center', color: textMuted, fontSize: '11px', padding: '15px' }}>{t.noTransactions}</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '110px', height: '110px', flexShrink: '0' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {svgSlices}
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, fontSize: '11px' }}>
                  {expensesByCategory.map(cat => (
                    <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color }}></span>
                        <span style={{ color: textMuted }}>{cat.name}</span>
                      </span>
                      <strong style={{ color: textMain }}>₪{cat.total}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '14px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px', boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
            {filteredTransactions.length === 0 ? (
              <p style={{ textAlign: 'center', color: textMuted, fontSize: '12px', padding: '30px' }}>{t.noTransactions}</p>
            ) : (
              filteredTransactions.map(tr => (
                <div key={tr.id} style={{ background: cardBg, padding: '12px 14px', borderRadius: '16px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ display: 'block', fontWeight: '700', fontSize: '13px', color: textMain }}>{tr.title}</span>
                    <span style={{ fontSize: '10px', color: textMuted }}>{tr.category} {tr.is_recurring && `• ${t.recurringBadge}`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: Number(tr.amount) > 0 ? '#10b981' : '#ef4444' }}>
                      {Number(tr.amount) > 0 ? `+₪${tr.amount}` : `-₪{Math.abs(tr.amount)}`}
                    </span>
                    <button onClick={() => deleteTransaction(tr.id)} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Budgets Tab - יעדי חיסכון + תקציב חכם עם בקרה ומגבלות */}
      {activeTab === 'budgets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* אזהרת חריגת תקציב אם קיימת */}
          {budgetError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '12px', color: '#ef4444', fontSize: '11px', fontWeight: 'bold' }}>
              ⚠️ {budgetError}
            </div>
          )}

          {/* 1. ניהול יעדי חיסכון אישיים */}
          <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 12px 0', color: textMain, fontWeight: '700' }}>🎯 {t.savingsGoalsTitle}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {savingsGoals.map(goal => {
                const currentSaved = Math.max(netBalance, 0)
                const percent = Math.min(Math.round((currentSaved / goal.target) * 100), 100)
                
                return (
                  <div key={goal.id} style={{ background: inputBg, padding: '10px 12px', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                    {editingGoalId === goal.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="text" value={editGoalName} onChange={(e) => setEditGoalName(e.target.value)} style={{ padding: '6px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textMain, fontSize: '11px' }} />
                        <input type="number" value={editGoalAmount} onChange={(e) => setEditGoalAmount(e.target.value)} style={{ padding: '6px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textMain, fontSize: '11px' }} />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => saveEditedGoal(goal.id)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>שמור</button>
                          <button onClick={() => setEditingGoalId(null)} style={{ background: 'transparent', color: textMuted, border: `1px solid ${borderColor}`, padding: '4px 10px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}>{t.cancel}</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'progressbar', display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', color: textMain }}>{goal.name}</span>
                          <span style={{ color: textMuted }}>₪{currentSaved} / ₪{goal.target.toLocaleString()} ({percent}%)</span>
                        </div>
                        <div style={{ background: cardBg, height: '6px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ background: '#10b981', width: `${percent}%`, height: '100%', transition: 'width 0.3s ease' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button onClick={() => { setEditingGoalId(goal.id); setEditGoalName(goal.name); setEditGoalAmount(goal.target); }} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{t.edit}</button>
                          <button onClick={() => deleteGoal(goal.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{t.delete}</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* הוספת יעד חדש */}
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder={t.goalNamePlaceholder} value={newGoalName} onChange={(e) => setNewGoalName(e.target.value)} style={{ flex: 2, padding: '8px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, fontSize: '11px', outline: 'none' }} />
              <input type="number" placeholder={t.goalAmountPlaceholder} value={newGoalAmount} onChange={(e) => setNewGoalAmount(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, fontSize: '11px', outline: 'none' }} />
              <button type="submit" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
            </form>
          </div>

          {/* 2. תקציב חודשי חכם עם מגבלות */}
          <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 10px 0', color: textMain, fontWeight: '700' }}>🛡️ {t.smartBudgetTitle}</h3>
            
            <div style={{ marginBottom: '14px', background: inputBg, padding: '10px 12px', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
              <label style={{ display: 'block', fontSize: '10px', color: textMuted, marginBottom: '4px', fontWeight: 'bold' }}>{t.totalMonthlyBudgetLabel}</label>
              <input 
                type="number" 
                value={monthlyBudgetLimit} 
                onChange={(e) => handleUpdateTotalBudget(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: cardBg, color: textMain, fontSize: '13px', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <h4 style={{ fontSize: '11px', margin: '0 0 8px 0', color: textMuted }}>{t.categoryLimitsTitle}</h4>
            
            {Object.keys(categories).map(catName => {
              const catData = categories[catName]
              const totalSpent = monthTransactions
                .filter(tr => tr.category === catName && Number(tr.amount) < 0)
                .reduce((sum, tr) => sum + Math.abs(Number(tr.amount)), 0)
              const percent = Math.min(Math.round((totalSpent / catData.limit) * 100), 100)

              return (
                <div key={catName} style={{ marginBottom: '10px', background: inputBg, padding: '8px 10px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', alignItems: 'center' }}>
                    <span>{catData.icon} {catName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {editingCategory === catName ? (
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <input 
                            type="number" 
                            value={tempCategoryLimit} 
                            onChange={(e) => setTempCategoryLimit(e.target.value)}
                            style={{ width: '60px', padding: '2px 4px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${borderColor}`, background: cardBg, color: textMain }}
                          />
                          <button onClick={() => handleUpdateCategoryLimit(catName, tempCategoryLimit)} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>✓</button>
                        </div>
                      ) : (
                        <span onClick={() => { setEditingCategory(catName); setTempCategoryLimit(catData.limit); }} style={{ fontWeight: 'bold', cursor: 'pointer', color: '#3b82f6' }} title="לחץ לעריכת מגבלה">
                          ₪{totalSpent} / ₪{catData.limit} ✏️
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ background: cardBg, height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: catData.color, width: `${percent}%`, height: '100%', transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* Tools Tab */}
      {activeTab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: cardBg, padding: '16px', borderRadius: '20px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '13px', margin: '0 0 10px 0', color: textMain, fontWeight: '700' }}>{t.subscriptionRadar}</h3>
            <p style={{ fontSize: '11px', color: textMuted, marginBottom: '12px' }}>{t.yearlyTotal} <strong style={{ color: textMain }}>₪{totalRecurringYearly.toLocaleString()}</strong></p>
            <button onClick={exportToCSV} style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              {t.exportCSV}
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Navigation with Floating Action Button (FAB) in Center */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: cardBg, borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 16px 0', boxSizing: 'border-box', zIndex: 1000 }}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>📊</span>
          <span>{t.dashboard}</span>
        </button>

        <button 
          onClick={() => setActiveTab('transactions')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'transactions' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>💳</span>
          <span>{t.transactions}</span>
        </button>

        {/* Floating Plus Button (FAB) */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ position: 'absolute', top: '-22px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', width: '50px', height: '50px', borderRadius: '50%', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
            title={t.newTransaction}
          >
            +
          </button>
        </div>

        <button 
          onClick={() => setActiveTab('budgets')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'budgets' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>🎯</span>
          <span>{t.budgets}</span>
        </button>

        <button 
          onClick={() => setActiveTab('tools')} 
          style={{ background: 'none', border: 'none', color: activeTab === 'tools' ? '#3b82f6' : textMuted, fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}
        >
          <span style={{ fontSize: '18px' }}>🛠️</span>
          <span>{t.tools}</span>
        </button>
      </nav>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: cardBg, padding: '22px', borderRadius: '24px', width: '90%', maxWidth: '360px', border: `1px solid ${borderColor}`, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: textMain, fontWeight: '800' }}>{t.newTransaction}</h3>
            <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setType('expense')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: type === 'expense' ? '#ef4444' : inputBg, color: type === 'expense' ? '#fff' : textMain, fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.expenseType}</button>
                <button type="button" onClick={() => setType('income')} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: type === 'income' ? '#10b981' : inputBg, color: type === 'income' ? '#fff' : textMain, fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.incomeType}</button>
              </div>
              <input type="text" placeholder={t.titlePlaceholder} value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px' }} />
              <input type="number" placeholder={t.amountLabel} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px' }} />
              
              {type === 'expense' && (
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: inputBg, color: textMain, outline: 'none', fontSize: '12px' }}>
                  {Object.keys(categories).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: textMuted }}>
                <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} id="recCheck" />
                <label htmlFor="recCheck" style={{ cursor: 'pointer' }}>{t.recurringCheckbox}</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.saveButton}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', color: textMuted, border: `1px solid ${borderColor}`, padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>{t.cancel}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
