/* variables */
let skillsArr = [];

const token = "6cd43df6-7d5b-4ae7-9aa3-422a6768162b";
const Http = new XMLHttpRequest();
const skillsGetUrl = "https://bootcamp-2022.devtest.ge/api/skills";
const questionnarePostUrl = "https://bootcamp-2022.devtest.ge/api/application"

const pages = ["personalInf", "skills", "covid", "insights", "submit"];
const validation = {
  personalInf: {
    FirstName: false,
    LastName: false,
    email: false,
  },
  skills: {
    atLeastone: false,
  },
  covid: {
    preferToWork: false,
    contactCovid: false,
    when: false,
    vaccinated: false,
    whenvaccinated: false,
  },
  insights: {
    devtalks: false,
    about: false,
    somethingSpecial: false,
  },
};

/* functions */

function hideAll() {
  document.getElementById("personalInf").className = "qp-hidden";
  document.getElementById("skills").className = "qp-hidden";
  document.getElementById("covid").className = "qp-hidden";
  document.getElementById("insights").className = "qp-hidden";
  document.getElementById("submit").className = "qp-hidden";
}

function redirect(id) {
  let pagenumber = pages.indexOf(id);
  for (i = 0; i < pagenumber; i++) {
    for (const [key, value] of Object.entries(validation[pages[i]])) {
      console.log(key, value);
      if (value == false) {
        return;
      }
    }
  }
  hideAll();
  document.getElementById(id).className = "nothidden";
}

function checkName(name, prefix) {
  const forbiddenCharacters =
    /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~1234567890]/;

  if (forbiddenCharacters.test(name) || name.length < 2) {
    validation.personalInf[prefix] = false;
    return prefix + " is not valid";
  } else {
    validation.personalInf[prefix] = true;
    return null;
  }
}

function checkMail(mail) {
  if (mail.search(/@/) < 0) {
    validation.personalInf["email"] = false;
    return "Email not valid";
  } else {
    let fields = mail.split("@");
    if (fields[1].search(/\./) < 1) {
      validation.personalInf["email"] = false;
      return "Email not valid";
    } else {
      validation.personalInf["email"] = true;
      return null;
    }
  }
}

function checkTel(number) {
  let reg = /^\d+$/;
  number = number.replace(/\s+/g, "");

  if (number[0] != "+") {
    return "Number must begin with +";
  } else {
    number = number.substring(1);
  }

  if (number.indexOf("9955") != 0) {
    return "Please enter georgian number";
  } else if (reg.test(number) != true) {
    return "Must contains numbers only";
  } else if (number.length != 12) {
    return "Number is not valid";
  } else {
    return null;
  }
}

function appendClass(respond, id) {
  if (respond) {
    document.getElementById(id).className = "qp-invalid";
  } else {
    document.getElementById(id).className = null;
  }
}

function addProgrammingLanguage() {
  let skillId = document.getElementById("skills-select").value;
  let skillName = document.getElementById("skillId-" + skillId).innerHTML;
  let skillDuration = document.getElementById("duration").value;
  let skillDivId = document.getElementById("skill-" + skillId);
  let shouldAdd = true;

  if (skillDivId) {
    shouldAdd = false;
    alert("Can't add the same skill twice");
  }

  if (shouldAdd) {
    document.getElementById("skillsWrapper").innerHTML += `
    <div class="qp-skills" id="skill-${skillId}">
                  <div>${skillName}</div>
                  <div>Years of Experience: ${skillDuration}</div>
                  <div><img src="../assets/img/Remove.png" id="removeBtn-${skillId}" onclick="removeSkill(${skillId})" alt="remove" /></div>
                </div>
    `;
    validation.skills.atLeastone = true;
    skillsArr.push({
      id: skillId,
      experience: skillDuration
    })
  }
}

function removeSkill(skillId) {
  document.getElementById("skill-" + skillId).remove();
  skillsArr = skillsArr.filter(skill => skill.id != skillId);
  if (!skillsArr.length){
    validation.skills.atLeastone = false;
  }
}

function appendSkills(skills) {
  skills.forEach((skill) => {
    document.getElementById("skills-select").innerHTML += `
  
  <option value="${skill.id}" id="skillId-${skill.id}">${skill.title}</option>
  `;
  });
}

function generateBodyForSendRequest() {
  const first_name = document.getElementById("firstName").value;
  const last_name = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value ? document.getElementById("number").value : "No phone number"; // ტელეფონის ნომერს ითხოვს სერვერი, როდესაც ტელეფონის ნომერი სავალდებულო ველი არ არის.
  const skills = skillsArr
  const work_preference = document.querySelector("input[name='work_preference']:checked")?.value;
  const had_covid = document.querySelector("input[name='covid_contraction']:checked")?.value
  const had_covid_at = document.getElementById("had_covid_at").value ? document.getElementById("had_covid_at").value : new Date(); // კოვიდის თარიღს ითხოვს სერვერი, როდესაც კოვიდის მნიშვნელობა false არის.
  const vaccinated = document.querySelector("input[name='vaccinated']:checked")?.value
  const vaccinated_at = document.getElementById("had_vaccine_at").value ? document.getElementById("had_vaccine_at").value : new Date(); // ვაქცინაციის თარიღს ითხოვს სერვერი, როდესაც ვაქცინაციის მნიშვნელობა false არის.
  const will_organize_devtalk = document.querySelector("input[name='attendence']:checked")?.value
  const devtalk_topic = document.getElementById("devtalk_subject").value
  const something_special = document.getElementById("something_special").value

  return  reqBody = {
    token: token,
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    skills: skills,
    work_preference: work_preference,
    had_covid: had_covid == "true",
    had_covid_at: had_covid_at,
    vaccinated: vaccinated == "true",
    vaccinated_at: vaccinated_at,
    will_organize_devtalk: will_organize_devtalk == "true",
    devtalk_topic: devtalk_topic,
    something_special: something_special,
  }
}

