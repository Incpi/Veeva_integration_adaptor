const express = require("express");
const bodyParser = require("body-parser");
const supertest = require("supertest");
const app = express();
const port = 3000;

app.use(bodyParser.json());
const Authorizations = new Map();
Authorizations.set("testid1", true);
Authorizations.set("authorization", true);

app.post("/auth", bodyParser.urlencoded({ extended: true }), (req, res) => {
  const { username, password } = req.body;
  console.log(req.headers);
  const contenttype = req.headers["accept"];
  if (username === "a" && password === "a") {
    const authorization =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    if (contenttype.toLowerCase() === "application/xml") {
      res
        .status(200)
        .send(
          `<response><responseStatus>SUCCESS</responseStatus><sessionId>${authorization}</sessionId><userId>12021</userId></response>`,
        );
    } else {
      Authorizations.set(authorization, true);
      res.json({
        responseStatus: "SUCCESS",
        sessionId: authorization,
        userId: 12021,
      });
    }
    console.log(Authorizations);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/query", (req, res) => {
  console.log(req.body);
  const Authorization = req.headers["Authorization".toLowerCase()];
  const contenttype = req.headers["Accept".toLowerCase()];

  if (Authorizations.has(Authorization)) {
    const documentId = req.query.q || "";
    if (contenttype.toLowerCase() === "application/xml") {
      const retrievedDocument = `<response><responseStatus>SUCCESS</responseStatus><data><record><id>${documentId}</id><name>Product A</name><description>This is a description of Product A</description></record></data></response>`;
      res.status(200).send(retrievedDocument);
    } else {
      const retrievedDocument = {
        responseStatus: "SUCCESS",
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
    if (contenttype.toLowerCase() === "application/xml") {
      +res
        .status(401)
        .send(`<response><responseStatus>SUCCESS</responseStatus></response>`);
    } else {
      res.status(401).json({ responseStatus: "Failure" });
    }
  }
  console.log(res.body);
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const request = supertest(server);
request
  .post("/auth")
  .send("username=a&password=a")
  .set("Accept", "application/xml")
  .expect(200)
  .then((e) => console.log(e.text));

request1 = supertest(server);
request1
  .post("/auth")
  .send("username=a&password=a")
  .set("Accept", "application/json")
  .expect(200)
  .end((err, res) => {
    console.log(res.body);
    if (err) {
      console.error(err);
      return;
    }

    const Authorization = res.body.sessionId;

    request1
      .post("/query?q=SELECT id FROM documents")
      .set("Authorization", Authorization)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
      });

    // Make XML document retrieval request
    try {
      request1
        .post("/query?q=1_xml")
        .set("Authorization", "123")
        .set("Accept", "application/xml")
        .expect(401)
        .end((err, res) => {
          if (err) {
            console.error(err);
            return;
          }
        });
    } catch (err) {}
    request1
      .post("/query?q=1_xml")
      .set("Authorization", Authorization)
      .set("Accept", "application/xml")
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("XML Document Retrieval Test Passed!");
      });
  });
