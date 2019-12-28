async function initFetch() {
  if (typeof fetch !== "undefined") {
    return fetch;
  } else {
    fetch = await require("node-fetch");
    return fetch;
  }
}
async function rapi(opt, url, callback, err) {
  if (!opt.type && opt.type !== "send" && opt.type !== "receive") {
    return false;
  }
  if (opt.type === "send") {
    send(opt, url, callback, err);
  }
  if (opt.type === "receive") {
    receive(opt, url, callback, err);
  }
}

async function send(opt, url, callback, err) {
  const localfetch = await initFetch();
  localfetch(url, {
    method: opt.method || "PATCH",
    body: JSON.stringify(opt.body)
  })
    .then(response => response.json())
    .catch(error => err(error))
    .then(response => callback(response));
}
async function receiveFunction(url, err) {
  try {
    const localfetch = await initFetch();
    const response = await localfetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    err(e);
  }

  return data;
}
async function receive(opt, url, callback, err) {
  if (opt.blink) {
    const interstop = setInterval(
      async function() {
        if (typeof callback === "function") {
          callback(await receiveFunction(url,err));
        } else {
          return new Promise(async (resolve, reject) => {
            resolve(await receiveFunction(url,err));
          });
        }
      }.bind(this),
      opt.duration || 2000
    );
    opt.stop = () => clearInterval(interstop);
    return new Promise(async (resolve, reject) => {
      resolve(await receiveFunction(url,err));
    });
  } else {
    await receiveFunction(url,err)
    return new Promise(async (resolve, reject) => {
      resolve(await receiveFunction(url,err));
    });
  }
}

module.exports = rapi;
module.exports.send = (opt, url, callback, err) =>
  send(opt, url, callback, err);
module.exports.path = (opt, url, callback, err) =>
  send({ ...opt, method: "PATCH" }, url, callback, err);
module.exports.post = (opt, url, callback, err) =>
  send({ ...opt, method: "POST" }, url, callback, err);
module.exports.update = (opt, url, callback, err) =>
  send({ ...opt, method: "UPDATE" }, url, callback, err);
module.exports.receive = (opt, url, callback, err) =>
  receive(opt, url, callback, err);
