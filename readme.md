# Flask Stock Ticker Purchasing APP

## PostMan API Collection Documentation
* https://documenter.getpostman.com/view/6832471/2s8YmEykpv

## Usage
_I recommend to use a virtual env._
> This was built oon Python 3.10.5

* `pip install -r requirements.txt`
* __FIRST:__ `Start Backend`:
  * Just run `bash start_backend.sh` after replacing your `POSTGRES` settings (keeping mine in their for this challenge)
* __SECOND:__ `Start Frontend`
  * Just run `bash start_frontend.sh`

## Initialize App Data
_for the challenge don't do this, it is already done, and I left the DB in tact with creds here._

In flask shell run the models and create the tables
```
>>> from app import db, app
>>> from models import User, Order
>>> db.create_all()
>>>   
```
## UI (First Functional View)
![image](https://user-images.githubusercontent.com/25157436/201695812-d54f4b76-8a30-4b2c-add5-c6762613fb68.png)

## Data
_It is being populated, but selecting the ticker in the dropdown isn't working._
![image](https://user-images.githubusercontent.com/25157436/201696173-595b1ca6-a681-4c7d-8f11-5c7f9399a1ec.png)


## Bugs/Enhancements
- [x] Dropdown not updating to newly selected value
- [ ] Remove hard coding of user id when creating orders (API supports multiple users and orders)
- [ ] Yeesh, make it look nice.  Wasted time with Bootstrap CSS not loading.
