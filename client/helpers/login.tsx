export default function login(
  email: string,
  password: string
): Promise<string | true> {
  return new Promise(resolve => {
    fetch(`/.netlify/lambda/login`, {
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
          localStorage.setItem("token", body.token);
          return resolve(true);
        }
        resolve(body.message);
      })
      .catch(e => {
        resolve(e);
      });
  });
}
