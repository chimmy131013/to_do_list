// ==================================================
// GLOBAL DATA
// ==================================================

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// ==================================================
// TO-DO LIST
// ==================================================

const taskForm = document.getElementById("taskForm");

if (taskForm) {

    const taskInput = document.getElementById("taskInput");

    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const taskText = taskInput.value.trim();

        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            completedDate: null
        };

        tasks.push(newTask);

        saveTasks();
        displayTasks();

        taskInput.value = "";
        taskInput.focus();
    });

    displayTasks();
}


// Display all tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");

    if (!taskList) {
        return;
    }

    const emptyMessage = document.getElementById("emptyMessage");

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

        tasks.forEach(function (task) {

            const li = document.createElement("li");
            li.className = "task-item";

            const leftDiv = document.createElement("div");
            leftDiv.className = "task-left";

            // Checkbox
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "task-checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function () {
                toggleTask(task.id);
            });

            // Task text
            const span = document.createElement("span");

            span.className = "task-text";
            span.textContent = task.text;

            if (task.completed) {
                span.classList.add("completed");
            }

            leftDiv.appendChild(checkbox);
            leftDiv.appendChild(span);

            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", function () {
                deleteTask(task.id);
            });

            li.appendChild(leftDiv);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    }

    updateSummary();
}


// Complete / uncomplete task
function toggleTask(id) {

    const task = tasks.find(function (item) {
        return item.id === id;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    if (task.completed) {

        // Save the date on which task was completed
        task.completedDate = getTodayDate();

    } else {

        task.completedDate = null;
    }

    saveTasks();
    displayTasks();
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks();
}


// Update task summary
function updateSummary() {

    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");

    if (!totalTasks) {
        return;
    }

    const completed = tasks.filter(function (task) {
        return task.completed;
    });

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed.length;
    pendingTasks.textContent = tasks.length - completed.length;
}


// Save tasks
function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );
}


// Get today's date
function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==================================================
// CALENDAR
// ==================================================

// IMPORTANT:
// These variables are outside the if block
// so displayCalendar() can access them.

let currentDate = new Date();

let selectedDate = getTodayDate();


// Check if calendar page
const calendarDays = document.getElementById("calendarDays");

if (calendarDays) {

    displayCalendar();

    showCompletedTasks(selectedDate);


    // Previous month
    document.getElementById("prevMonth").addEventListener(
        "click",
        function () {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            displayCalendar();
        }
    );


    // Next month
    document.getElementById("nextMonth").addEventListener(
        "click",
        function () {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            displayCalendar();
        }
    );
}


// ==================================================
// DISPLAY CALENDAR
// ==================================================

function displayCalendar() {

    const calendar = document.getElementById("calendarDays");

    const monthYear = document.getElementById("monthYear");

    if (!calendar || !monthYear) {
        return;
    }

    calendar.innerHTML = "";

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();


    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    monthYear.textContent =
        monthNames[month] + " " + year;


    // First day of current month
    const firstDay = new Date(
        year,
        month,
        1
    ).getDay();


    // Number of days in current month
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();


    // Number of days in previous month
    const previousMonthDays = new Date(
        year,
        month,
        0
    ).getDate();


    // ----------------------------------------------
    // Previous month's dates
    // ----------------------------------------------

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const dayNumber =
            previousMonthDays - i;

        const div =
            document.createElement("div");

        div.className =
            "calendar-day other-month";

        const number =
            document.createElement("div");

        number.className = "day-number";

        number.textContent = dayNumber;

        div.appendChild(number);

        calendar.appendChild(div);
    }


    // ----------------------------------------------
    // Current month's dates
    // ----------------------------------------------

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const div =
            document.createElement("div");

        div.className = "calendar-day";


        const dateString = formatDate(
            year,
            month,
            day
        );


        // Day number
        const number =
            document.createElement("div");

        number.className = "day-number";

        number.textContent = day;

        div.appendChild(number);


        // Today's date
        if (
            dateString === getTodayDate()
        ) {

            div.classList.add("today");
        }


        // Selected date
        if (
            dateString === selectedDate
        ) {

            div.classList.add("selected");
        }


        // Check whether tasks were completed
        // on this date
        const completedOnDate =
            tasks.some(function (task) {

                return (
                    task.completed &&
                    task.completedDate === dateString
                );

            });


        if (completedOnDate) {

            const dot =
                document.createElement("div");

            dot.className = "task-dot";

            div.appendChild(dot);
        }


        // Click date
        div.addEventListener(
            "click",
            function () {

                selectedDate = dateString;

                displayCalendar();

                showCompletedTasks(dateString);
            }
        );


        calendar.appendChild(div);
    }
}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(year, month, day) {

    const formattedMonth =
        String(month + 1).padStart(2, "0");

    const formattedDay =
        String(day).padStart(2, "0");

    return `${year}-${formattedMonth}-${formattedDay}`;
}


// ==================================================
// SHOW COMPLETED TASKS
// ==================================================

function showCompletedTasks(date) {

    const title =
        document.getElementById("selectedDate");

    const list =
        document.getElementById(
            "completedTasksList"
        );

    if (!title || !list) {
        return;
    }


    const dateObject =
        new Date(date + "T00:00:00");


    const formattedDate =
        dateObject.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    title.textContent =
        "Completed Tasks - " +
        formattedDate;


    const completedTasks =
        tasks.filter(function (task) {

            return (
                task.completed &&
                task.completedDate === date
            );

        });


    list.innerHTML = "";


    if (completedTasks.length === 0) {

        const message =
            document.createElement("p");

        message.className =
            "empty-message";

        message.textContent =
            "No tasks were completed on this date.";

        list.appendChild(message);

        return;
    }


    completedTasks.forEach(function (task) {

        const div =
            document.createElement("div");

        div.className =
            "completed-task";

        div.textContent =
            "✓ " + task.text;

        list.appendChild(div);
    });
}