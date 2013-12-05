package model

import (
	"appengine"
	"appengine/user"
	"appengine/datastore"
)

// User information local to this application
type Account struct {
	// Name used for module namespace
	Devname string
}

func GetAccountKey(c appengine.Context, u *user.User) *datastore.Key {
	return datastore.NewKey(c, "account", u.ID, 0, nil)
}

func GetAccount(c appengine.Context, u *user.User) (*Account, error) {
	if u == nil || u.ID == "" {
		return nil, nil
	}

	acc := &Account{}
	err := datastore.RunInTransaction(c, func(c appengine.Context) error {
		key := GetAccountKey(c, u)
		err := datastore.Get(c, key, acc)
		if err == datastore.ErrNoSuchEntity {
			_, err = datastore.Put(c, key, acc)
		}
		return err
	}, nil)
	
	return acc, err
}

func GetAccountByDevname(c appengine.Context, devname string) (*datastore.Key, *Account, error) {
	q := datastore.NewQuery("account").Filter("Devname =", devname)

	var accounts []*Account
	keys, err := q.GetAll(c, &accounts)
	if err != nil {
		return nil, nil, err
	}

	// Not found
	if len(keys) == 0 {
		return nil, nil, nil
	}

	return keys[0], accounts[0], nil
}

func SaveAccount(c appengine.Context, u *user.User, acc *Account) error {
	_, err := datastore.Put(c, GetAccountKey(c, u), acc)
	return err
}