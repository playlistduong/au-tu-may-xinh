let maskOptions = {
  overwrite: true,
  autofix: true,
  mask: "HH:MM",
  blocks: {
    HH: {
      mask: IMask.MaskedRange,
      placeholderChar: "HH",
      from: 0,
      to: 23,
      maxLength: 2,
    },
    MM: {
      mask: IMask.MaskedRange,
      placeholderChar: "MM",
      from: 0,
      to: 59,
      maxLength: 2,
    },
  },
};

const STORAGE_KEY_DAY_OF_WEEK_SELECTED = "day_of_week_selected";
const TIME_START = "time_start";
const TIME_END = "time_end";
const WEEK_DAYS = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const DAY = new Date().toLocaleString("en", { weekday: "long" });

const timeImaskElements = document.querySelectorAll("regexp-mask");

var timeStartFormat = IMask(document.querySelector("#time-start"), maskOptions);
var timeEndFormat = IMask(document.querySelector("#time-end"), maskOptions);

chrome.storage.sync.get([STORAGE_KEY_DAY_OF_WEEK_SELECTED], function (result) {
  const day_of_week_selected = result[STORAGE_KEY_DAY_OF_WEEK_SELECTED] || [
    "0",
    "1",
    "2",
    "3",
    "4",
  ];

  setDayOfWeek(day_of_week_selected);
});

chrome.storage.sync.get([TIME_START], function (result) {
  document.querySelector("#time-start").value = result[TIME_START] || "08:00";
});

chrome.storage.sync.get([TIME_END], function (result) {
  document.querySelector("#time-end").value = result[TIME_END] || "17:30";
});

function setDayOfWeek(day_of_week_selected) {
  for (const day of day_of_week_selected) {
    const inputElm = document.querySelector(`input[data-index="${day}"]`);
    inputElm.checked = true;
  }
}

document.querySelector("#btn-save").addEventListener("click", function () {
  if (!timeStartFormat.masked.isComplete || timeEndFormat.masked.isComplete) {
    document.querySelector("#message").textContent =
      "Nhập thời gian đúng vào nào?";
  }
  const inputElms = document.querySelectorAll(`input[data-index]`);
  const new_day_of_week_selected = [];
  for (const inputElm of inputElms) {
    if (inputElm.checked) {
      new_day_of_week_selected.push(inputElm.getAttribute("data-index"));
    }
  }

  setDayOfWeek(new_day_of_week_selected);
  chrome.storage.sync.set(
    { [STORAGE_KEY_DAY_OF_WEEK_SELECTED]: new_day_of_week_selected },
    function () {
      console.log(`${STORAGE_KEY_DAY_OF_WEEK_SELECTED} updated`);
    }
  );

  const time_start = document.querySelector("#time-start").value;
  const time_end = document.querySelector("#time-end").value;

  chrome.storage.sync.set({ [TIME_START]: time_start }, function () {
    console.log(`${TIME_START} updated`);
  });

  chrome.storage.sync.set({ [TIME_END]: time_end }, function () {
    console.log(`${TIME_END} updated`);
  });
});

countdownRemainTime();

function countdownRemainTime() {
  const remainTimeElm = document.querySelector("#remain-time");
  setInterval(() => {
    chrome.storage.sync.get(
      [TIME_START, TIME_END, STORAGE_KEY_DAY_OF_WEEK_SELECTED],
      function (result) {
        remainTimeElm.style.display = "block";

        if (
          result[STORAGE_KEY_DAY_OF_WEEK_SELECTED].indexOf(
            WEEK_DAYS[DAY].toString()
          ) === -1
        ) {
          remainTimeElm.querySelector("span").innerHTML =
            '<span class="text-danger">Chưa setting cho ngày hôm nay</span>';
        } else {
          const current_time = time();
          if (current_time < result[TIME_START]) {
            const remain_time =
              getMinutesFromString(result[TIME_START]) -
              getMinutesFromString(current_time);
            remainTimeElm.querySelector(
              "span"
            ).innerHTML = `<span class="text-succes">Tự động checkin/checkout sau ${remain_time} phút nữa.</span>`;
          } else if (
            current_time >= result[TIME_START] &&
            current_time < result[TIME_END]
          ) {
            const remain_time =
              getMinutesFromString(result[TIME_END]) -
              getMinutesFromString(current_time);
            remainTimeElm.querySelector(
              "span"
            ).innerHTML = `<span class="text-succes">Tự động checkin/checkout sau ${remain_time} phút nữa.</span>`;
          } else {
            remainTimeElm.querySelector(
              "span"
            ).innerHTML = `<span class="text-succes">Đã quá thời hạn checkin/checkout.</span>`;
          }
        }
      }
    );
  }, 1000);
}

document.querySelector("#btn-close").addEventListener("click", function () {
  window.close();
});

function time() {
  const d = new Date();

  const hour = addZero(d.getHours());

  const min = addZero(d.getMinutes());

  return `${hour}:${min}`;
}

function getMinutesFromString(str) {
  const strSplit = str.split(":");
  return Number(strSplit[0]) * 60 + Number(strSplit[1]);
}

function addZero(n) {
  return Number(n) < 10 ? "0" + n : n;
}
