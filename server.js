const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const port = process.env.PORT || 8080;
const app = express();

// Certificate
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/sdcalculatorweb.herokuapp.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/sdcalculatorweb.herokuapp.com/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/sdcalculatorweb.herokuapp.com/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname, { dotfiles: "allow" }));
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", function(req, res) {
  return res.send("pong");
});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log('HTTPS Server running on port 443');
});
