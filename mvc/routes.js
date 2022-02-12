const fs = require("fs");

function requestHandler(req, res) {
  const {url, method} = req;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<form action='/message' method='POST'>");
    res.write("<input type='text' name='message'/><button type='submit'>Send</button>");
    res.write("</form>");
    return res.end();
  }
  else if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", function (chunk) {
      console.log(chunk);
      body.push(chunk);
    });
    return req.on("end", function () {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, err => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<h1>");
  res.write("Hello from my NodeJS Server!");
  res.write("</h1>");
  res.end();
}

module.exports = {handler: requestHandler};
