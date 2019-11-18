from flask import Flask, request, render_template
import sqlite3

 
app = Flask(__name__, template_folder='.')

def create_connection(db_file):
    conn = None
    conn = sqlite3.connect(db_file)
    return conn

def select_all_items(conn):
    
    outerList = []
    #innerList = []
    cur = conn.cursor()
    #print (cur.description)
    cur.execute("SELECT * from menu")
    colnames = (cur.description)
    '''for c in colnames:
        #print (c[0])
        innerList.append(c[0])
    outerList.append(innerList)
    innerList = []'''
    rows = cur.fetchall()
    #print (rows[0].keys())
    for row in rows:
        row = list(row)
        outerList.append(row)
        #print(row)
    return outerList

def select_all (conn, items):  #This can be later merged with select_all_items
    outerList = []
    cur = conn.cursor()
    cur.execute("SELECT * from "+items)
    rows = cur.fetchall()
    for row in rows:
        row = list(row)
        outerList.append(row)
    return outerList

@app.route('/')
def my_form():
    return render_template('sample_webpage.html')

'''@app.route('/', methods=['POST'])  #After insert, have route as /addsuccess
def content():
        fname = request.form['text']
        text = open(fname, 'r+')
        content = text.read()
        text.close()
        L = [[1,'One','01'],[2,'Two','10'],[3,'Three','11'],[4,'Four','100']]
        M = [['-','-','-']]
        return render_template('content.html', text2=content, text3="Thanks!", numbers = M)  #text2 corresponds
        #to HTML element'''
	
@app.route('/manage_menu')
def manage_menu():
    database = "dinetime.db"  #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Querying list of items")
        L = select_all_items(conn)
        #print(L[-1])
    #return render_template('sample_webpage.html')
    #return "This page will help you in managing the menu"
    return render_template('manage_menu.html', Items=L)

@app.route('/addsuccess',methods = ['POST'])
def add_success():
    item_name = request.form['item_name']
    cat_id = request.form['cat_id']
    price = request.form['price']
    
    database = "dinetime.db"  #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Adding item")
        L = select_all_items(conn)
        num_rec = L[-1][0]
        L_ins = []
        L_ins.extend([num_rec+1, cat_id, item_name, price])
        sql = '''Insert into menu values (?,?,?,?)'''
        cur = conn.cursor()
        cur.execute (sql, L_ins)
        L = select_all_items (conn)
    #Then make an insert query to database and return the updated database
    #return render_template('try1.html',item_name = item_name, cat_id = cat_id, price = price)
    return render_template('manage_menu.html', Items=L)

@app.route('/deletesuccess', methods = ['POST'])
def delete_success():
    item_id = request.form['item']
    L_del = []
    L_del.extend([item_id])
    database = "dinetime.db"  #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Deleting item")
        sql = 'DELETE FROM menu WHERE item_id=?'
        cur = conn.cursor()
        cur.execute(sql, L_del)
        conn.commit()
        L = select_all_items (conn)
    return render_template('manage_menu.html', Items=L)

@app.route('/editcatidsuccess', methods = ['POST'])
def edit_catid_success():
    item_id = request.form['item']
    new_cat_id = request.form['new_catid']
    L_edit = []
    L_edit.extend([new_cat_id, item_id])
    database = "dinetime.db" #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Editing category ID")
        sql = 'UPDATE menu SET category_id=? WHERE item_id=?'
        cur = conn.cursor()
        cur.execute (sql, L_edit)
        conn.commit()
        L = select_all_items (conn)
    return render_template ('manage_menu.html', Items=L)

@app.route('/editinamesuccess', methods = ['POST'])
def edit_iname_success():
    item_id = request.form['item']
    new_item_name = request.form['new_iname']
    L_edit = []
    L_edit.extend([new_item_name, item_id])
    database = "dinetime.db" #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Editing Item Name")
        sql = 'UPDATE menu SET name=? WHERE item_id=?'
        cur = conn.cursor()
        cur.execute (sql, L_edit)
        conn.commit()
        L = select_all_items (conn)
    return render_template ('manage_menu.html', Items=L)

@app.route('/editpricesuccess', methods = ['POST'])
def edit_price_success():
    item_id = request.form['item']
    new_price = request.form['new_price']
    L_edit = []
    L_edit.extend([new_price, item_id])
    database = "dinetime.db" #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Editing Price")
        sql = 'UPDATE menu SET price=? WHERE item_id=?'
        cur = conn.cursor()
        cur.execute (sql, L_edit)
        conn.commit()
        L = select_all_items (conn)
    return render_template ('manage_menu.html', Items=L)

@app.route ('/manage_feedback')
def manage_feedback():
    database = "dinetime.db"  #C:/Users/Guruprasad/Desktop/Sem-7/SE/DineTime/dinetime.db
    conn = create_connection (database)
    with conn:
        print ("Displaying all feedback")
        L = select_all(conn, 'feedback')
        for i in range(len(L)):
            Feedback = L[i]
            Avg_Rating = (Feedback[2] + Feedback[3] + Feedback[4]) / 3
            Avg_Rating = float("{0:.2f}".format(Avg_Rating))
            L[i].insert (5,Avg_Rating)
        #print(L[-1])
    #return render_template('sample_webpage.html')
    #return "This page will help you in managing the menu"
    #return render_template('manage_menu.html', Items=L)
    return render_template ('manage_feedback.html', Items = L)

@app.route ('/manage_employees')
def manage_employees():
    
    return render_template ('manage_employees.html')    

if __name__ == '__main__':
	app.run(debug=True)
