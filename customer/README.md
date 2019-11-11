# Instructions to set up the customer component

### Operating System: Ubuntu 16.04 or higher

## Install nodejs **v8.16.1**

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash

**Reopen the terminal**

nvm install v8.16.1

## In DineTime/customer/server run the following commands

pip3 install -r requirements.txt

python3 customer-server.py

## In DineTime/customer/client run the following commands

npm install

npm start

**Open localhost:1234 in chrome or firefox**
