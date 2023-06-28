const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

// create new database
const databasePath = path.join(__dirname, "createDataBase.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();


// API2  finding subjects for each student
app.get("/subjects", async (request, response) => {
  try {
    const queryResult = await query(`
      SELECT c.customerId, c.name, GROUP_CONCAT(s.subjectName ORDER BY s.subjectName SEPARATOR ',') AS subjects
      FROM customers AS c
      INNER JOIN mapping AS m ON c.customerId = m.customerId
      INNER JOIN subjects AS s ON m.subjectId = s.subjectId
      GROUP BY c.customerId, c.name
    `);

    return response.status(200).json(queryResult);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

//3 Function to insert data in sql with unique email check
async function insertOrUpdateCustomers(customers) {
  for (const customer of customers) {
    const { name, email } = customer;
    try {
      const existingCustomer = await query(
        "SELECT * FROM customers WHERE email = ?",
        email
      );
      if (existingCustomer.length > 0) {
        await query("UPDATE customers SET name = ? WHERE email = ?", [
          name,
          email,
        ]);
      } else {
        await query("INSERT INTO customers (name, email) VALUES (?, ?)", [
          name,
          email,
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const customers = [
  { email: "anurag11@yopmail.com", name: "anurag" },
  { email: "sameer11@yopmail.com", name: "sameer" },
  { email: "ravi11@yopmail.com", name: "ravi" },
  { email: "akash11@yopmail.com", name: "akash" },
  { email: "anjali11@yopmail.com", name: "anjai" },
  { email: "santosh11@yopmail.com", name: "santosh" },
];

insertOrUpdateCustomers(customers);

//4 Create a new object which have all the properties of object person and student
const person = {
  id: 2,
  gender: "male",
};

const student = {
  name: "ravi",
  email: "ravi11@yopmail.com",
};

const detailsObject = { ...person, ...student };

//5Promisified function for making a request to Google homepage
const request = require("request");
const getGoogleHomePage = () => {
  return new Promise((resolve, reject) => {
    request("http://www.google.com", (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

getGoogleHomePage()
  .then((result) => {
    console.log("RESULT ==>", result);
  })
  .catch((error) => {
    console.error(error);
  });

// finding the missing number

const numbers = [];
let missingNumber;

for (let i = 1; i <= 100; i++) {
  if (!numbers.includes(i)) {
    missingNumber = i;
    break;
  }
}

console.log("Missing number:", missingNumber);

module.exports = app;
