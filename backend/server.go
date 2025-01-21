package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"demo/firebase"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

type Account struct {
	Branch           string `json:"branch"`
	AccountNumber    string `json:"number"`
	AccountType      string `json:"type"`
	AccountName      string `json:"name"`
	Balance          int64  `json:"currentBalance"`
	AvailableBalance int64  `json:"availableBalance"`
	Currency         string `json:"currency"`
}

type Transaction struct {
	TransactionID string    `json:"transactionId"`
	AccountNumber string    `json:"accountNumber"`
	FromAccount   string    `json:"fromAccount"`
	ToAccount     string    `json:"toAccount"`
	ToAccountName string    `json:"toAccountName"`
	ToBank        string    `json:"toBank"`
	Type          string    `json:"type"`
	Amount        int64     `json:"amount"`
	Currency      string    `json:"currency"`
	Note          string    `json:"note"`
	TransferredAt time.Time `json:"transferredAt"`
}

type Schedule struct {
	ScheduleID    string    `json:"scheduleId"`
	FromAccount   string    `json:"fromAccount"`
	ToAccount     string    `json:"toAccount"`
	ToAccountName string    `json:"toAccountName"`
	ToBank        string    `json:"toBank"`
	Amount        int64     `json:"amount"`
	Note          string    `json:"note"`
	ScheduleDate  time.Time `json:"date"`
}

// Request & Response Structs
type TransferRequest struct {
	FromAccount string `json:"fromAccount" binding:"required"`
	ToAccount   string `json:"toAccount" binding:"required"`
	ToBank      string `json:"toBank" binding:"required"`
	Amount      int64  `json:"amount" binding:"required"`
	Currency    string `json:"currency" binding:"required"`
	Note        string `json:"note"`
}

type TransferResponse struct {
	TransactionID string `json:"transactionId"`
	Status        string `json:"status"`
	TransferredAt string `json:"transferredAt"`
}

type ScheduleRequest struct {
	FromAccount string `json:"fromAccount" binding:"required"`
	ToAccount   string `json:"toAccount" binding:"required"`
	ToBank      string `json:"toBank" binding:"required"`
	Amount      int64  `json:"amount" binding:"required"`
	Currency    string `json:"currency" binding:"required"`
	Note        string `json:"note"`
	Schedule    string `json:"schedule" binding:"required"` // "ONCE" or "MONTHLY"
	StartDate   string `json:"startDate" binding:"required"`
	EndDate     string `json:"endDate"`
}

type ScheduleResponse struct {
	ScheduleID   string `json:"scheduleId"`
	Status       string `json:"status"`
	NextRunDate  string `json:"nextRunDate"`
	EndDate      string `json:"endDate"`
	ScheduleType string `json:"scheduleType"`
}

type Handler struct {
	db *sql.DB
}

// Handlers
func (h *Handler) GetBalance(c *gin.Context) {
	accountNo := c.Param("accountNumber")
	var account Account
	err := h.db.QueryRow(`
        SELECT branch, account_number, type, account_name, balance, available_balance, Currency
        FROM accounts
        WHERE account_number = $1`,
		accountNo).Scan(&account.Branch, &account.AccountNumber, &account.AccountType, &account.AccountName, &account.Balance, &account.AvailableBalance, &account.Currency)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get balance"})
		return
	}

	c.JSON(http.StatusOK, account)
}

func (h *Handler) GetAllTransactions(c *gin.Context) {
	rows, err := h.db.Query(`
        SELECT transaction_id, account_number, from_account, to_account, to_account_name, to_bank, type, amount, currency, note, transferred_at
        FROM transactions
        ORDER BY transferred_at DESC
    `)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get transactions"})
		return
	}

	defer rows.Close()

	var transactions []Transaction
	for rows.Next() {
		var txn Transaction
		var transferredAt string
		err := rows.Scan(&txn.TransactionID, &txn.AccountNumber, &txn.FromAccount, &txn.ToAccount, &txn.ToAccountName, &txn.ToBank, &txn.Type, &txn.Amount, &txn.Currency, &txn.Note, &transferredAt)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get transactions"})
			return
		}
		at, err := time.Parse("2006-01-02 15:04:05", transferredAt)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get transactions"})
			return
		}
		txn.TransferredAt = at
		transactions = append(transactions, txn)
	}

	c.JSON(http.StatusOK, transactions)
}

