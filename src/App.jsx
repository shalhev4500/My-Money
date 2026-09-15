<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nest Budget & Savings</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Noto+Sans+Hebrew:wght@400;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-main: #0b0f19;
            --surface-card: #151c2c;
            --surface-card-hover: #1c263b;
            --border-color: rgba(255, 255, 255, 0.08);
            --primary-emerald: #10b981;
            --primary-glow: rgba(16, 185, 129, 0.15);
            --accent-indigo: #6366f1;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --radius-card: 20px;
            --radius-pill: 9999px;
            --shadow-float: 0 12px 32px rgba(0, 0, 0, 0.35);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', 'Noto Sans Hebrew', 'Noto Sans Arabic', sans-serif;
            transition: background-color 0.2s, border-color 0.2s;
        }

        body {
            background-color: var(--bg-main);
            color: var(--text-main);
            padding-bottom: 110px;
            min-height: 100vh;
        }

        /* Top Bar */
        header {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .brand-icon {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, var(--primary-emerald), var(--accent-indigo));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 20px;
        }

        .brand-title {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        .controls-group {
            display: flex;
            gap: 10px;
        }

        select {
            background: var(--surface-card);
            color: var(--text-main);
            border: 1px solid var(--border-color);
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 0.875rem;
            outline: none;
            cursor: pointer;
        }

        /* Container Layout */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Floating Nav Bar */
        .floating-nav-container {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
        }

        .floating-nav {
            background: rgba(21, 28, 44, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            padding: 6px;
            border-radius: var(--radius-pill);
            display: flex;
            gap: 6px;
            box-shadow: var(--shadow-float);
        }

        .nav-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            padding: 10px 22px;
            border-radius: var(--radius-pill);
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.25s ease;
        }

        .nav-btn.active {
            background: var(--primary-emerald);
            color: #000;
            box-shadow: 0 4px 14px var(--primary-glow);
        }

        /* Metric Grid Cards (Squared/Clean Layout) */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }

        .square-card {
            background: var(--surface-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-card);
            padding: 24px;
            position: relative;
            overflow: hidden;
        }

        .card-label {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-bottom: 8px;
        }

        .card-value {
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: -0.03em;
        }

        .badge {
            display: inline-block;
            margin-top: 10px;
            padding: 4px 10px;
            background: var(--primary-glow);
            color: var(--primary-emerald);
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        /* Main Form Section */
        .form-card {
            background: var(--surface-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-card);
            padding: 28px;
            margin-bottom: 32px;
        }

        .form-title {
            font-size: 1.15rem;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 16px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            font-size: 0.85rem;
            color: var(--text-muted);
        }

        input, select {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 12px;
            border-radius: 12px;
            font-size: 0.95rem;
            outline: none;
        }

        input:focus {
            border-color: var(--primary-emerald);
        }

        .checkbox-group {
            flex-direction: row;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }

        .checkbox-group input {
            width: 18px;
            height: 18px;
            accent-color: var(--primary-emerald);
            cursor: pointer;
        }

        .btn-submit {
            background: var(--primary-emerald);
            color: #051610;
            border: none;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 16px;
            width: 100%;
        }

        /* Goals Grid */
        .goals-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
        }

        .goal-item-card {
            background: var(--surface-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-card);
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .goal-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .progress-bar-bg {
            background: rgba(255,255,255,0.05);
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 12px 0;
        }

        .progress-bar-fill {
            background: var(--primary-emerald);
            height: 100%;
            width: 0%;
            transition: width 0.4s ease;
        }

        .details-list {
            font-size: 0.825rem;
            color: var(--text-muted);
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-top: 12px;
            border-top: 1px solid var(--border-color);
            padding-top: 12px;
        }

        .details-item {
            display: flex;
            justify-content: space-between;
        }

        /* Dynamic RTL Adjustments */
        html[dir="rtl"] .floating-nav-container {
            transform: translateX(50%);
        }
    </style>
</head>
<body>

    <header>
        <div class="brand">
            <div class="brand-icon">N</div>
            <div class="brand-title">Nest Budget</div>
        </div>

        <div class="controls-group">
            <select id="currencySelector" onchange="changeCurrency(this.value)">
                <option value="USD">USD ($)</option>
                <option value="ILS">ILS (₪)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="RUB">RUB (₽)</option>
                <option value="BRL">BRL (R$)</option>
                <option value="CHF">CHF (CHF)</option>
            </select>

            <select id="languageSelector" onchange="changeLanguage(this.value)">
                <option value="en" selected>English</option>
                <option value="he">עברית</option>
                <option value="ar">العربية</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ru">Русский</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
            </select>
        </div>
    </header>

    <div class="container">
        <!-- Overview Grid -->
        <div class="metrics-grid">
            <div class="square-card">
                <div class="card-label" data-i18n="totalSavings">Total Savings Goal</div>
                <div class="card-value" id="totalSavingsVal">$0.00</div>
                <span class="badge" data-i18n="couplePlan">Couple Account Active</span>
            </div>
            <div class="square-card">
                <div class="card-label" data-i18n="monthlyDebitTotal">Total Standing Orders</div>
                <div class="card-value" id="totalDebitVal">$0.00</div>
                <span class="badge" data-i18n="autoMonthly">Auto-deducted monthly</span>
            </div>
        </div>

        <!-- Form Section -->
        <div class="form-card">
            <h2 class="form-title" data-i18n="addGoalTitle">Define Savings Target & Standing Order</h2>
            <form id="goalForm" onsubmit="handleFormSubmit(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label data-i18n="goalNameLabel">Savings Goal Name</label>
                        <input type="text" id="goalName" required placeholder="e.g. Home Downpayment">
                    </div>
                    <div class="form-group">
                        <label data-i18n="targetAmountLabel">Target Amount</label>
                        <input type="number" id="targetAmount" required min="1" step="any">
                    </div>
                    <div class="form-group">
                        <label data-i18n="targetDateLabel">Savings Target Date</label>
                        <input type="date" id="targetDate" required>
                    </div>

                    <div class="form-group full-width checkbox-group">
                        <input type="checkbox" id="hasStandingOrder" onchange="toggleStandingOrderFields(this.checked)">
                        <label for="hasStandingOrder" data-i18n="enableStandingOrder">Enable Direct Debit / Standing Order (הוראת קבע)</label>
                    </div>

                    <div class="form-group" id="debitAmountGroup" style="display: none;">
                        <label data-i18n="monthlyDebitLabel">Monthly Standing Order Amount</label>
                        <input type="number" id="monthlyDebitAmount" min="0" step="any">
                    </div>
                    <div class="form-group" id="debitEndGroup" style="display: none;">
                        <label data-i18n="debitEndDateLabel">Standing Order End Date</label>
                        <input type="date" id="debitEndDate">
                    </div>
                </div>
                <button type="submit" class="btn-submit" data-i18n="saveGoalBtn">Create Savings Plan</button>
            </form>
        </div>

        <!-- Goals Display Grid -->
        <div class="goals-grid" id="goalsContainer"></div>
    </div>

    <!-- Floating Navigation Bar -->
    <div class="floating-nav-container">
        <nav class="floating-nav">
            <button class="nav-btn active" data-i18n="tabOverview">Dashboard</button>
            <button class="nav-btn" data-i18n="tabGoals">Savings Goals</button>
            <button class="nav-btn" data-i18n="tabDebits">Standing Orders</button>
        </nav>
    </div>

    <script>
        // Rates relative to USD base
        const exchangeRates = {
            USD: 1.0,
            ILS: 3.70,
            EUR: 0.92,
            GBP: 0.78,
            CAD: 1.36,
            AUD: 1.52,
            JPY: 155.0,
            CNY: 7.23,
            RUB: 90.0,
            BRL: 5.40,
            CHF: 0.90
        };

        const translations = {
            en: {
                totalSavings: "Total Savings Target",
                monthlyDebitTotal: "Monthly Standing Orders",
                couplePlan: "Couple Account Active",
                autoMonthly: "Auto-deducted monthly",
                addGoalTitle: "Define Savings Target & Standing Order",
                goalNameLabel: "Goal Name",
                targetAmountLabel: "Target Amount",
                targetDateLabel: "Savings Target Date",
                enableStandingOrder: "Enable Direct Debit / Standing Order",
                monthlyDebitLabel: "Monthly Standing Order Amount",
                debitEndDateLabel: "Standing Order End Date",
                saveGoalBtn: "Create Savings Plan",
                tabOverview: "Dashboard",
                tabGoals: "Savings",
                tabDebits: "Direct Debits",
                targetDateShort: "Target Date",
                debitEndShort: "Standing Order Ends",
                monthlyShort: "Monthly Deposit",
                noDebit: "Manual Savings"
            },
            he: {
                totalSavings: "סה״כ יעד חיסכון",
                monthlyDebitTotal: "סה״כ הוראות קבע חודשיות",
                couplePlan: "חשבון זוגי פעיל",
                autoMonthly: "ירד באופן אוטומטי",
                addGoalTitle: "הגדרת יעד חיסכון והוראת קבע",
                goalNameLabel: "שם החיסכון",
                targetAmountLabel: "סכום היעד",
                targetDateLabel: "תאריך יעד של החיסכון",
                enableStandingOrder: "הפעלת הוראת קבע לחיסכון",
                monthlyDebitLabel: "סכום הוראת הקבע החודשית",
                debitEndDateLabel: "תאריך גמירת הוראת הקבע",
                saveGoalBtn: "צור תוכנית חיסכון",
                tabOverview: "דשבורד",
                tabGoals: "חסכונות",
                tabDebits: "הוראות קבע",
                targetDateShort: "תאריך יעד",
                debitEndShort: "סיום הוראת קבע",
                monthlyShort: "הפקדה חודשית",
                noDebit: "חיסכון ידני"
            },
            ar: {
                totalSavings: "إجمالي هدف التوفير",
                monthlyDebitTotal: "إجمالي الأوامر المستديمة",
                couplePlan: "حساب زوجي نشط",
                autoMonthly: "خصم شهري تلقائي",
                addGoalTitle: "تحديد هدف التوفير والأمر المستديم",
                goalNameLabel: "اسم الهدف",
                targetAmountLabel: "المبلغ المستهدف",
                targetDateLabel: "تاريخ الهدف",
                enableStandingOrder: "تفعيل الأمر المستديم (الدفع الاقتطاعי)",
                monthlyDebitLabel: "مبلغ الأمر المستديم الشهري",
                debitEndDateLabel: "تاريخ انتهاء الأمر المستديم",
                saveGoalBtn: "إنشاء خطة التوفير",
                tabOverview: "لوحة التحكم",
                tabGoals: "الأهداف",
                tabDebits: "الأوامر المستديمة",
                targetDateShort: "تاريخ الهدف",
                debitEndShort: "انتهاء الأمر المستديم",
                monthlyShort: "إيداع شهري",
                noDebit: "توفير يدوي"
            },
            es: {
                totalSavings: "Objetivo de Ahorro Total",
                monthlyDebitTotal: "Órdenes Permanentes Mensuales",
                couplePlan: "Cuenta en Pareja Activa",
                autoMonthly: "Deducido mensualmente",
                addGoalTitle: "Definir Objetivo y Orden Permanente",
                goalNameLabel: "Nombre del Objetivo",
                targetAmountLabel: "Monto Objetivo",
                targetDateLabel: "Fecha Límite de Ahorro",
                enableStandingOrder: "Activar Orden Permanente (Débito Directo)",
                monthlyDebitLabel: "Monto Mensual de Orden Permanente",
                debitEndDateLabel: "Fecha de Finalización de Orden",
                saveGoalBtn: "Crear Plan de Ahorro",
                tabOverview: "Panel",
                tabGoals: "Metas",
                tabDebits: "Débitos Directos",
                targetDateShort: "Fecha Límite",
                debitEndShort: "Fin de Orden",
                monthlyShort: "Depósito Mensual",
                noDebit: "Ahorro Manual"
            },
            fr: {
                totalSavings: "Objectif d'Épargne Total",
                monthlyDebitTotal: "Prélèvements Automatiques",
                couplePlan: "Compte de Couple Actif",
                autoMonthly: "Déduit mensuellement",
                addGoalTitle: "Définir Objectif et Prélèvement",
                goalNameLabel: "Nom de l'Objectif",
                targetAmountLabel: "Montant Cible",
                targetDateLabel: "Date Cible d'Épargne",
                enableStandingOrder: "Activer Prélèvement Automatique",
                monthlyDebitLabel: "Montant du Prélèvement Mensuel",
                debitEndDateLabel: "Date de Fin du Prélèvement",
                saveGoalBtn: "Créer un Plan d'Épargne",
                tabOverview: "Aperçu",
                tabGoals: "Objectifs",
                tabDebits: "Prélèvements",
                targetDateShort: "Date Cible",
                debitEndShort: "Fin de Prélèvement",
                monthlyShort: "Dépôt Mensuel",
                noDebit: "Épargne Manuelle"
            },
            de: {
                totalSavings: "Gesamtes Sparziel",
                monthlyDebitTotal: "Monatliche Daueraufträge",
                couplePlan: "Paarkonto Aktiv",
                autoMonthly: "Monatlich abgebucht",
                addGoalTitle: "Sparziel & Dauerauftrag Festlegen",
                goalNameLabel: "Name des Sparziels",
                targetAmountLabel: "Zielbetrag",
                targetDateLabel: "Ziel-Datum",
                enableStandingOrder: "Dauerauftrag (Lastschrift) aktivieren",
                monthlyDebitLabel: "Monatlicher Dauerauftrag",
                debitEndDateLabel: "Enddatum des Dauerauftrags",
                saveGoalBtn: "Sparplan Erstellen",
                tabOverview: "Übersicht",
                tabGoals: "Ziele",
                tabDebits: "Daueraufträge",
                targetDateShort: "Zieldatum",
                debitEndShort: "Ende Dauerauftrag",
                monthlyShort: "Monatliche Rate",
                noDebit: "Manuelles Sparen"
            },
            it: {
                totalSavings: "Obiettivo di Risparmio Totale",
                monthlyDebitTotal: "Ordini Permanenti Mensili",
                couplePlan: "Conto di Coppia Attivo",
                autoMonthly: "Addebito mensile",
                addGoalTitle: "Definisci Obiettivo e Ordine Permanente",
                goalNameLabel: "Nome Obiettivo",
                targetAmountLabel: "Importo Target",
                targetDateLabel: "Data Target Risparmio",
                enableStandingOrder: "Attiva Addebito Diretto / Ordine Permanente",
                monthlyDebitLabel: "Importo Mensile Addebito",
                debitEndDateLabel: "Data Fine Addebito",
                saveGoalBtn: "Crea Piano di Risparmio",
                tabOverview: "Dashboard",
                tabGoals: "Obiettivi",
                tabDebits: "Addebiti",
                targetDateShort: "Data Target",
                debitEndShort: "Fine Addebito",
                monthlyShort: "Deposito Mensile",
                noDebit: "Risparmio Manuale"
            },
            pt: {
                totalSavings: "Meta de Poupança Total",
                monthlyDebitTotal: "Débitos Diretos Mensais",
                couplePlan: "Conta Conjunta Ativa",
                autoMonthly: "Deduzido mensalmente",
                addGoalTitle: "Definir Meta e Débito Direto",
                goalNameLabel: "Nome da Meta",
                targetAmountLabel: "Valor Meta",
                targetDateLabel: "Data Limite da Meta",
                enableStandingOrder: "Ativar Débito Direto / Ordem Permanente",
                monthlyDebitLabel: "Valor Mensal do Débito",
                debitEndDateLabel: "Data Término do Débito",
                saveGoalBtn: "Criar Plano de Poupança",
                tabOverview: "Painel",
                tabGoals: "Metas",
                tabDebits: "Débitos",
                targetDateShort: "Data Limite",
                debitEndShort: "Fim do Débito",
                monthlyShort: "Depósito Mensal",
                noDebit: "Poupança Manual"
            },
            ru: {
                totalSavings: "Общая Цель Накоплений",
                monthlyDebitTotal: "Ежемесячные Автоплатежи",
                couplePlan: "Совместный Счет Активен",
                autoMonthly: "Списывается ежемесячно",
                addGoalTitle: "Настроить Накопления и Автоплатеж",
                goalNameLabel: "Название Цели",
                targetAmountLabel: "Целевая Сумма",
                targetDateLabel: "Дата Окончания Накопления",
                enableStandingOrder: "Включить Автоплатеж (הוראת קבע)",
                monthlyDebitLabel: "Сумма Ежемесячного Платежа",
                debitEndDateLabel: "Дата Окончания Автоплатежа",
                saveGoalBtn: "Создать План Накоплений",
                tabOverview: "Обзор",
                tabGoals: "Цели",
                tabDebits: "Автоплатежи",
                targetDateShort: "Срок Цели",
                debitEndShort: "Конец Автоплатежа",
                monthlyShort: "Взнос в Месяц",
                noDebit: "Ручные Взносы"
            },
            zh: {
                totalSavings: "总储蓄目标",
                monthlyDebitTotal: "每月自动扣款总额",
                couplePlan: "情侣/夫妻共同账户已激活",
                autoMonthly: "每月自动扣除",
                addGoalTitle: "设定储蓄目标与定额扣款",
                goalNameLabel: "目标名称",
                targetAmountLabel: "目标金额",
                targetDateLabel: "储蓄截止日期",
                enableStandingOrder: "开启定期自动扣款 (Direct Debit)",
                monthlyDebitLabel: "每月扣款金额",
                debitEndDateLabel: "自动扣款结束日期",
                saveGoalBtn: "创建储蓄计划",
                tabOverview: "仪表盘",
                tabGoals: "储蓄目标",
                tabDebits: "自动扣款",
                targetDateShort: "目标日期",
                debitEndShort: "扣款结束",
                monthlyShort: "每月存入",
                noDebit: "手动储蓄"
            },
            ja: {
                totalSavings: "総貯蓄目標額",
                monthlyDebitTotal: "毎月の口座振替合計",
                couplePlan: "カップル口座アクティブ",
                autoMonthly: "毎月自動引き落とし",
                addGoalTitle: "貯蓄目標と自動振替の設定",
                goalNameLabel: "目標名",
                targetAmountLabel: "目標金額",
                targetDateLabel: "貯蓄目標期限",
                enableStandingOrder: "自動口座振替を有効化",
                monthlyDebitLabel: "毎月の振替金額",
                debitEndDateLabel: "口座振替終了日",
                saveGoalBtn: "貯蓄プランを作成",
                tabOverview: "ダッシュボード",
                tabGoals: "貯蓄目標",
                tabDebits: "口座振替",
                targetDateShort: "目標日",
                debitEndShort: "振替終了日",
                monthlyShort: "毎月の積立",
                noDebit: "手動貯蓄"
            }
        };

        let currentLang = 'en';
        let currentCurrency = 'USD';
        let goals = [];

        function changeLanguage(lang) {
            currentLang = lang;
            const isRtl = lang === 'he' || lang === 'ar';
            document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
            document.documentElement.lang = lang;

            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });

            renderGoals();
            updateMetrics();
        }

        function changeCurrency(currency) {
            currentCurrency = currency;
            renderGoals();
            updateMetrics();
        }

        function formatCurrency(valInUSD) {
            const convertedVal = valInUSD * exchangeRates[currentCurrency];
            return new Intl.NumberFormat(currentLang, {
                style: 'currency',
                currency: currentCurrency
            }).format(convertedVal);
        }

        function formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat(currentLang, { dateStyle: 'medium' }).format(date);
        }

        function toggleStandingOrderFields(checked) {
            document.getElementById('debitAmountGroup').style.display = checked ? 'flex' : 'none';
            document.getElementById('debitEndGroup').style.display = checked ? 'flex' : 'none';
        }

        function handleFormSubmit(e) {
            e.preventDefault();

            const name = document.getElementById('goalName').value;
            const targetAmount = parseFloat(document.getElementById('targetAmount').value);
            const targetDate = document.getElementById('targetDate').value;
            const hasStandingOrder = document.getElementById('hasStandingOrder').checked;
            const monthlyDebit = hasStandingOrder ? parseFloat(document.getElementById('monthlyDebitAmount').value || 0) : 0;
            const debitEndDate = hasStandingOrder ? document.getElementById('debitEndDate').value : null;

            // Convert inputs into Base USD for internal store
            const rate = exchangeRates[currentCurrency];
            const newGoal = {
                id: Date.now(),
                name,
                targetAmountUSD: targetAmount / rate,
                targetDate,
                hasStandingOrder,
                monthlyDebitUSD: monthlyDebit / rate,
                debitEndDate
            };

            goals.push(newGoal);
            document.getElementById('goalForm').reset();
            toggleStandingOrderFields(false);

            renderGoals();
            updateMetrics();
        }

        function updateMetrics() {
            const totalTargetUSD = goals.reduce((sum, g) => sum + g.targetAmountUSD, 0);
            const totalDebitUSD = goals.reduce((sum, g) => sum + (g.monthlyDebitUSD || 0), 0);

            document.getElementById('totalSavingsVal').textContent = formatCurrency(totalTargetUSD);
            document.getElementById('totalDebitVal').textContent = formatCurrency(totalDebitUSD);
        }

        function renderGoals() {
            const container = document.getElementById('goalsContainer');
            container.innerHTML = '';

            const t = translations[currentLang];

            goals.forEach(goal => {
                const card = document.createElement('div');
                card.className = 'goal-item-card';

                card.innerHTML = `
                    <div>
                        <div class="goal-header">
                            <h3 style="font-size:1.1rem;">${goal.name}</h3>
                            <span class="badge">${goal.hasStandingOrder ? t.tabDebits : t.noDebit}</span>
                        </div>
                        <div style="font-size:1.4rem; font-weight:700;">${formatCurrency(goal.targetAmountUSD)}</div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: 25%"></div>
                        </div>
                    </div>
                    <div class="details-list">
                        <div class="details-item">
                            <span>${t.targetDateShort}:</span>
                            <strong>${formatDate(goal.targetDate)}</strong>
                        </div>
                        ${goal.hasStandingOrder ? `
                            <div class="details-item">
                                <span>${t.monthlyShort}:</span>
                                <strong>${formatCurrency(goal.monthlyDebitUSD)}</strong>
                            </div>
                            <div class="details-item">
                                <span>${t.debitEndShort}:</span>
                                <strong>${formatDate(goal.debitEndDate)}</strong>
                            </div>
                        ` : ''}
                    </div>
                `;
                container.appendChild(card);
            });
        }

        // Initialize default view
        changeLanguage('en');
    </script>
</body>
</html>
