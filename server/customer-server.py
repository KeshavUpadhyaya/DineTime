import sqlite3
from flask import Flask
from flask import session
from flask import request
from flask import jsonify
import os
from flask_cors import CORS
from flask import g
import hashlib


app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app)

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
            session["logged_in"] = True
            status = "success"
        else:
            status = "failure"

    return jsonify({"status": status})


# function to logout
@app.route("/api/v1/logout")
def logout():
    session.pop("logged_in", None)
    return jsonify({"status": "success"})


# checking if user is logged in
@app.route("/api/v1/status")
def status():
    if session.get("logged_in"):
        if session["logged_in"]:
            return jsonify({"status": True})
    else:
        return jsonify({"status": False})


@app.route("/")
def home():
    return "Customer server is working!"


if __name__ == "__main__":
    app.run(debug=True, port=8000)
    # app.run(host="0.0.0.0",port=80)