func (h *Handler) GetTransactions(c *gin.Context) {
	accountNo := c.Param("accountNumber")
	rows, err := h.db.Query(`
        SELECT transaction_id, account_number, from_account, to_account, to_account_name, to_bank, type, amount, currency, note, transferred_at
        FROM transactions
        WHERE account_number = $1
        ORDER BY transferred_at DESC
        `, accountNo)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get transactions"})
		return
	}
	defer rows.Close()

	var transactions []Transaction
	for rows.Next() {
		var txn Transaction
		var transferredAt string
		err := rows.Scan(&txn.TransactionID, &txn.AccountNumber, &txn.FromAccount, &txn.ToAccount, &txn.ToAccountName, &txn.ToBank, &txn.Type, &txn.Amount, &txn.Currency, &txn.Note, &transferredAt)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get transactions"})
			return
		}
		at, err := time.Parse("2006-01-02 15:04:05", transferredAt)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get transactions"})
			return
		}
		txn.TransferredAt = at
		transactions = append(transactions, txn)
	}

	c.JSON(http.StatusOK, transactions)
}

func (h *Handler) GetSchedules(c *gin.Context) {
	accountNo := c.Param("accountNumber")
	rows, err := h.db.Query(`
        SELECT schedule_id, from_account, to_account, to_account_name, to_bank, amount, note, schedule_date
        FROM schedules
        WHERE from_account = $1
        AND status = 'SCHEDULED'
        ORDER BY schedule_date ASC
        `, accountNo)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get schedules"})
		return
	}
	defer rows.Close()

	schedules := []Schedule{}
	for rows.Next() {
		var sch Schedule
		var scheduleDate string
		err := rows.Scan(&sch.ScheduleID, &sch.FromAccount, &sch.ToAccount, &sch.ToAccountName, &sch.ToBank, &sch.Amount, &sch.Note, &scheduleDate)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get schedules"})
			return
		}
		sd, err := time.Parse("2006-01-02 15:04:05", scheduleDate)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get schedules"})
			return
		}
		sch.ScheduleDate = sd
		schedules = append(schedules, sch)
	}

	c.JSON(http.StatusOK, schedules)
}

