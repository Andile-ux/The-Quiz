var quiz = {
  data: [
    {
      question: "What is the largest organ in the human body?",
      options: ["Lungs", "Heart", "Kidneys", "Liver"],
      answer: 1,
    },
    {
      question: "What is the percentage of the earth covered by water?",
      options: ["51%", "61%", "71%", "81%"],
      answer: 3,
    },
    {
      question: "What is the atomic number of hydrogen?",
      options: ["2", "4", "1", "3"],
      answer: 2,
    },
    {
      question: "What is the oldest university in the UK?",
      options: ["Oxford", "Cambridge", "Manchester", "Bath"],
      answer: 0,
    },
    {
      question:
        "In the Big Bang Theory, what is the name of Sheldon and Leornard's neighbour?",
      options: ["Lily", "Jessie", "Patty", "Penny"],
      answer: 3,
    },
  ],

  //creating the elements we use to create divs
  hWrap: null,
  hUserInput: null,
  hQn: null,
  hAns: null,

  now: 0,
  score: 0,
  username: '',

  init: function () {
    quiz.hWrap = document.getElementById("quizWrap");
    quiz.hUserInput = document.createElement("div");
    quiz.hUserInput.id = "quizUserInput";
    quiz.hWrap.appendChild(quiz.hUserInput);

    // Request for user name
    quiz.hUserInput.innerHTML = `
      <br><input type="text" class="form-control shadow-none" placeholder="Provide your name..." id="username" /><br>
      <button class="btn btn-outline-primary" onclick="quiz.start()">Start Quiz</button>
    `;

    // Create the user history table
    let userHistoryTable = document.createElement("table");
    userHistoryTable.id = "userHistoryTable";
    userHistoryTable.classList.add("table");
    userHistoryTable.innerHTML = `
      <thead>
        <tr>
          <th scope="col">Username</th>
          <th scope="col">Score</th>
          <th scope="col">Total Questions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    quiz.hWrap.appendChild(userHistoryTable);
  },

  start: function () {
    quiz.username = document.getElementById("username").value;
    if (!quiz.username) {
      alert("Please enter your name");
      return;
    }

    // Hide the user history table
    document.getElementById("userHistoryTable").style.display = "none";

    // Remove user input section and start the quiz
    quiz.hUserInput.innerHTML = "";
    quiz.hQn = document.createElement("div");
    quiz.hQn.id = "quizQn";
    quiz.hWrap.appendChild(quiz.hQn);
    quiz.hAns = document.createElement("div");
    quiz.hAns.id = "quizAns";
    quiz.hWrap.appendChild(quiz.hAns);

    quiz.draw();
  },

  draw: function () {
    quiz.hQn.innerHTML = quiz.data[quiz.now].question;
    quiz.hAns.innerHTML = "";
    quiz.data[quiz.now].options.forEach(function (option, i) {
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "quiz";
      radio.id = "quizo" + i;
      quiz.hAns.appendChild(radio);
      var label = document.createElement("label");
      label.innerHTML = option;
      label.setAttribute("for", "quizo" + i);
      label.dataset.idx = i;
      label.addEventListener("click", function () {
        quiz.select(label);
      });
      quiz.hAns.appendChild(label);
    });
  },

  select: function (option) {
    var all = quiz.hAns.getElementsByTagName("label");
    for (var i = 0; i < all.length; i++) {
      all[i].removeEventListener("click", quiz.select);
    }

    var correct = option.dataset.idx == quiz.data[quiz.now].answer;
    if (correct) {
      quiz.score++;
      option.classList.add("correct");
    } else {
      option.classList.add("wrong");
    }

    quiz.now++;
    setTimeout(function () {
      if (quiz.now < quiz.data.length) {
        quiz.draw();
      } else {
        quiz.showResult();
      }
    }, 1000);
  },

  showResult: function () {
    quiz.hQn.innerHTML = `${quiz.username}, you have answered ${quiz.score} of ${quiz.data.length} questions correctly.`;
    quiz.hAns.innerHTML = "";

    // Retrieve existing user history or create an empty array
    let userHistory = JSON.parse(localStorage.getItem('userHistory')) || [];

    // Save current user result to history
    const userResult = {
      username: quiz.username,
      score: quiz.score,
      totalQuestions: quiz.data.length
    };
    userHistory.push(userResult);

    // Save the updated user history back to local storage
    localStorage.setItem('userHistory', JSON.stringify(userHistory));

    // Create and append the "View History" button
    let viewHistoryBtn = document.createElement("button");
    viewHistoryBtn.innerHTML = "View History";
    viewHistoryBtn.classList.add("btn", "btn-outline-secondary");
    viewHistoryBtn.addEventListener("click", quiz.viewHistory);
    document.getElementById("viewHistoryBtn").appendChild(viewHistoryBtn);
  },

  viewHistory: function () {
    // Retrieve user history from local storage
    let userHistory = JSON.parse(localStorage.getItem('userHistory')) || [];

    // Display user history in the HTML table
    let tableBody = document.getElementById("userHistoryTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = "";

    userHistory.forEach(function (userResult) {
      let row = tableBody.insertRow(tableBody.rows.length);
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);

      cell1.innerHTML = userResult.username;
      cell2.innerHTML = userResult.score;
      cell3.innerHTML = userResult.totalQuestions;
    });

    // Show the user history table
    document.getElementById("userHistoryTable").style.display = "table";
  },

  reset: function () {
    quiz.now = 0;
    quiz.score = 0;
    quiz.draw();
  },
};

window.addEventListener("load", quiz.init);
