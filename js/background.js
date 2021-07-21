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

setInterval(() => {
  chrome.storage.sync.get(
    [TIME_START, TIME_END, STORAGE_KEY_DAY_OF_WEEK_SELECTED],
    function (result) {
      const day_of_week_selected = result[STORAGE_KEY_DAY_OF_WEEK_SELECTED] || [
        "0",
        "1",
        "2",
        "3",
        "4",
      ];
      const time_start = result[TIME_START] || "08:00";
      const time_end = result[TIME_END] || "17:30";
      const current_now = now();
      console.log(day_of_week_selected, time_start, time_end);
      if (
        day_of_week_selected.indexOf(WEEK_DAYS[DAY].toString()) !== -1 &&
        (current_now.indexOf(`${time_start}:00`) !== -1 ||
          current_now.indexOf(`${time_end}:00`) !== -1)
      ) {
        chrome.tabs.create(
          { url: "https://checkin.runsystem.info"},
          function (a) {
            console.log(a);
          }
        );
      }
    }
  );
}, 1000);

function now() {
  const d = new Date();

  const year = addZero(d.getFullYear());

  const month = addZero(d.getMonth() + 1);

  const day = addZero(d.getDate());

  const hour = addZero(d.getHours());

  const min = addZero(d.getMinutes());

  const second = addZero(d.getSeconds());

  return `${year}-${month}-${day} ${hour}:${min}:${second}`;
}

function addZero(n) {
  return Number(n) < 10 ? "0" + n : n;
}
