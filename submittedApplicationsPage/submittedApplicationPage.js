/* variables */
const token = "6cd43df6-7d5b-4ae7-9aa3-422a6768162b";
const Http = new XMLHttpRequest();
const questionnareGetUrl = "https://bootcamp-2022.devtest.ge/api/applications"
const skillsGetUrl = "https://bootcamp-2022.devtest.ge/api/skills";

let skillsets = []
let applications = []

/* functions */

function toggleAccordion() {
    let accordion = document.getElementsByClassName("sp-accordion");
    let i;
    
    for (i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener("click", function() {
            this.classList.toggle("sp-active");
        
            let panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
      });
    }
}

function buildSubmittedApplication(applications) {
    let submittedApplicationsDiv = document.getElementById('submittedApplications');
    let index = 1
    applications.forEach(application => {
        submittedApplicationsDiv.innerHTML += `
        <button class="sp-accordion">${index}</button>
                <div class="sp-panel">
                    <div class="sp-infoSection">
                        ` + buildPersonalInfo(application) + buildSkillset(application) + buildCovidInfo(application) + buildInsightInfo(application) + `
                        
                        
                        
                    </div>
                </div>
        `

        index++;
    })

    toggleAccordion();
    

}

function buildPersonalInfo(application) {
    return personalInfo = `
    <div class="sp-infoBlock">
        <span class="sp-infoHeader">Personal information</span>

        <div class="sp-info">
            <div class="sp-infoDiv">First Name</div> <div class="sp-infoDiv sp-infoDivGreyColor">${application.first_name}</div>
        </div>
        <div class="sp-info">
            <div class="sp-infoDiv">Last Name</div> <div class="sp-infoDiv sp-infoDivGreyColor">${application.last_name}</div>
        </div>
        <div class="sp-info">
            <div class="sp-infoDiv">E-mail</div> <div class="sp-infoDiv sp-infoDivGreyColor">${application.email}</div>
        </div>
        <div class="sp-info">
            <div class="sp-infoDiv">Phone</div> <div class="sp-infoDiv sp-infoDivGreyColor">${application.phone ? application.phone : "No phone number"}</div>
        </div>
    </div>
    `
}

function buildSkillset(application) {
    let skillSetDiv
    application.skills.forEach(skill => {
        let chosenSkill
        chosenSkill = skillsets.filter(skillset => skillset.id === skill.id);
        if(chosenSkill.length) {
            if(skillSetDiv) {
                skillSetDiv += `
                <div class="sp-info">
                    <div class="sp-infoDiv">${chosenSkill[0].title}</div> <div class="sp-infoDiv">Years of Experience: ${skill.experience}</div>
                </div>
                `
            } else {
                skillSetDiv = `
            <div class="sp-info">
                <div class="sp-infoDiv">${chosenSkill[0].title}</div> <div class="sp-infoDiv">Years of Experience: ${skill.experience}</div>
            </div>
            `
            }
            
        }
    })
        return `
        <div class="sp-infoBlock">
            <span class="sp-infoHeader">Skillset</span>
            ${skillSetDiv}
        </div>
        `
    
}

function buildCovidInfo(application) {
    let vaccinatedDate;
    let covidDate;

    if(application.had_covid) {
        covidDate = `
        <div class="sp-radioInputWrapper">
            When did you have covid 19?
            <div class="sp-dateInput">
            <input type="date" id="had_covid_at" value="${application.had_covid_at}" disabled>
            </div>
        </div>
        `
    }
    if(application.vaccinated) {
        vaccinatedDate = `
        <div class="sp-radioInputWrapper">
                When did you get covid vaccine?
                <div class="sp-dateInput">
                    <input type="date" value="${application.vaccinated_at}" disabled>
                </div>

            </div>
        `
    }

    return `
    <div class="sp-infoBlock">
        <span class="sp-infoHeader">Covid Situation</span>
        <div class="sp-covid">
            <div class="sp-radioInputWrapper">
                How would you prefer to work?
                <div class="sp-radioInput">
                    <input type="radio" disabled ${application.work_preference == "from_office" ? "checked" : ""}> <label for="from_office">From Sairme Office</label>
                </div>
                <div class="sp-radioInput">
                    <input type="radio" disabled ${application.work_preference == "from_home" ? "checked" : ""}> <label for="from_home">From Home</label>
                </div>
                <div class="sp-radioInput">
                    <input type="radio" disabled ${application.work_preference == "hybrid" ? "checked" : ""}> <label for="hybrid">Hybrid</label>
                </div>
            </div>
            <div class="sp-radioInputWrapper">
                Did you have covid 19?
                <div class="sp-radioInput">
                    <input type="radio" disabled ${application.had_covid ? "checked" : ""}> <label for="cotract_covid_true">Yes</label>
                </div>
                <div class="sp-radioInput">
                    <input type="radio" disabled ${!application.had_covid ? "checked" : ""}> <label for="cotract_covid_true">No</label>
                </div>
                ${covidDate ? covidDate : ""}
            </div>

        </div>
        <div class="sp-vaccine">
            <div class="sp-radioInputWrapper">
                Have you been vaccinated?
                <div class="sp-radioInput">
                    <input type="radio"  disabled ${application.vaccinated ? "checked" : ""}> <label for="vaccine_true" >Yes</label>
                </div>
                <div class="sp-radioInput">
                    <input type="radio" disabled ${!application.vaccinated ? "checked" : ""}> <label for="vaccine_false">No</label>
                </div>
            </div>
            ${vaccinatedDate ? vaccinatedDate : ""}
        </div>
    </div>
    `
}

function buildInsightInfo(application) {
    let devtalk;
    if(application.will_organize_devtalk) {
        devtalk = `
        <div class="sp-textareaWrapper">
            What would you speak about at Devtalk?
            <div class="sp-textarea">
                <textarea placeholder="I would..." cols="30" rows="7" disabled>${application.devtalk_topic}</textarea>
            </div>
        </div>
        `
    }

    return `
    <div class="sp-infoBlock">
        <span class="sp-infoHeader">Insights</span>
        <div class="sp-radioInputWrapper">
            Would you attend Devtalks and maybe also organize your own?
            <div class="sp-radioInput">
                <input type="radio" ${application.will_organize_devtalk ? "checked" : ""} disabled> <label for="attend_true">Yes</label>
            </div>
            <div class="sp-radioInput">
                <input type="radio" ${!application.will_organize_devtalk ? "checked" : ""} disabled> <label for="attend_false">No</label>
            </div>

            ${devtalk ? devtalk : ""}

            <div class="sp-textareaWrapper">
            Tell us something special
            <div class="sp-textarea">
                <textarea placeholder="I..." cols="30" rows="7" disabled>${application.something_special}</textarea>
            </div>
        </div>
    </div>
    `
}


function onInit() {
    getSkills();
    getSubmittedApplications();
}

onInit()

/* services */

function getSubmittedApplications() {
    fetch(questionnareGetUrl + `?token=${token}`, {
        method: "GET",
        headers: {'Content-Type': 'application/json', 'accept': 'application/json'}, 
      }).then(res => res.json()).then(applications => {
        buildSubmittedApplication(applications);
      })
}

function getSkills() {
    fetch(skillsGetUrl, {
      method: "GET",
      headers: {'Content-Type': 'application/json', 'accept': 'application/json'}, 
    }).then(res => res.json()).then(skills => {
        skillsets = skills
    })
}