const calendarGrid = document.querySelector("#calendar-grid");
const monthYear = document.querySelector(".main-heading");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

const customSpecialDays = [
    {name: "Hannan's Birthday", date: 17, month: 2}, 
    {name: "Alisha's Birthday", date: 13, month: 10}, 
    {name: "Maham's Birthday", date: 12, month: 10}, 
    {name: "Alisha's Birthday", date: 10, month: 0}, 
    {name: "Azra's Birthday", date: 10, month: 11}, 
    {name: "Maryam's Birthday", date: 1, month: 5}, 
    {name: "Samra's Birthday", date: 4, month: 5}, 
    {name: "Nimra's Birthday", date: 20, month: 6}, 
    {name: "Naseer's Birthday", date: 12, month: 8}, 
    {name: "Inshaal's Birthday", date: 1, month: 1}, 
]

const BASE_URL =
  "https://calendarific.com/api/v2/holidays?&api_key=Jfy6yKJzT4v5fd8Nnl4pQYg4yZyPcxOu&country=PK&year=2024";

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

async function fetchHolidays(year) {
  try {
    const response = await fetch(`${BASE_URL}&year=${year}`);
    if (!response.ok) throw new Error("Failed to fetch holidays");
    const { response: { holidays = [] } = {} } = await response.json();
    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
}

function renderCalendar(month, year, holidays = []) {
  calendarGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = `${new Date(year, month).toLocaleString("default", {
    month: "long",
  })} ${year}`;

  // Add blank spaces for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += '<div class="day empty"></div>';
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const holiday = holidays.find(
      (h) => new Date(h.date.iso).getDate() === day && new Date(h.date.iso).getMonth() === month
    );
    const specialDay = customSpecialDays.find((s) => s.date === day && s.month === month);
    calendarGrid.innerHTML += `<div class="day ${
      isToday ? "today" : specialDay ? "special" : ""
    }" title="${specialDay ? specialDay.name : holiday ? holiday.name : ""}">
      ${day}${specialDay ? " 🎂" : holiday ? " 🎉" : ""}
    </div>`;
  }
}

prevBtn.addEventListener("click", async () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  const holidays = await fetchHolidays(currentYear);
  renderCalendar(currentMonth, currentYear, holidays);
});

nextBtn.addEventListener("click", async () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  const holidays = await fetchHolidays(currentYear);
  renderCalendar(currentMonth, currentYear, holidays);
});

(async function initializeCalendar() {
  const holidays = await fetchHolidays(currentYear);
  renderCalendar(currentMonth, currentYear, holidays);
})();
