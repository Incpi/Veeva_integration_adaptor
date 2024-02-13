const express = require("express");
const bodyParser = require("body-parser");
const supertest = require("supertest");
const app = express();
const port = 3000;

app.use(bodyParser.json());
const Authorizations = new Map();
app.post("/auth", bodyParser.urlencoded({ extended: true }), (req, res) => {
  const { username, password } = req.body;
 console.log(req.headers)
  const contenttype = req.headers["accept"];
  if (username === "a" && password === "a") {
    const authorization =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    if (contenttype.toLowerCase() === "application/xml") {
      `<response><status>success</status><authorization>${authorization}</authorization></response>`;
    } else {
      Authorizations.set(authorization, true);
      res.json({ authorization });
    }
    console.log(Authorizations);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/veeva/query", (req, res) => {
  console.log(req.headers);
  const Authorization = req.headers["authorization"];
   const contenttype = req.headers["accept"];

  if (Authorizations.has(Authorization)) {
    const documentId = req.query.q || "";
    if (contenttype.toLowerCase() === "application/xml") {
      const retrievedDocument = `<response><status>success</status><data><record><id>${documentId}</id><name>Product A</name><description>This is a description of Product A</description></record></data></response>`;
      res.status(200).send(retrievedDocument);
    } else {
      const retrievedDocument = {
        status: "success",
        data: [
          {
            id: documentId,
            name: "Product A",
            description: "This is a description of Product A",
          },
        ],
      };
      res.status(200).json(retrievedDocument);
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const request = supertest(server);
request
  .post("/auth")
  .send("username=a&password=a").set("Accept", "application/json")
  .expect(200)
  .end((err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    const Authorization = res.body.authorization;
    request
      .post("/veeva/query?q=1_json")
      .set("Authorization", Authorization)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("JSON Document Retrieval Test Passed!");
        console.log(res.body);
      });

    // Make XML document retrieval request
    request
      .post("/veeva/query?q=1_xml")
      .set("Authorization", Authorization)
      .set("Accept", "application/xml")
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("XML Document Retrieval Test Passed!");
        console.log(res.text);
      });
  });
