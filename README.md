This is a fun personal project that I created to easily trade options and stocks through the new Schwab API.
Along with trading, this application can fetch stock-related news articles from News API,
then it runs those articles through ChatGPT to get the related stock symbol and headline sentiment.

To run, you'll need to create an env file in the directory with these keys:
REACT_APP_OPENAI_API_KEY
REACT_APP_NEWS_API_KEY
REACT_APP_ALPHAVANTAGE_API_KEY
REACT_APP_SCHWAB_API_KEY

Commands to run backend:
cd root/backend
pipenv shell
cd backend
python manage.py runserver_plus --cert-file ~/certs/cert.pem --key-file ~/certs/key.pem 8000

Commands to run frontend:
cd root/frontend
npm start

![Home](https://github.com/user-attachments/assets/3eabb33d-5347-4c7e-9bae-f813133b097c)
![Graph](https://github.com/user-attachments/assets/56534dc2-bafc-46c5-b2c8-2642d055a5b2)
![TradeStock](https://github.com/user-attachments/assets/4ebf876e-c60d-4eda-bbf2-fb30be8246e6)
![TradeOption](https://github.com/user-attachments/assets/cf1a5e59-c46e-4e6a-86c1-b65d041a7c55)
![Options](https://github.com/user-attachments/assets/c7338949-8dae-4a19-bf49-10787f6e4db6)
![Orders](https://github.com/user-attachments/assets/04526cad-9739-4130-a2fc-ad3843708375)
![Transactions](https://github.com/user-attachments/assets/f124baef-916f-429c-91f5-1e3fdce5bc57)
