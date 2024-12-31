package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
)

const firebaseURL = "https://firebaseremoteconfig.googleapis.com"

type ServiceAccount struct {
	AuthURI    string `json:"auth_uri"`
	ProjectID  string `json:"project_id"`
	Email      string `json:"client_email"`
	PrivateKey string `json:"private_key"`
}

func serviceAccount(filename string) (ServiceAccount, error) {
	b, err := os.ReadFile(filename)
	if err != nil {
		return ServiceAccount{}, err
	}
	sa := ServiceAccount{}
	err = json.Unmarshal(b, &sa)
	return sa, err
}

func Authen(c ServiceAccount) (oauth2.Token, error) {
	config := &jwt.Config{
		Email:      c.Email,
		PrivateKey: []byte(c.PrivateKey),
		Scopes: []string{
			"https://www.googleapis.com/auth/firebase.remoteconfig",
		},
		TokenURL: google.JWTTokenURL,
	}
	token, err := config.TokenSource(context.Background()).Token()
	if err != nil {
		return oauth2.Token{}, err
	}

	return *token, nil
}

// RemoteConfigResponse represents the full response from Firebase Remote Config API.
type RemoteConfig struct {
	Parameters map[string]Parameter `json:"parameters"`
	Version    Version              `json:"version"`
	Conditions []Condition          `json:"conditions,omitempty"`
}

// Parameter represents a single Remote Config parameter.
type Parameter struct {
	DefaultValue DefaultValue `json:"defaultValue"`
	Description  string       `json:"description,omitempty"`
	ValueType    string       `json:"valueType"`
}

// DefaultValue represents the default value of a parameter.
type DefaultValue struct {
	Value string `json:"value"`
}

// Version represents metadata about the configuration version.
type Version struct {
	VersionNumber  string     `json:"versionNumber"`
	UpdateTime     time.Time  `json:"updateTime"`
	UpdateUser     UpdateUser `json:"updateUser"`
	UpdateOrigin   string     `json:"updateOrigin"`
	UpdateType     string     `json:"updateType"`
	Rollbacksource string     `json:"rollbacksource"`
	IsLegacy       bool       `json:"isLegacy"`
}

// UpdateUser represents details about the user who updated the config.
type UpdateUser struct {
	Email string `json:"email"`
}

// Condition represents conditions in Firebase Remote Config.
type Condition struct {
	Name       string `json:"name"`
	Expression string `json:"expression"`
	TagColor   string `json:"tagColor,omitempty"`
}

func getRemoteConfig(token oauth2.Token, projectID string) (RemoteConfig, error) {
	client := &http.Client{}
	url := firebaseURL + "/v1/projects/" + projectID + "/remoteConfig"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return RemoteConfig{}, err
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	resp, err := client.Do(req)
	if err != nil {
		return RemoteConfig{}, err
	}
	defer resp.Body.Close()

	config := RemoteConfig{}
	err = json.NewDecoder(resp.Body).Decode(&config)
	return config, err
}

func listVersion(token oauth2.Token, projectID string) ([]Version, error) {
	client := &http.Client{}
	url := firebaseURL + "/v1/projects/" + projectID + "/remoteConfig:listVersions?pageSize=1"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	vers := struct {
		Versions      []Version `json:"versions"`
		NextPageToken string    `json:"nextPageToken"`
	}{}

	err = json.NewDecoder(resp.Body).Decode(&vers)

	return vers.Versions, err
}

var (
	latestVersionNumber string
	config              RemoteConfig
)

func IsEnable(feature string) bool {
	if p, ok := config.Parameters[feature]; ok {
		if p.DefaultValue.Value == "true" {
			return true
		}
	}
	return false
}

func Value(feature string) string {
	if p, ok := config.Parameters[feature]; ok {
		return p.DefaultValue.Value
	}
	return ""
}

func main() {
	s, err := serviceAccount("service-account.json")
	if err != nil {
		log.Fatal(err)
	}

	token, err := Authen(s)
	if err != nil {
		log.Fatal(err)
	}
	ver, err := listVersion(token, s.ProjectID)
	if err != nil {
		log.Fatal(err)
	}

	if len(ver) > 0 {
		latestVersionNumber = ver[0].VersionNumber
	} else {
		log.Fatal("No version found on Firebase Remote Config")
	}

	config, err = getRemoteConfig(token, s.ProjectID)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("config: %#v\n", config)

	// check very 10 seconds if there is a new version of the configuration
	// if there is a new version, update the configuration
	ticker := time.NewTicker(10 * time.Second)
	go func() {
		for range ticker.C {
			ver, err := listVersion(token, s.ProjectID)
			if err != nil {
				log.Printf("Error: %v\n", err)
			}
			if len(ver) > 0 && ver[0].VersionNumber != latestVersionNumber {
				latestVersionNumber = ver[0].VersionNumber
				config, err = getRemoteConfig(token, s.ProjectID)
				if err != nil {
					log.Printf("Error: %v\n", err)
				}
			}
		}
	}()
	defer ticker.Stop()

	e := echo.New()
	e.GET("/configs", func(c echo.Context) error {
		return c.JSON(http.StatusOK, config)
	})
	e.GET("configs/vesions", func(c echo.Context) error {
		return c.JSON(http.StatusOK, latestVersionNumber)
	})

	e.GET("/credits", func(c echo.Context) error {
		if IsEnable("credit_score_check") {
			return c.String(http.StatusOK, "This is a demo app for Firebase Remote Config")
		}

		return c.String(http.StatusNotFound, "Not Found")
	})

	e.GET("/interests", func(c echo.Context) error {
		if IsEnable("interest_calculation") {
			return c.String(http.StatusOK, "I like to code in Go")
		}

		return c.String(http.StatusNotFound, "Not Found")
	})

	e.GET("/loans", func(c echo.Context) error {
		limit := Value("loan_limit")

		return c.String(http.StatusOK, "Your loan limit is: "+limit)
	})

	e.Start(":8888")
}
