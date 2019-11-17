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
import requests


class User(UserMixin):
    pass


def get_db():
    db = sqlite3.connect("../../dinetime.db")
    cursor = db.cursor()
    return db, cursor


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
        with sqlite3.connect("../../dinetime.db") as conn:
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

    with sqlite3.connect("../../dinetime.db") as conn:
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
        return jsonify({"status": 1, "username": current_user.id})
    else:
        return jsonify({"status": 0})


# 6 Get Favourite Items
@app.route("/api/v1/getfav/<customer_id>", methods=["GET"])
def get_fav(customer_id):
    cid = customer_id
    conn, cursor = get_db()
    cursor.execute("SELECT item_name from favourites where customer_id=" + str(cid))
    fav = cursor.fetchall()
    # if(len(fav)<1):

    fav_list = []
    ftemp = {"Favourites"}
    for i in fav:
        temp = {}
        cursor.execute(
            "SELECT price,take_away_charges FROM menu where name="
            + "'"
            + str(i[0])
            + "'"
        )

        x = cursor.fetchall()
        if len(x) > 0:
            print(x)
            temp["name"] = i[0]
            temp["price"] = x[0][0]
            temp["take_away_charges"] = x[0][1]
            fav_list.append(temp)

    conn.close()
    final = {"Favorites": fav_list}
    return jsonify(final)


# 7 Remove from favourites
@app.route("/api/v1/delfav", methods=["POST"])
def delete_fav_item():
    try:
        conn, cursor = get_db()
        r = request.get_json()
        # v = json.dumps(['customer_id'])
        # print(type(r))
        customer_id = r["customer_id"]
        item_name = r["item_name"]
        # print(type(item_name))
        cursor.execute(
            "DELETE from favourites where customer_id="
            + "'"
            + str(customer_id)
            + "'and item_name="
            + "'"
            + str(item_name)
            + "'"
        )
        rcount = cursor.rowcount
        conn.commit()
        conn.close()
        if rcount == 0:
            d = {"response": 0}
            return jsonify(d)
        d = {"response": 1}
        return jsonify(d)
    except sqlite3.Error as error:
        d = {"response": 0}
        return jsonify(d)


# 5 Post favourite items
@app.route("/api/v1/setfav", methods=["POST"])
def post_fav_items():
    try:
        conn, cursor = get_db()
        req = request.get_json()
        customer_id = req["customer_id"]
        item_name = req["item_name"]

        cursor.execute(
            "SELECT * from favourites where customer_id="
            + "'"
            + str(customer_id)
            + "' and item_name="
            + "'"
            + str(item_name)
            + "'"
        )
        rcount = cursor.fetchall()
        # rcount=cursor.rowcount
        # print(len(rcount))
        # print('\n')
        if len(rcount) > 0:
            d = {"status": 0}
            return jsonify(d)
        else:
            cursor.execute(
                "INSERT INTO favourites ('customer_id','item_name') VALUES ('"
                + str(customer_id)
                + "','"
                + str(item_name)
                + "')"
            )
            conn.commit()
            conn.close()
            d = {"status": 1}
            return jsonify(d)
    except sqlite3.Error as error:
        d = {"status": 0}
        return jsonify(d)


# 8 Payment approval
@app.route("/api/v1/payment_approval", methods=["POST"])
def payment_approval():
    conn, cursor = get_db()
    req = request.get_json()
    order_id = req["order_id"]
    # a=1;

    cursor.execute(
        "SELECT * FROM payment_approval WHERE order_id=" + "'" + str(order_id) + "'"
    )
    temp = cursor.fetchall()
    print(temp)
    # a=a-1
    # print(type(temp))
    value = int(temp[0][1])

    d = {"approval": value}
    return jsonify(d)
    conn.close()


@app.route("/")
def home():
    return "Customer server is working!"


if __name__ == "__main__":
    app.run(debug=True, port=8000)
    # app.run(host="0.0.0.0",port=80)

