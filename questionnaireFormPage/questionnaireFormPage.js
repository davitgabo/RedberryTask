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
  let skillId = document.getElementById("skills").value;
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
  }
}

function removeSkill(skillId) {
  document.getElementById("skill-" + skillId).remove();
}

function appendSkills(skills) {
  skills.forEach((skill) => {
    document.getElementById("skills").innerHTML += `
  
  <option value="${skill.id}" id="skillId-${skill.id}">${skill.title}</option>
  `;
  });
}

/* Services */

function getSkills() {
  const Http = new XMLHttpRequest();
  const url = "https://bootcamp-2022.devtest.ge/api/skills";
  Http.open("GET", url);
  Http.send();
  Http.onreadystatechange = (e) => {
    appendSkills(JSON.parse(Http.responseText));
  };
}

getSkills();

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