func (h *Handler) CreateSchedules(c *gin.Context) {
	var req ScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	format := "2006-01-02 15:04:05"
	if _, err := time.Parse(format, req.StartDate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start date"})
		return
	}

	if _, err := time.Parse(format, req.EndDate); req.EndDate != "" && err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end date"})
		return
	}

	var toAccountName string
	err := h.db.QueryRow(`
        SELECT account_name
        FROM accounts
        WHERE account_number = $1`,
		req.ToAccount).Scan(&toAccountName)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	if firebase.IsDisabled("enable_schedule_once") && req.Schedule == "once" {
		msg := "one time schedule transfer is unavailable"
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	if firebase.IsDisabled("enable_schedule_monthly") && req.Schedule == "monthly" {
		msg := "monthly schedule transfer is unavailable"
		c.JSON(http.StatusBadRequest, gin.H{"error": msg})
		return
	}

	schID := scheduleID()
	status := "SCHEDULED"

	_, err = h.db.Exec(`
        INSERT INTO schedules (schedule_id, from_account, to_account, to_account_name, to_bank, amount, currency, note, status, schedule, schedule_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
		schID, req.FromAccount, req.ToAccount, toAccountName, req.ToBank, req.Amount, req.Currency, req.Note, status, req.Schedule, req.StartDate, req.EndDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to schedule transfer"})
		return
	}

	resp := ScheduleResponse{
		ScheduleID:   schID,
		Status:       status,
		NextRunDate:  req.StartDate,
		EndDate:      req.EndDate,
		ScheduleType: req.Schedule,
	}

	c.JSON(http.StatusOK, resp)
}

func transactionID() string {
	rd := rand.New(rand.NewSource(time.Now().UnixNano()))
	return fmt.Sprintf("TXN%v", rd.Intn(1000000000))
}

func (h *Handler) CreateTransfer(c *gin.Context) {
	var req TransferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 0. validate account balance
	var balance int64
	err := h.db.QueryRow(`
        SELECT balance
        FROM accounts
        WHERE account_number = $1`,
		req.FromAccount).Scan(&balance)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}
	if balance < req.Amount {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient balance"})
		return
	}

	var toAccountName string
	err = h.db.QueryRow(`
        SELECT account_name
        FROM accounts
        WHERE account_number = $1`,
		req.ToAccount).Scan(&toAccountName)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	tx, err := h.db.Begin()
	txID := transactionID()
	stamp := time.Now().Format("2006-01-02 15:04:05")

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	_, err = tx.Exec(`
        INSERT INTO transactions (transaction_id, account_number, from_account, to_account, to_account_name, to_bank, amount, currency, type, note, transferred_at)
        VALUES
            ($1, $2, $2, $3, $4, $5, $6, $7, $8, $9, $10),
            ($1, $3, $2, $3, $4, $5, $11, $7, $12, $9, $10)
        `,
		txID, req.FromAccount, req.ToAccount, toAccountName, req.ToBank, -req.Amount, req.Currency, "Transfer out", req.Note, stamp, req.Amount, "Transfer in")
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	// 3. update balance in accounts TABLE
	_, err = tx.Exec(`
        UPDATE accounts
        SET balance = balance - $1
        WHERE account_number = $2`,
		req.Amount, req.FromAccount)
	// 4. return response
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	// 5. update balance in to_account
	_, err = tx.Exec(`
        UPDATE accounts
        SET balance = balance + $1
        WHERE account_number = $2`,
		req.Amount, req.ToAccount)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	err = tx.Commit()
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	resp := TransferResponse{
		TransactionID: txID,
		Status:        "Transferred",
		TransferredAt: stamp,
	}

	c.JSON(http.StatusOK, resp)
}

func scheduleID() string {
	rd := rand.New(rand.NewSource(time.Now().UnixNano()))
	return fmt.Sprintf("SCH%v", rd.Intn(1000000000))
}

func (h *Handler) ScheduleTransfer(c *gin.Context) {
	var req ScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if firebase.IsEnabled("enable_schedule_once") && req.Schedule == "once" {
		schID := scheduleID()
		status := "scheduled"

		_, err := h.db.Exec(`
        INSERT INTO schedules (schedule_id, from_account, to_account, amount, currency, note, status, schedule, schedule_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
			schID, req.FromAccount, req.ToAccount, req.Amount, req.Currency, req.Note, status, req.Schedule, req.StartDate, req.EndDate)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to schedule transfer"})
			return
		}

		resp := ScheduleResponse{
			ScheduleID:   schID,
			Status:       status,
			NextRunDate:  req.StartDate,
			EndDate:      req.EndDate,
			ScheduleType: req.Schedule,
		}

		c.JSON(http.StatusOK, resp)
		return
	}

	if firebase.IsEnabled("enable_schedule_monthly") && req.Schedule == "monthly" {
		schID := scheduleID()
		status := "scheduled"

		_, err := h.db.Exec(`
        INSERT INTO schedules (schedule_id, from_account, to_account, amount, currency, note, status, schedule, schedule_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
			schID, req.FromAccount, req.ToAccount, req.Amount, req.Currency, req.Note, status, req.Schedule, req.StartDate, req.EndDate)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to schedule transfer"})
			return
		}

		resp := ScheduleResponse{
			ScheduleID:   schID,
			Status:       status,
			NextRunDate:  req.StartDate,
			EndDate:      req.EndDate,
			ScheduleType: req.Schedule,
		}

		c.JSON(http.StatusOK, resp)
		return
	}

	msg := fmt.Sprintf("%s schedule transfer is unavailable", req.Schedule)
	c.JSON(http.StatusBadRequest, gin.H{"error": msg})
}

func main() {
	bankDB := "./bank.sqlite"
	// reset database
	err := os.Remove(bankDB)
	if err != nil {
		log.Println(err)
	}

	db, err := sql.Open("sqlite", bankDB)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            branch TEXT NOT NULL DEFAULT '',
            account_number TEXT PRIMARY KEY,
            type TEXT NOT NULL DEFAULT '',
            account_name TEXT NOT NULL DEFAULT '',
            balance INTEGER NOT NULL DEFAULT 0,
            available_balance INTEGER NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'THB'
        )
        `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaction_id TEXT NOT NULL,
            account_number TEXT NOT NULL,
            from_account TEXT NOT NULL,
            to_account TEXT NOT NULL,
            to_account_name TEXT NOT NULL DEFAULT '',
            to_bank TEXT,
            type TEXT NOT NULL DEFAULT '',
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL,
            note TEXT,
            transferred_at TEXT NOT NULL
        )`)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS schedules (
            schedule_id TEXT PRIMARY KEY,
            from_account TEXT NOT NULL,
            to_account TEXT NOT NULL,
            to_account_name TEXT NOT NULL DEFAULT '',
            to_bank TEXT,
            type TEXT NOT NULL DEFAULT '',
            amount INTEGER NOT NULL,
            currency TEXT NOT NULL,
            note TEXT,
            status TEXT DEFAULT 'scheduled',
            schedule TEXT NOT NULL,
            schedule_date TEXT NOT NULL,
            end_date TEXT
        )`)
	if err != nil {
		log.Fatal(err)
	}

	// seed data
	_, err = db.Exec(`
        INSERT INTO accounts (branch, account_number, type, account_name, balance, available_balance, currency)
            VALUES
            ('Kalasin', '111-111-111', 'Savings', 'AnuchitO', 101282250, 101282250, 'THB'),
            ('KhonKean', '222-222-222', 'Savings', 'MaiThai', 96588150, 96588150, 'THB'),
            ('Bangkok', '333-333-333', 'Savings', 'LaumPlearn', 105500, 105500, 'THB'),
            ('Udon', '444-444-444', 'Savings', 'Laumcing', 199800, 199800, 'THB')
        ON CONFLICT (account_number) DO UPDATE
        SET balance = EXCLUDED.balance,
            available_balance = EXCLUDED.available_balance;
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        INSERT INTO transactions (transaction_id, account_number, from_account, to_account, to_account_name, to_bank, amount, currency, type, note, transferred_at)
        VALUES
            ('TXN123456789', '111-111-111', '111-111-111', '222-222-222', 'MaiThai', 'KTB',  98982500, 'THB', 'Transfer in', 'Lunch', '2024-11-10 14:22:00'),
            ('TXN123456789', '222-222-222', '111-111-111', '222-222-222', 'MaiThai', 'KTB', -98982500, 'THB', 'Transfer out', 'Lunch', '2024-11-10 14:22:00'),

            ('TXN120456799', '111-111-111', '111-111-111', '444-444-444', 'Laumcing', 'KBank', -2300000, 'THB', 'Transfer out', 'Dinner', '2024-12-10 14:22:00'),
            ('TXN120456799', '444-444-444', '111-111-111', '444-444-444', 'Laumcing', 'KBank',  2300000, 'THB', 'Transfer in', 'Dinner', '2024-12-10 14:22:00'),


            ('TXN987634521', '111-111-111', '111-111-111', '333-333-333', 'LaumPlearn', 'SCB',  2499850, 'THB', 'Transfer in', 'Dinner', '2025-01-13 18:00:00'),
            ('TXN987634521', '333-333-333', '111-111-111', '333-333-333', 'LaumPlearn', 'SCB', -2499850, 'THB', 'Transfer out', 'Dinner', '2025-01-13 18:00:00'),


            ('TXN123416629', '111-111-111', '111-111-111', '222-222-222', 'MaiThai', 'KTB', -399900, 'THB', 'Transfer out', 'Breakfast', '2025-01-14 14:22:00'),
            ('TXN123416629', '222-222-222', '111-111-111', '222-222-222', 'MaiThai', 'KTB',  399900, 'THB', 'Transfer in', 'Breakfast', '2025-01-14 14:22:00'),

            ('TXN987654331', '222-222-222', '222-222-222', '333-333-333', 'LaumPlearn', 'SCB', -2394350, 'THB', 'Transfer out', 'Dinner', '2021-09-01 18:00:00'),
            ('TXN987654331', '333-333-333', '222-222-222', '333-333-333', 'LaumPlearn', 'SCB',  2394350, 'THB', 'Transfer in', 'Dinner', '2021-09-01 18:00:00'),

            ('TXN123434267', '111-111-111', '111-111-111', '444-444-444', 'Laumcing',  'KBank', -2499800, 'THB', 'Transfer out', 'Lunch', '2025-01-10 14:22:00'),
            ('TXN123456789', '444-444-444', '111-111-111', '444-444-444', 'Laumcing',  'KBank',  2499800, 'THB', 'Transfer in', 'Lunch', '2025-01-10 14:22:00')
        ON CONFLICT DO NOTHING;
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        INSERT INTO schedules (schedule_id, from_account, to_account, to_account_name, to_bank, amount, currency, note, schedule, status, schedule_date, end_date)
        VALUES
            ('SCH123456789', '111-111-111', '222-222-222', 'MaiThai', 'KTB', -1899900, 'THB', 'Breakfast', 'once', 'SCHEDULED', '2025-09-01 12:00:00', '2030-09-01 12:00:00'),
            ('SCH987654321', '111-111-111', '333-333-333', 'LaumPlearn', 'SCB', -2499850, 'THB', 'Lunch', 'once', 'SCHEDULED', '2025-09-01 12:00:00', '2030-09-01 12:00:00'),
            ('SCH123434267', '111-111-111', '444-444-444', 'Laumcing', 'KBank', -2398825, 'THB', 'Dinner', 'once', 'SCHEDULED', '2025-09-01 12:00:00', '2030-09-01 12:00:00')
        ON CONFLICT DO NOTHING;
    `)
	if err != nil {
		log.Fatal(err)
	}

	sa, err := firebase.ReadServiceAccount("service-account.json")
	if err != nil {
		log.Fatal(err)
	}

	err = GetFirebaseRemoteConfig(sa)
	if err != nil {
		log.Fatal(err)
	}

	ticker := time.NewTicker(10 * time.Second)
	go func() {
		var lastVersion string
		tokenSource := firebase.Authen(sa)
		for range ticker.C {
			token, err := tokenSource.Token()
			if err != nil {
				log.Printf("Error: %v\n", err)
			}
			ver, err := firebase.ListVersion(*token, sa.ProjectID)
			if len(ver) > 0 && ver[0].VersionNumber != lastVersion {
				lastVersion = ver[0].VersionNumber

				err = GetFirebaseRemoteConfig(sa)
				if err != nil {
					log.Printf("Error: %v\n", err)
				}
			}
		}
	}()

	h := &Handler{db: db}

	router := gin.Default()
	router.Use(cors.Default())
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	})

	// Routes
	router.GET("/accounts/:accountNumber/balances", h.GetBalance)
	router.GET("/accounts/:accountNumber/transactions", h.GetTransactions)
	router.GET("/accounts/:accountNumber/schedules", h.GetSchedules)
	router.GET("/transactions", h.GetAllTransactions)

	router.POST("/accounts/:accountNumber/transfers", h.CreateTransfer)
	router.POST("/accounts/:accountNumber/schedules", h.CreateSchedules)

	router.GET("/features", func(c *gin.Context) {
		c.JSON(http.StatusOK, firebase.AllConfigs())
	})

	// Start server
	router.Run(":8080")
}

func GetFirebaseRemoteConfig(sa firebase.ServiceAccount) error {
	tokenSource := firebase.Authen(sa)
	token, err := tokenSource.Token()
	if err != nil {
		return err
	}

	conf, err := firebase.GetRemoteConfig(*token, sa.ProjectID)
	if err != nil {
		return err
	}

	firebase.SetRemoteConfig(conf)
	return nil
}
