package config

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
)

type FeatureToggle struct{}

const firebaseURL = "https://firebaseremoteconfig.googleapis.com/v1/projects"

type ServiceAccount struct {
	AuthURI    string `json:"auth_uri"`
	ProjectID  string `json:"project_id"`
	Email      string `json:"client_email"`
	PrivateKey string `json:"private_key"`
}

func ReadServiceAccount(filename string) (ServiceAccount, error) {
	b, err := os.ReadFile(filename)
	if err != nil {
		return ServiceAccount{}, err
	}
	sa := ServiceAccount{}
	err = json.Unmarshal(b, &sa)
	return sa, err
}

func Authen(c ServiceAccount) (oauth2.Token, error) {
	cf := &jwt.Config{
		Email:      c.Email,
		PrivateKey: []byte(c.PrivateKey),
		Scopes: []string{
			"https://www.googleapis.com/auth/firebase.remoteconfig",
		},
		TokenURL: google.JWTTokenURL,
	}
	token, err := cf.TokenSource(context.Background()).Token()
	if err != nil {
		return oauth2.Token{}, err
	}

	return *token, nil
}

// refresh token if near expiry time
func (ft *FeatureToggle) RefreshToken(token *oauth2.Token) (*oauth2.Token, error) {
	if token.Valid() {
		return token, nil
	}

	// TODO: implement token refresh logic here

	return token, nil
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

func baseURL(sa ServiceAccount) string {
	return firebaseURL + "/" + sa.ProjectID + "/remoteConfig"
}

func GetRemoteConfig(token oauth2.Token, projectID string) (RemoteConfig, error) {
	url := firebaseURL + "/" + projectID + "/remoteConfig"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return RemoteConfig{}, err
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return RemoteConfig{}, err
	}
	defer resp.Body.Close()

	config := RemoteConfig{}
	err = json.NewDecoder(resp.Body).Decode(&config)
	return config, err
}

func ListVersion(token oauth2.Token, projectID string) ([]Version, error) {
	client := &http.Client{}
	url := firebaseURL + "/" + projectID + "/remoteConfig:listVersions?pageSize=1"
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
