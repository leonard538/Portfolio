// ------------------
// FETCH JSON File
// ------------------
async function loadJSON(path) {
    const response = await fetch(path);
    if(!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }
    return await response.json();
}

// --------- 
// PROJECTS
// ---------

const projParent = document.getElementById('container-projects');
let allProjects = [];

fetch('project.json')
    .then(response => response.json())
    .then(projects => {
        allProjects = projects;
        makeProjects(allProjects);
});

function makeProjects(projects) {
    projParent.innerHTML = ``;

    projects.forEach(proj => {
        const projCard = document.createElement('div');
        projCard.classList.add('proj-card');

        // Create Tech Tags 
        let techTags = '';
        if(proj.tech && proj.tech.length > 0) {
           techTags = proj.tech.map(tag => `<span class="tech-tags">${tag}</span>`).join('');
        } 
        else {
           techTags = '<span class="tech-tags empty"></span>';
        }
        const link = proj.link && proj.link.trim() !== '' ? proj.link : '#';

        projCard.innerHTML = `
            <a href="${link}" target="_blank" class="proj-link">
                <section class="proj-img">
                    <img src="${proj.image}" alt="${proj.title}">
                </section>
                <section class="proj-details">
                    <h3>
                        ${proj.title}
                        <span class="material-symbols-outlined">arrow_outward</span>
                    </h3>
                    <p>${proj.description}</p>
                    
                    <aside class="tech-used">
                        ${techTags}
                    </aside>
                </section>
            </a>
        `;

        projParent.appendChild(projCard);
    });
}

// Filter Project Buttons
const button = document.querySelectorAll('.project-filters button');
button.forEach(btn => {
    btn.addEventListener('click', () => {
        button.forEach(buttons => {
            buttons.classList.remove('active')
        });
        btn.classList.add('active');

        const category = btn.dataset.category;
        if(category === 'All') {
            makeProjects(allProjects);
        }
        else {
            const filtered = allProjects.filter(proj =>
                proj.categories && proj.categories.includes(category)
            );
            makeProjects(filtered);
        }

    });
});

// -------------
// CERTIFICATES
// -------------
async function makeCertificate() {
    const certContainer = document.getElementById('container-cert');
    const certificates = await loadJSON('certificates.json');

    certificates.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.classList.add('cert-card');

        certCard.innerHTML = `
            <a href="${cert.link}" target="_blank">
                <img src="${cert.image}">
            </a>
        `;
        
        certContainer.appendChild(certCard);
    });
}

// ------------
// COMPLETIONS
// ------------
async function makeCompletions() {
    const completionType = await loadJSON('completions.json');

    const tesdaContainer = document.getElementById('tesda-accomp');
    const dictContainer = document.getElementById('dict-accomp');

    if(completionType.TESDA) {
        const ul = document.createElement('ul');

        completionType.TESDA.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('completion-item');

            li.innerHTML = `
                <a href="${item.image}" target="_blank">
                    ${item.title}
                </a>
            `;
            ul.appendChild(li);
        })
        tesdaContainer.appendChild(ul);
    }

    if(completionType.DICT) {
        const ul = document.createElement('ul');

        completionType.DICT.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('completion-item');

            li.innerHTML = `
                <a href="${item.image}" target="_blank">
                    ${item.title}
                </a>
            `;
            ul.appendChild(li);
        })
        dictContainer.appendChild(ul);
    }

    if(completionType.DataCamp) {
        const courseList = document.getElementById('courses-list');
        const skillList = document.getElementById('skills-list');
        const courses = completionType.DataCamp.Course || [];
        const skills = completionType.DataCamp.Skill || [];

        courses.forEach(course => {
            const courseItem = document.createElement('li');
            
            courseItem.innerHTML = `
                <a href="${course.image}" target="_blank">
                    ${course.title}
                </a>
            `;
            courseList.appendChild(courseItem);
        });

        skills.forEach(skill => {
            const skillItem = document.createElement('li');
            
            skillItem.innerHTML = `
                <a href="${skill.image}" target="_blank">
                    ${skill.title}
                </a>
            `;
            skillList.appendChild(skillItem);
        });
    }
}





const techList = [
    "Packet Tracer", "VirtualBox", "VMware ",
    "Figma", "HTML", "CSS", "JavaScript",
    "PHP", "MySQL",
    "PostgreSQL", "Firebase"
];

const fullList = [...techList, ...techList];
const techContainer = document.getElementById('tech-list-container');

fullList.forEach(item => {
    const techItem = document.createElement('div');
    techItem.classList.add('tech-item');

    techItem.innerHTML = `
        <h4>${item}</h4>
    `;
    techContainer.appendChild(techItem);
});

const navAnchor = document.querySelectorAll('#nav a');
navAnchor.forEach(anchor => {
    anchor.addEventListener('click', () => {
        navAnchor.forEach(nav => {
            nav.classList.remove('active')
        });
        anchor.classList.add('active');
    });
});

const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });


// Blinking Cursor
document.addEventListener('DOMContentLoaded', () => {
  const text = "IT Student | Web & Network Enthusiast";
  const typingText = document.getElementById('typing-text');
  let index = 0;

  function typeEffect() {
    if (index < text.length) {
      typingText.textContent += text.charAt(index);
      index++;
      setTimeout(typeEffect, 80); // typing speed (in ms)
    }
  }

  typeEffect();
});


// ---------------
// INITIALIZE ALL
// ---------------
async function initialize() {
    await Promise.all([
        makeCertificate(),
        makeCompletions()
    ]);
    projectFilter();
}

initialize().catch(err => console.error(err));