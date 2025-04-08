Create an app that allows you to follow cryptocurrency exchange rate, using CryptoCompare service. For getting exchange rates you can use this API:  [https://min-api.cryptocompare.com/data/price?fsym=<NAME>&tsyms=USD&api\_key=<API\_KEY&gt](https://min-api.cryptocompare.com/data/price?fsym=%3CNAME%3E&tsyms=USD&api_key=%3CAPI_KEY&gt); where NAME is the name of cryptocurrency.  

For getting API\_KEY you need to sign up here [https://www.cryptocompare.com/](https://www.cryptocompare.com/)  
Your app should have an input for searching cryptocurrencies and a list of cryptocurrencies you already follow.  

1) Initially your app has Dogecoin cryptocurrency in the list.  
2) You can write another cryptocurrency name in the input and click on button 'Search'  
3) After clicking this button you send a request for API  
4) It such cryptocurrency exists, then you add it to your list (but if it is already in the list then adding not needed)  
5) Every 10 seconds this list updates and shows if they grow or fall. when exchange rate is changed, you need to show this somehow to user (for instance, green or red arrows)  
6) Every currency has a button 'delete'
7) every currency has a button `Update`, on click it forces api call for exact coin.
8) You have `Update all` button which forces api call for all coins you have. On clicking it, 10-second interval should restart from scratch
9) Implement your own custom hook (e.g. online/offline indicator)