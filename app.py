from flask import Flask, request
from utils import get_env_variable
from flask_sqlalchemy import SQLAlchemy
from config import get_config
import datetime
import yfinance as yf
from flask_cors import CORS


db = None


def create_app(env=None):
    global db
    app = Flask(__name__)
    app.config.from_object(get_config(env))
    CORS(app)
    db = SQLAlchemy(app)
    return app


app = create_app()

# Model Definitions, this sucks and I need a better way to separate this without having a circular import error.
# models should be in a diff file.
# =================== Models ======================================


class BaseModel:
    def save(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def rollback():
        db.session.rollback()

    @staticmethod
    def commit():
        db.session.commit()


class Order(db.Model, BaseModel):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    ticker_name = db.Column(db.String, nullable=True)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)
    total = db.Column(db.Float)

    def __init__(self, user_id: int, ticker_name: str, quantity: int, price: float):
        self.user_id = user_id
        self.ticker_name = ticker_name
        self.quantity = quantity
        self.price = price
        self.total = quantity * price


class User(db.Model, BaseModel):
    id = db.Column(db.Integer, primary_key=True,
                   unique=True, nullable=False)
    username = db.Column(
        db.String,
        unique=True, nullable=False)
    orders = db.relationship('Order', backref='user')

    def __init__(self, username: str):
        self.username = username

# =================== End: Models ======================================


# =================== Serializers ======================================
def format_user(user_obj: User):
    """Format user objects for json response in the API."""
    return {"user_name": user_obj.username,
            "user_id": user_obj.id}


def format_order(order_obj: Order):
    """Format order objects for json response in the API."""
    return {"ticker_name": order_obj.ticker_name,
            "order_id": order_obj.id,
            "quantity": order_obj.quantity,
            "price": order_obj.price,
            "total": order_obj.total,
            "user_id": order_obj.user_id}
# =================== End: Serializers ======================================


@app.route("/api/users", methods=["POST"])
def create_user():
    """Create a new user in the DB."""
    username = request.json['username']
    new_user = User(username)
    new_user.save()
    return format_user(new_user)


@app.route("/api/users", methods=["GET"])
def get_users():
    """Get all users in the DB."""
    users = User.query.order_by(User.id.asc()).all()
    return [format_user(user) for user in users]


@app.route("/api/users/<user_id>", methods=["GET"])
def get_user(user_id):
    """Get a specific user detail."""
    user = User.query.get(user_id)
    return format_user(user)


@app.route("/api/orders", methods=["POST"])
def create_order():
    """Create an order for a user."""
    ticker_name = request.json['ticker_name']
    user_id = request.json['user_id']
    quantity = request.json['quantity']
    price = request.json['price']
    new_order = Order(user_id=user_id, ticker_name=ticker_name,
                      quantity=quantity, price=price)
    new_order.save()
    return format_order(new_order)


@app.route("/api/orders", methods=["GET"])
def get_orders_by_user():
    """Return a users specific orders."""
    user_id = request.args.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        return [format_order(order) for order in user.orders]
    return [format_order(order) for order in Order.query.order_by(Order.id.asc()).all()]


@app.route("/api/orders/<order_id>", methods=["GET"])
def get_order(order_id):
    """Return an order's detail."""
    order = Order.query.get(order_id)
    return format_order(order)


@app.route("/api/tickers/<ticker_symbol>", methods=["GET"])
def get_ticker(ticker_symbol):
    """Return stock info from a ticker symbol."""
    # Ticker Symbol like MSFT
    ticker = yf.Ticker(ticker_symbol)
    return ticker.info


@app.route("/api/tickers", methods=["GET"])
def get_tickers():
    """Return a list of ticker symbols to choose from."""
    # providing some defaults for testing purposes
    return ['MSFT', 'TSLA']


if __name__ == "__main__":
    app.run()
