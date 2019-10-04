import sqlite3
from flask import Flask
from flask import session
from flask import request
from flask import jsonify
import os
from flask_cors import CORS
from flask import g
import hashlib
from flask_login import UserMixin
from flask_login import LoginManager
from flask_login import login_user
from flask_login import logout_user
from flask_login import login_required
from flask_login import current_user


class User(UserMixin):
    pass


app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def user_loader(username):
    user = User()
    user.id = username
    return user


# function to encrypt password
def encrypt(str):
    return hashlib.sha256(str.encode()).hexdigest()


# function to sign up
@app.route("/api/v1/register", methods=["POST"])
def register():
    json_data = request.json
    print(json_data)
    username = json_data["username"]
    password = json_data["password"]
    fav_category_id = json_data["fav_category_id"]
    encryted_password = encrypt(password)

    try:
        with sqlite3.connect("dinetime.db") as conn:
            c = conn.cursor()
            print("inside conn")
            c.execute(
                "insert into customer values(:customer_id,:password,:fav_category_id)",
                {
                    "customer_id": username,
                    "password": encryted_password,
                    "fav_category_id": fav_category_id,
                },
            )
        message = "success"
        status = 1
    except:
        message = "Username already exists"
        status = 0

    return jsonify({"status": status, "message": message})


# function to login
@app.route("/api/v1/login", methods=["POST"])
def login():
    json_data = request.json
    username = json_data["username"]
    password = json_data["password"]

    with sqlite3.connect("dinetime.db") as conn:
        c = conn.cursor()
        result = c.execute("select * from customer")

        users = {}
        # creating a dictionary of usernames and passwords
        for row in result:
            users[row[0]] = row[1]

        if username in users.keys() and encrypt(password) == users[username]:
            user = User()
            user.id = username
            login_user(user)
            status = "success"
            print("Login successful!!")
        else:
            status = "failure"

    return jsonify({"status": status})


@app.route("/api/v1/logout")
def logout():
    logout_user()
    return jsonify({"status": 1})


@app.route("/api/v1/status")
def logged_in():
    if current_user.is_authenticated:
        return jsonify({"status": 1})
    else:
        return jsonify({"status": 0})


@app.route("/")
def home():
    return "Customer server is working!"


if __name__ == "__main__":
    app.run(debug=True, port=8000)
    # app.run(host="0.0.0.0",port=80)

