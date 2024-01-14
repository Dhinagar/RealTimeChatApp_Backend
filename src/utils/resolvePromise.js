function resolvePromise(query) {
    return new Promise((resolve, reject) => {
      // Assuming your query is a Promise-based operation
      query
        .then((result) => {
          resolve([null, result]); // Resolve with the result
        })
        .catch((error) => {
          resolve([error, null]); // Resolve with the error
        });
    });
  }
  module.exports ={ resolvePromise};