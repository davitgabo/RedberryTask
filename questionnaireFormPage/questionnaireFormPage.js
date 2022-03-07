/* variables */
let skillsArr = [];

const token = "6cd43df6-7d5b-4ae7-9aa3-422a6768162b";
const Http = new XMLHttpRequest();
const skillsGetUrl = "https://bootcamp-2022.devtest.ge/api/skills";
const questionnarePostUrl = "https://bootcamp-2022.devtest.ge/api/application"

/* functions */

function hideAll() {
  document.getElementById("personalInf").className = "qp-hidden";
  document.getElementById("skills").className = "qp-hidden";
  document.getElementById("covid").className = "qp-hidden";
  document.getElementById("insights").className = "qp-hidden";
  document.getElementById("submit").className = "qp-hidden";
}

function redirect(id) {
  hideAll();
  document.getElementById(id).className = "nothidden";
}

function checkName(name, prefix) {
  const forbiddenCharacters =
    /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~1234567890]/;

  if (forbiddenCharacters.test(name) || name.length < 2) {
    return prefix + " is not valid";
  } else {
    return null;
  }
}

function checkMail(mail) {
  if (mail.search(/@/) < 0) {
    return "Email not valid";
  } else {
    let fields = mail.split("@");
    if (fields[1].search(/\./) < 1) {
      return "Email not valid";
    } else {
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
    skillsArr.push({
      id: skillId,
      experience: skillDuration
    })
  }

  

}

function removeSkill(skillId) {
  document.getElementById("skill-" + skillId).remove();
  skillsArr = skillsArr.filter(skill => skill.id != skillId);
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
  const phone = document.getElementById("number").value;
  const skills = skillsArr
  const work_preference = document.querySelector("input[name='work_preference']:checked")?.value;
  const had_covid = document.querySelector("input[name='covid_contraction']:checked")?.value
  const had_covid_at = document.getElementById("had_covid_at").value;
  const vaccinated = document.querySelector("input[name='vaccinated']:checked")?.value
  const vaccinated_at = document.getElementById("had_vaccine_at").value
  const will_organize_devtalk = document.querySelector("input[name='attendance']:checked")?.value
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
    console.log(res)
    if(res.ok) {
      document.getElementById("submit-button").className = "qp-hidden";
      document.getElementById("thank-you-text").className = ""

      setTimeout(function() {
        window.location.href = '../submittedApplicationsPage/submittedApplicationsPage.html'
      }, 3000)
      
    }
  })

}

/* DOM */

document.getElementById("firstName").oninput = function () {
  let respond = checkName(
    document.getElementById("firstName").value,
    "First name"
  );
  document.getElementById("firstNameVal").innerHTML = respond;
  appendClass(respond, "firstName");
};

document.getElementById("lastName").oninput = function () {
  let respond = checkName(
    document.getElementById("lastName").value,
    "Last name"
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
