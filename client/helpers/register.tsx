export default function register(
  email: string,
  password: string
): Promise<string | true> {
  return new Promise(resolve => {
    fetch(`/.netlify/lambda/register`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.json())
      .then(body => {
        if (body.error == false) {
          return resolve(true);
        }
        resolve(body.message);
      })
      .catch(e => {
        resolve(e);
      });
  });
}
