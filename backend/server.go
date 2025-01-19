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

	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)

type Account struct {
	Branch           string  `json:"branch"`
	AccountNumber    string  `json:"number"`
	AccountType      string  `json:"type"`
	AccountName      string  `json:"name"`
	Balance          float64 `json:"currentBalance"`
	AvailableBalance float64 `json:"availableBalance"`
	Currency         string  `json:"currency"`
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

	if firebase.IsEnabled("enable_schedule_once") && req.Schedule == "once" {
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

	if firebase.IsEnabled("enable_schedule_monthly") && req.Schedule == "monthly" {
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
            balance REAL NOT NULL DEFAULT 0,
            available_balance REAL NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'THB'
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
        INSERT INTO accounts (branch, account_number, type, account_name, balance, available_balance, currency)
        VALUES
            ('Kalasin', '111-111-111', 'Saving', 'AnuchitO', 98898850.00, 98898850.00, 'THB'),
            ('KhonKean', '222-222-222', 'Saving', 'MaiThai', 55555500.00, 55555500.00, 'THB'),
            ('Bangkok', '333-333-333', 'Saving', 'LaumPlearn', 333000.00, 333000.00, 'THB')
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
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	// allow all origins
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	})

	// Routes
	router.GET("/accounts/:accountNumber/balances", h.GetBalance)
	router.POST("/transfers", h.CreateTransfer)
	router.POST("/schedules", h.ScheduleTransfer)

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
