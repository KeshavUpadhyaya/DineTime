from flask import *  
import sqlite3  
import requests
from flask_cors import CORS, cross_origin
  
app = Flask(__name__) 
CORS(app)
 
 
@app.route("/")  
def index():  
    return render_template("index.html");  
 
@app.route("/add")  
def add():  
    return render_template("add.html")  

@app.route("/change")  
def change():  
    return render_template("change.html")  

@app.route("/view")  
@cross_origin()
def view():  
    con = sqlite3.connect("dinetime.db")  
    con.row_factory = sqlite3.Row  
    cur = con.cursor()  
    cur.execute("select * from orders")  
    rows = cur.fetchall()  
    return render_template("view.html",rows = rows)  
 
 
@app.route("/delete")  
def delete():  
    
    requests.get("")
    return render_template("delete.html",rows=rows)  
 
@app.route("/deleterecord",methods = ["POST"])  
def deleterecord():  
    ip = ""
    id = int(request.form["id"])
    con = sqlite3.connect("dinetime.db")  
    con.row_factory = sqlite3.Row  
    cur = con.cursor()  
    cur.execute("select * from orders where order_id = ?",(id,))  
    rows = cur.fetchall()
    for i in rows:
        cus_id = i["customer_id"]
    requests.get(ip,"?req=1&cusid=",str(cus_id),"&ordid=",str(id))
    with sqlite3.connect("dinetime.db") as con:  
        cur = con.cursor()  
        cur.execute("delete from orders where order_id = ?",(id,)) 
        msg = "record successfully deleted"  
        return render_template("delete_record.html",msg = msg)  

  
@app.route("/savedetails",methods = ["POST"])  
def saveDetails():    
    order_id = int(request.form["order_id"])  
    customer_id = request.form["customer_id"]
    take_away = int(request.form["take_away"])
    time_in = request.form["time_in"]
    time_out = request.form["time_out"]

    with sqlite3.connect("dinetime.db") as con:  
        cur = con.cursor()  
        cur.execute("INSERT into orders(order_id, customer_id, take_away, time_in, time_out) values (?,?,?,?,?)",(order_id, customer_id, take_away, time_in, time_out))  
        con.commit()  
        msg = "Order successfully Added"  
 
    return render_template("success.html",msg = msg)  
    con.close()  

@app.route("/request")  
def req():  
    con = sqlite3.connect("waiter.db")  
    con.row_factory = sqlite3.Row  
    cur = con.cursor()  
    cur.execute("select * from requests")  
    rows = cur.fetchall()  
    return render_template("requests.html",rows = rows)  

@app.route("/savereq",methods = ["POST","GET"])  
def saveReq():  
    msg = "msg"  
    if request.method == "POST":  
        try:  
            id = int(request.form["id"])  
            ingredient = string(request.form["ingredient"]) 
            amount = int(request.form["amount"]) 
            with sqlite3.connect("waiter.db") as con:  
                cur = con.cursor()  
                cur.execute("INSERT into requests (id, ingredient, amount) values (?,?,?)",(id,ingredient,amount))  
                con.commit()  
                msg = "Request successfully Added"  
        except:  
            con.rollback()  
            msg = "We can not add the request to the list"  
        finally:  
            return render_template("success1.html",msg = msg)  
            con.close()  

if __name__ == "__main__":  
    app.run(debug = True)  
