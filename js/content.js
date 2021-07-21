const inputEmail = document.querySelector("#orangeForm-email");
const inputPass = document.querySelector("#orangeForm-pass");
chrome.storage.sync.get(["email", "password", "auto"], function (result) {
  if (result.auto == "1") {
    setTimeout(() => {
      if (location.host === "checkin.runsystem.info") {
        if (location.pathname === "/login") {
          inputEmail.value = result.email;
          inputPass.value = result.password;
          document.querySelector("form button").click();
        } else {
          setTimeout(() => {
            document.querySelector("button").click();
            alert("Checkin tự động");
            setTimeout(() => {
              window.close();
            }, 1000);
          }, 2000);
          chrome.storage.sync.set({ auto: 0 }, function () {
            console.log("Remove auto success");
          });
        }
      }
    }, 2000);
  }
});
