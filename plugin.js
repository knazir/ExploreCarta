"use strict";

const config = {
  ICON_URL: chrome.extension.getURL("res/icon.png"),
  CARTA_URL_PREFIX: "https://carta.stanford.edu/course",
  TERMS_REGEX: /Terms:\s+([^|]+\|)/g,
  DEFAULT_QUARTER_CODE: 1174
};

const quarters = {
  AUT: 2,
  WIN: 4,
  SPR: 6,
  SUM: 8
};

const courseResults = [
  ...document.querySelectorAll(".searchResult"),
  ...document.querySelectorAll(".searchResult-noBorder")
];

function createButtonDomNode(link) {
  const buttonContainer = document.createElement("span");
  buttonContainer.classList.add("ec-result");

  const buttonLink = document.createElement("a");
  buttonLink.classList.add("ec-link");
  buttonLink.target = "_blank";
  buttonLink.href = link;

  const buttonImage = document.createElement("img");
  buttonImage.classList.add("ec-icon");
  buttonImage.src = config.ICON_URL;

  buttonLink.appendChild(buttonImage);
  buttonContainer.appendChild(buttonLink);

  return buttonContainer;
}

function getTermsOffered(courseInfo) {
  const termsDescription = courseInfo.querySelector(".courseAttributes").textContent
    .toString()
    .match(config.TERMS_REGEX)[0]
    .replace(/\s+/g, "")
    .slice(0, -1);

  return termsDescription.substring(termsDescription.indexOf("Terms:") + "Terms:".length)
    .split(",")
    .map(term => term.toUpperCase());
}

function getCurrentQuarterCodeSuffix() {
  const month = new Date().getMonth();
  switch (month) {
    case 7: case 8: case 9:
      return quarters.AUT;
    case 10: case 11: case 0: case 1:
      return quarters.WIN;
    case 2: case 3: case 4:
      return quarters.SPR;
    case 5: case 6:
      return quarters.SUM;
  }
}

function getQuarterCode(termsOffered) {
  if (termsOffered.filter(term => Object.keys(quarters).indexOf(term) !== -1).length === 0) {
    return config.DEFAULT_QUARTER_CODE;
  }

  let currentYear = new Date().getYear() + 1;
  const currentQuarterCodeSuffix = getCurrentQuarterCodeSuffix();
  let quarterCodeSuffix = currentQuarterCodeSuffix;

  for (const term of termsOffered) {
    if (quarters[term] === quarterCodeSuffix) {
      break;
    }

    if (quarters[term] > quarterCodeSuffix) {
      quarterCodeSuffix = quarters[term];
      break;
    }
  }

  if (currentQuarterCodeSuffix !== quarters.AUT) {
    currentYear--;
  }
  return (currentYear * 10) + quarterCodeSuffix;
}

courseResults.forEach(result => {
  const courseInfo = result.querySelector(".courseInfo");
  const courseName = courseInfo.querySelector("h2");
  const courseCode = courseName.querySelector(".courseNumber").textContent.slice(0, -1).replace(/\s+/g, "");
  const courseTitle = courseName.querySelector(".courseTitle");

  const termsOffered = getTermsOffered(courseInfo);
  const quarterCode = getQuarterCode(termsOffered);

  const courseLink = `${config.CARTA_URL_PREFIX}/${courseCode}/${quarterCode}`;
  const courseButton = createButtonDomNode(courseLink);
  courseTitle.appendChild(courseButton);
});
