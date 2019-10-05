# se-customer

## Install nodejs

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash

<span style="color:red"> Reopen the terminal </span>

nvm install v8.16.1

## In se-customer/server run the following commands

pip3 install -r requirements.txt

python3 customer-server.py

## In se-customer/client run the following commands

npm install

npx parcel index.html
