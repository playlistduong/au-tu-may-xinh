const inputEmail = document.querySelector("#orangeForm-email");
const inputPass = document.querySelector("#orangeForm-pass");
setTimeout(() => {
  if (location.host === "checkin.runsystem.info") {
    if (location.pathname === "/login") {
      inputEmail.value = "duongnt1@runsystem.net";
      inputPass.value = "TAc9DO4TOg";
      document.querySelector("form button").click();
      setTimeout(() => {
        document.querySelector("button").click();
        window.close();
      }, 1000);
    } else {
      document.querySelector("button").click();
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }
}, 2000);
