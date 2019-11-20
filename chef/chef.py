from flask import *  
import sqlite3  
  
app = Flask(__name__)  
 
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
def view():  
    con = sqlite3.connect("waiter.db")  
    con.row_factory = sqlite3.Row  
    cur = con.cursor()  
    cur.execute("select * from orders")  
    rows = cur.fetchall()  
    return render_template("view.html",rows = rows)  
 
 
@app.route("/delete")  
def delete():  
    return render_template("delete.html")  
 
@app.route("/deleterecord",methods = ["POST"])  
def deleterecord():  
    id = request.form["id"]  
    with sqlite3.connect("waiter.db") as con:  
        try:  
            cur = con.cursor()  
            cur.execute("delete from orders where id = ?",id)  
            msg = "record successfully deleted"  
        except:  
            msg = "can't be deleted"  
        finally:  
            return render_template("delete_record.html",msg = msg)  

  
@app.route("/savedetails",methods = ["POST","GET"])  
def saveDetails():  
    msg = "msg"  
    if request.method == "POST":  
        try:  
            id = int(request.form["id"])  
            tableno = int(request.form["tableno"]) 
            order = request.form["order"]  
            with sqlite3.connect("waiter.db") as con:  
                cur = con.cursor()  
                cur.execute("INSERT into orders (id, tableno, ord) values (?,?,?)",(id,tableno,order))  
                con.commit()  
                msg = "Order successfully Added"  
        except:  
            con.rollback()  
            msg = "We can not add the order to the list"  
        finally:  
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
            ingredient = request.form["ingredient"] 
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
