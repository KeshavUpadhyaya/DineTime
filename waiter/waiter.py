from flask import *
l1=[(1, 2), (3, 4)]
app = Flask(__name__, template_folder='.') 

@app.route('/')
@app.route('/index', methods=['GET'])
def index():
	req = request.args.get('req')
	cusid = request.args.get('cusid')
	ordid = request.args.get('ordid')
	if(req==None):
		return render_template('/templates/index.html', user='Kaushik', title='Home', nos=l1)
	t=tuple((int(cusid), int(ordid)))
	print(req=='-1', t, l1)
	if(req=='-1'):
		l1.remove(t)
	elif(req==2):
		pass
	else:
		l1.append(t)
	print(l1)
	return render_template('/templates/index.html', user='Kaushik', title='Home', nos=l1), 201

if __name__ == '__main__':
      app.run(debug=True)
      #app.run()
"""

"""