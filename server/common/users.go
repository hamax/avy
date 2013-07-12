package common

import (
	"appengine"
	"appengine/user"
	"appengine/datastore"

	"server/model"
)

func GetAccountKey(c appengine.Context, u *user.User) *datastore.Key {
	return datastore.NewKey(c, "account", u.ID, 0, nil)
}

func GetAccount(c appengine.Context, u *user.User) (*model.Account, error) {
	if u == nil || u.ID == "" {
		return nil, nil
	}

	acc := &model.Account{}
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