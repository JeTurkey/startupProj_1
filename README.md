# Server environment setup

Don't forget to switch the localhost in /etc/hosts file, by `sudo vi /etc/hosts`. 

## Step 1. Install NPM and Node.js

`sudo apt-get update`

`sudo apt-get install nodejs`

`sudo apt-get install nodejs legacy`

`sudo apt-get install npm`

Check if the installation was sucessed by `node -v` and `npm -v`

## Step 2. Install MongoDB

`wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -`

`echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list`

`sudo apt-get update`

`sudo apt-get install -y mongodb-org`

### Tips for mongod

#### Start Mongod

> `sudo systemctl start mongod`

#### Checking Mongod Status

> `sudo systemctl status mongod`

#### Stop Mongod

> `sudo systemctl stop mongod`

#### Restart Mongod

> `sudo systemctl restart mongod`

## Step 3. Install Python 3.7

`sudo apt-get install zlib1g-dev libbz2-dev libssl-dev libncurses5-dev libsqlite3-dev libreadline-dev tk-dev libgdbm-dev libdb-dev libpcap-dev xz-utils libexpat1-dev liblzma-dev libffi-dev libc6-dev` for installation dependency

`wget 'https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tgz'` to download the 3.7.3 version of Python.

`tar zxvf Python-3.7.3.tgz` unzip the file

`cd Python-3.7.3/`

`sudo mkdir -p /usr/local/python3` Copy and paste the file to /usr/local/python3

`./configure --prefix=/usr/local/python3 --enable-optimizations` configuration

`make`

`sudo make install`

#### To remove the softlink of Python 3.5

`sudo rm -rf /usr/bin/python3`

`sudo rm -rf /usr/bin/pip3` (这一条未必需要,因为默认系统可能没有pip3)

`sudo ln -s /usr/local/python3/bin/python3.7 /usr/bin/python3`

`sudo ln -s /usr/local/python3/bin/pip3.7 /usr/bin/pip3`

## Step 4. Install Git

`apt-get update`

`sudo apt install git-core`

## Step 5. Install Python pkgs

`pip3 install Requests`

`pip3 install beautifulsoup4`

`pip3 install pymong`

## Step 6. Install Screen

`sudo apt install screen`

