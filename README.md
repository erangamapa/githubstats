===== Steps to run =====
1. Install http-server by using the command npm install -g http-server.
2. Go to the directory where you downloaded the code and run the command http-server.
3. Use the url mentioned in server output to access the app.


======= Notes ==========
1. Application consist of three main parts.
    1.1 A value oAuthSuffix which holds github api keys for api requets.
    1.2 Service that is used to collect repo wise stats and global stats.
    1.3 Main controller.
2. I have used $http.get and .then to handle api requests results and errors.
3. I have used nested callbacks to fetch user and repos for users.
4. I have used promiese to call multuple repo stats urls.


