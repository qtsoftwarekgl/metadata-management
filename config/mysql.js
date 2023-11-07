const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_TYPE,
    operatorsAlliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

 
db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    db.query("SHOW TABLES", QueryTypes.SHOWTABLES)
      .then((res) => {
        console.log("res###", res)
        res[0].length === 0
          ? db
              .sync()
              .then(async() => {
                console.log("tables created successfull");
                const secret = await bcrypt.hash('Admin@2022', 8);
                let createDefaultUser = "INSERT INTO `users`(`fname`, `lname`, `phone`, `country`, `location`, `username`, `email`, `password`) VALUES ('defaut_fname', 'defaut_lname', '+250788888888','RWANDA','KIGALI','admin','admin@gmail.com','secret')";
                createDefaultUser = createDefaultUser.replace('secret', `${secret}`)
                db.query(createDefaultUser, QueryTypes.INSERT)
                  .then(() => console.log("default user created successfull"))
                  .catch((erro) =>
                    console.log(
                      "something went wrong could not create default user because: ",
                      erro.message
                    )
                  );
              })
              .catch((error) => console.log("error ocpaied", error))
          : null;
      })
      .catch((er) => {
        console.log("Unable to connect to the database:", er);
      });
  })
  .catch((err) =>
    console.log(
      "Could not connect to the database. Exiting now...",
      err
    )
  );

module.exports = db;
