package main

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

type Account struct {
	AccountNumber string  `json:"accountNumber"`
	AccountName   string  `json:"accountName"`
	Balance       float64 `json:"balance"`
	Currency      string  `json:"currency"`
}

// Request & Response Structs
type TransferRequest struct {
	AccountNumber    string  `json:"accountNumber" binding:"required"`
	RecipientAccount string  `json:"recipientAccount" binding:"required"`
	Amount           float64 `json:"amount" binding:"required"`
	Currency         string  `json:"currency" binding:"required"`
	Description      string  `json:"description"`
}

type TransferResponse struct {
	TransactionID string    `json:"transactionId"`
	Status        string    `json:"status"`
	TransferredAt time.Time `json:"transferredAt"`
}

type ScheduleRequest struct {
	AccountNumber    string    `json:"accountNumber" binding:"required"`
	RecipientAccount string    `json:"recipientAccount" binding:"required"`
	Amount           float64   `json:"amount" binding:"required"`
	Currency         string    `json:"currency" binding:"required"`
	Description      string    `json:"description"`
	Schedule         string    `json:"schedule" binding:"required"` // "once" or "monthly"
	ScheduleDate     time.Time `json:"scheduleDate" binding:"required"`
	EndDate          time.Time `json:"endDate"`
}

type ScheduleResponse struct {
	ScheduleID   string    `json:"scheduleId"`
	Status       string    `json:"status"`
	NextRunDate  time.Time `json:"nextRunDate"`
	EndDate      time.Time `json:"endDate"`
	ScheduleType string    `json:"scheduleType"`
}

type Handler struct {
	db *sql.DB
}

// Handlers
func (h *Handler) GetBalance(c *gin.Context) {
	accountNo := c.Param("accountNumber")
	var account Account
	err := h.db.QueryRow(`
        SELECT account_number, account_name, balance, currency
        FROM accounts
        WHERE account_number = $1`,
		accountNo).Scan(&account.AccountNumber, &account.AccountName, &account.Balance, &account.Currency)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to get balance"})
		return
	}

	c.JSON(http.StatusOK, account)
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
	var balance float64
	err := h.db.QueryRow(`
        SELECT balance
        FROM accounts
        WHERE account_number = $1`,
		req.AccountNumber).Scan(&balance)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}
	if balance < req.Amount {
		c.JSON(http.StatusBadRequest, gin.H{"error": "insufficient balance"})
		return
	}

	tx, err := h.db.Begin()
	// 1. create trascationID
	txID := transactionID()
	stamp := time.Now()

	// 2. insert to transfers TABLE
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
	}

	_, err = tx.Exec(`
        INSERT INTO transfers (transaction_id, sender_account, recipient_account, amount, currency, description, transferred_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		txID, req.AccountNumber, req.RecipientAccount, req.Amount, req.Currency, req.Description, stamp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	// 3. update balance in accounts TABLE
	_, err = tx.Exec(`
        UPDATE accounts
        SET balance = balance - $1
        WHERE account_number = $2`,
		req.Amount, req.AccountNumber)
	// 4. return response
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to create transfer"})
		return
	}

	err = tx.Commit()
	if err != nil {
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

	if os.Getenv("ENABLE_SCHEDULE_ONCE") == "true" && req.Schedule == "once" {
		schID := scheduleID()
		status := "scheduled"

		_, err := h.db.Exec(`
        INSERT INTO schedules (schedule_id, sender_account, recipient_account, amount, currency, description, status, schedule, schedule_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
			schID, req.AccountNumber, req.RecipientAccount, req.Amount, req.Currency, req.Description, status, req.Schedule, req.ScheduleDate, req.EndDate)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to schedule transfer"})
			return
		}

		resp := ScheduleResponse{
			ScheduleID:   schID,
			Status:       status,
			NextRunDate:  req.ScheduleDate,
			EndDate:      req.EndDate,
			ScheduleType: req.Schedule,
		}

		c.JSON(http.StatusOK, resp)
		return
	}

	if os.Getenv("ENABLE_SCHEDULE_MONTHLY") == "true" && req.Schedule == "monthly" {

		schID := scheduleID()
		status := "scheduled"

		_, err := h.db.Exec(`
        INSERT INTO schedules (schedule_id, sender_account, recipient_account, amount, currency, description, status, schedule, schedule_date, end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
			schID, req.AccountNumber, req.RecipientAccount, req.Amount, req.Currency, req.Description, status, req.Schedule, req.ScheduleDate, req.EndDate)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to schedule transfer"})
			return
		}

		resp := ScheduleResponse{
			ScheduleID:   schID,
			Status:       status,
			NextRunDate:  req.ScheduleDate,
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
	router := gin.Default()
	db, err := sql.Open("sqlite", "./bank.sqlite")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS accounts (
            account_number TEXT PRIMARY KEY,
            account_name TEXT NOT NULL,
            balance REAL NOT NULL,
            currency TEXT NOT NULL
        )
        `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS transfers (
            transaction_id TEXT PRIMARY KEY,
            sender_account TEXT NOT NULL,
            recipient_account TEXT NOT NULL,
            amount REAL NOT NULL,
            currency TEXT NOT NULL,
            description TEXT,
            transferred_at TEXT NOT NULL
        )`)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS schedules (
            schedule_id TEXT PRIMARY KEY,
            sender_account TEXT NOT NULL,
            recipient_account TEXT NOT NULL,
            amount REAL NOT NULL,
            currency TEXT NOT NULL,
            description TEXT,
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
        INSERT INTO accounts (account_number, account_name, balance, currency)
        VALUES
            ('111-111-111', 'John Doe', 50000.00, 'THB'),
            ('222-222-222', 'Alice', 20000.00, 'THB'),
            ('333-333-333', 'Bob', 10000.00, 'THB')
        ON CONFLICT DO NOTHING;
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        INSERT INTO transfers (transaction_id, sender_account, recipient_account, amount, currency, description, transferred_at)
        VALUES
            ('TXN123456789', '111-111-111', '222-222-222', 1000.00, 'THB', 'Lunch', '2021-09-01 12:00:00'),
            ('TXN987654321', '222-222-222', '333-333-333', 500.00, 'THB', 'Dinner', '2021-09-01 18:00:00')
        ON CONFLICT DO NOTHING;
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
        INSERT INTO schedules (schedule_id, sender_account, recipient_account, amount, currency, description, schedule, schedule_date, end_date)
        VALUES
            ('SCH123456789', '111-111-111', '222-222-222', 1000.00, 'THB', 'Lunch', 'once', '2021-09-01 12:00:00', '2021-09-01 12:00:00'),
            ('SCH987654321', '111-111-111', '222-222-222', 500.00, 'THB', 'Dinner', 'monthly', '2021-09-01 18:00:00', '2021-09-01 18:00:00')
        ON CONFLICT DO NOTHING;
    `)
	if err != nil {
		log.Fatal(err)
	}

	h := &Handler{db: db}

	// Routes
	router.GET("/accounts/:accountNumber/balances", h.GetBalance)
	router.POST("/transfers", h.CreateTransfer)
	router.POST("/schedules", h.ScheduleTransfer)

	// Start server
	router.Run(":8080")
}