function submitForm() {
  sendQuestionnareFormWithHttpReq();
}

function toggleCovidCalendar() {
  let covidCalendarDiv = document.getElementById("covid-date");
  let had_covid = document.querySelectorAll('input[name="covid_contraction"]');
  had_covid.forEach(elem => {
    elem.addEventListener("change", function(event) {
      validation.covid.contactCovid = true;
      if (event.target.value == "false") {
        validation.covid.when = true;
        covidCalendarDiv.style.display = "none";
      } else {
        validation.covid.when = false;
        covidCalendarDiv.style.display = "block";
      }
    })
  })
}

toggleCovidCalendar();

function toggleVaccineCalendar() {
  let vaccineCalendarDiv = document.getElementById("vaccine-date");
  let had_vaccine = document.querySelectorAll('input[name="vaccinated"]');
  had_vaccine.forEach(elem => {
    elem.addEventListener("change", function(event) {
      validation.covid.vaccinated = true;
      if (event.target.value == "false") {
        validation.covid.whenvaccinated = true;
        vaccineCalendarDiv.style.display = "none";
      } else {
        validation.covid.whenvaccinated=false;
        vaccineCalendarDiv.style.display = "block";
      }
    })
  })
}

toggleVaccineCalendar();

function toggleDevtalk() {
  let devtalkDiv = document.getElementById("devtalk");
  let devtalkAttendence = document.querySelectorAll('input[name="attendence"]');
  devtalkAttendence.forEach(elem => {
    elem.addEventListener("change", function(event) {
      validation.insights.devtalks = true;
      if (event.target.value == "false") {
        validation.insights.about = true;
        devtalkDiv.style.display = "none";
      } else {
        validation.insights.about = false;
        devtalkDiv.style.display = "block";
      }
    })
  })
}

toggleDevtalk();

function checkWorkPreference() {
  let workPreference = document.querySelectorAll('input[name="work_preference"]');
  workPreference.forEach(elem => {
    elem.addEventListener('change', function() {
      validation.covid.preferToWork = true;
    })
  })
}

checkWorkPreference();


function checkText(id, name) {
  text = document.getElementById(id)?.value;
  if(text !== "") {
    validation.insights[name] = true;
  } else {
    validation.insights[name] = false;
  }
}

function onVaccineDateChange() {
  let calendarValue = document.getElementById("had_vaccine_at")?.value;
  if(calendarValue !== "") {
    validation.covid.whenvaccinated = true;
  } else {
    validation.covid.whenvaccinated = false;
  }
}

function onCovidDateChange() {
  let calendarValue = document.getElementById("had_covid_at")?.value;
  if(calendarValue !== "") {
    validation.covid.when = true;
  } else {
    validation.covid.when = false;
  }
}

/* Services */

function getSkills() {
  fetch(skillsGetUrl, {
    method: "GET",
    headers: {'Content-Type': 'application/json', 'accept': 'application/json'}, 
  }).then(res => res.json()).then(skills => {
    appendSkills(skills);
  })
}
getSkills();

function sendQuestionnareFormWithHttpReq() {
  let reqBody = generateBodyForSendRequest()

  fetch(questionnarePostUrl, {
    method: "POST",
    headers: {'Content-Type': 'application/json', 'accept': 'application/json'}, 
    body: JSON.stringify(reqBody)
  }).then(res => {
    if(res.ok) {
      document.getElementById("submit-button").className = "qp-hidden";
      document.getElementById("thank-you-text").className = ""

      setTimeout(function() {
        window.location.href = '../welcomePage/welcomePage.html'
      }, 3000)
      
    }
  })

}

/* DOM */

document.getElementById("firstName").oninput = function () {
  let respond = checkName(
    document.getElementById("firstName").value,
    "FirstName"
  );
  document.getElementById("firstNameVal").innerHTML = respond;
  appendClass(respond, "firstName");
};

document.getElementById("lastName").oninput = function () {
  let respond = checkName(
    document.getElementById("lastName").value,
    "LastName"
  );
  document.getElementById("lastNameVal").innerHTML = respond;
  appendClass(respond, "lastName");
};

document.getElementById("email").oninput = function () {
  let respond = checkMail(document.getElementById("email").value);
  document.getElementById("emailVal").innerHTML = respond;
  appendClass(respond, "email");
};

document.getElementById("number").oninput = function () {
  let respond = checkTel(document.getElementById("number").value);
  document.getElementById("numberVal").innerHTML = respond;
  appendClass(respond, "number");
};

document.getElementById("duration").oninput = function () {
  let years = document.getElementById("duration").value;
  let reg = /^\d+$/;
  if (reg.test(years) != true) {
    document.getElementById("addLanguageBtn").setAttribute("disabled", true);
  } else {
    document.getElementById("addLanguageBtn").removeAttribute("disabled");
  }
};
