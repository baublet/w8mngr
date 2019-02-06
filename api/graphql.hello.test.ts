const graphqlHandler = require("./graphql").handler;

describe("GraphQL controller", function() {
  it("should reply to hello", done => {
    graphqlHandler(
      {
        httpMethod: "POST",
        headers: {},
        body: JSON.stringify({
          operationName: null,
          variables: {},
          query: "{\n  hello\n}\n"
        })
      },
      {},
      function(error, response) {
        if (error) {
          console.error(error, response);
          return done(`Unexpected error returned: ${error}`);
        }
        if (JSON.parse(response.body).data.hello) {
          return done();
        }
        done(`Unexpected response body returned: ${response.body}`);
      }
    );
  });
});
