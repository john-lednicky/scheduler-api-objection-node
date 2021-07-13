const swaggerJsdoc = require("swagger-jsdoc");

exports.getDoc = () => {

    const options = {
        definition: {
          openapi: "3.0.0",
          info: {
            title: "Scheduler API",
            version: "0.1.0",
            description:
              "This is a simple CRUD API application.",
            license: {
              name: "MIT",
              url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
              name: "John Lednicky",
              url: "https://github.com/john-lednicky",
              email: "john.d.lednicky@gmail.com",
            },
          },
          servers: [
            {
              url: "http://localhost:3333",
            },
          ],
        },
        apis: ["./routes/*.js"],
      };
      
      return swaggerJsdoc(options);
}