import * as orders from "../data/orders.json";
import * as users from "../data/users.json";
import * as companies from "../data/companies.json";
import "./style.css";

export default (function() {
  let order = orders.default;
  let user = users.default;
  let company = companies.default;

  let sortArray = [];

  let totalCost = 0,
    femaleCost = 0,
    maleCost = 0,
    femaleCount = 0,
    maleCount = 0;

  let tbody = document.getElementsByTagName("tbody")[0];
  let thead = document.getElementsByTagName("thead")[0];

  for (let i = 0; i < order.length; i++) {
    let tr = document.createElement("tr");
    tr.id = `order_${i + 1}`;

    //transaction_id
    let transactionId = document.createElement("td");
    transactionId.innerText = order[i].transaction_id;
    tr.appendChild(transactionId);

    //user_data(class)
    let userId = document.createElement("td");
    userId.classList.add("user_data");

    let userName = document.createElement("a");
    userName.href = `#order_${i + 1}`;
    userName.style.cursor = "pointer";

    let k = order[i].user_id - 1;

    if (user[k].gender === "Male") {
      userName.innerText = `Mr. ${user[k].first_name} ${user[k].last_name}`;
      maleCost += +order[k].total;
      maleCount++;
    } else {
      userName.innerText = `Ms. ${user[k].first_name} ${user[k].last_name}`;
      femaleCost += +order[k].total;
      femaleCount++;
    }
    userId.appendChild(userName);

    //div with all includes(class: user-details)
    let userDetails = document.createElement("div");
    userDetails.classList = "user-details";
    userDetails.style.display = "none";
    userId.appendChild(userDetails);

    let userBirthday = document.createElement("p");
    let dateBirthday = new Date(+user[k].birthday);
    userBirthday.innerText = `Birthday: ${dateBirthday.toLocaleDateString(
      "en-GB"
    )}`;
    userDetails.appendChild(userBirthday);

    let userPhoto = document.createElement("p");
    let image = document.createElement("img");
    image.src = user[k].avatar;
    image.width = "100";
    userPhoto.appendChild(image);
    userDetails.appendChild(userPhoto);

    let userCompany = document.createElement("p");
    userCompany.innerText = "Company: ";
    let companyWebsite = document.createElement("a");
    companyWebsite.target = "_blank";
    if (user[k].company_id === null) {
      companyWebsite.innerText = "none";
    } else {
      companyWebsite.href = company[user[k].company_id - 1].url;
      companyWebsite.innerText = `${company[user[k].company_id - 1].title}`;
    }
    userCompany.appendChild(companyWebsite);
    userDetails.appendChild(userCompany);

    let userIndustry = document.createElement("p");
    if (user[k].company_id === null) {
      userIndustry.innerText = "Industry: none";
    } else {
      userIndustry.innerText = `Industry: ${
        company[user[k].company_id - 1].industry
      }`;
    }
    userDetails.appendChild(userIndustry);

    userName.addEventListener("click", () => {
      if (userDetails.style.display == "none") {
        userDetails.style.display = "block";
      } else {
        userDetails.style.display = "none";
      }
    });

    tr.appendChild(userId);

    //created_at
    let createdAt = document.createElement("td");
    createdAt.innerText = `${new Date(+order[i].created_at).toLocaleDateString(
      "en-GB"
    )}, ${new Date(+order[i].created_at).toLocaleTimeString("en-US")}`;
    tr.appendChild(createdAt);

    //cost
    let total_ = document.createElement("td");
    total_.innerText = `$${order[i].total}`;
    tr.appendChild(total_);
    totalCost += +order[i].total;

    //card_number
    let cardNumber = document.createElement("td");
    let hiddenNumber = order[i].card_number;
    cardNumber.innerText =
      hiddenNumber.slice(0, 2) +
      Array(hiddenNumber.length - 6)
        .fill("*")
        .join("") +
      hiddenNumber.slice(-4);
    tr.appendChild(cardNumber);

    //card_type
    let cardType = document.createElement("td");
    cardType.innerText = order[i].card_type;
    tr.appendChild(cardType);

    //Location
    let location = document.createElement("td");
    location.innerText = `${order[i].order_country} (${order[i].order_ip})`;
    tr.appendChild(location);

    //добавили строку со всеми включениями в tbody
    tbody.appendChild(tr);
    sortArray.push(tr);
  }
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  let tr = document.createElement("tr");

  let ordersCount = document.createElement("td");
  ordersCount.innerText = order.length;
  tr.appendChild(ordersCount);

  let ordersTotal = document.createElement("td");
  ordersTotal.innerText = "$ " + totalCost.toFixed(2);
  tr.appendChild(ordersTotal);

  let medianValue = document.createElement("td");
  medianValue.innerText = "$ " + (totalCost / 2).toFixed(2);
  tr.appendChild(medianValue);

  let averageCheck = document.createElement("td");
  averageCheck.innerText = "$ " + (totalCost / order.length).toFixed(2);
  tr.appendChild(averageCheck);

  let averageFemale = document.createElement("td");
  averageFemale.innerText = "$ " + (femaleCost / femaleCount).toFixed(2);
  tr.appendChild(averageFemale);

  let averageMale = document.createElement("td");
  averageMale.innerText = "$ " + (maleCost / maleCount).toFixed(2);
  tr.appendChild(averageMale);

  document
    .getElementById("statistics")
    .childNodes[1].childNodes[3].appendChild(tr);

  //sort
  thead.getElementsByTagName("th")[2].addEventListener("click", () => {
    let span = document.createElement("span");
    if (thead.getElementsByTagName("th")[2].children[0] != null) {
      thead
        .getElementsByTagName("th")[2]
        .removeChild(thead.getElementsByTagName("th")[2].children[0]);
    }
    if (sortArray[0].firstChild.innerText > sortArray[1].firstChild.innerText) {
      span.innerHTML = "&#8595;";
      thead.getElementsByTagName("th")[2].appendChild(span);
      sortArray.sort((a, b) => {
        return a.firstChild.textContent.localeCompare(b.firstChild.textContent);
      });
    } else if (
      sortArray[0].firstChild.innerText < sortArray[1].firstChild.innerText
    ) {
      span.innerHTML = "&#8593;";
      thead.getElementsByTagName("th")[2].appendChild(span);
      sortArray.sort((a, b) => {
        return b.firstChild.textContent.localeCompare(a.firstChild.textContent);
      });
    }
    tbody.innerHTML = "";
    for (let i = 0; i < sortArray.length; i++) {
      tbody.appendChild(sortArray[i]);
    }
  });

  thead.getElementsByTagName("th")[3].addEventListener("click", () => {
    if (
      sortArray[0].children[1].children[0].innerText !=
      sortArray[1].children[1].children[0].innerText
    ) {
      sortArray.sort((a, b) => {
        return a.children[1].children[0].innerText.localeCompare(
          b.children[1].children[0].innerText
        );
      });
    } else {
      sortArray.reverse();
    }
    tbody.innerHTML = "";
    for (let i = 0; i < sortArray.length; i++) {
      tbody.appendChild(sortArray[i]);
    }
  });

  thead.getElementsByTagName("th")[4].addEventListener("click", () => {
    if (
      sortArray[0].children[2].childNodes[0].textContent >
      sortArray[1].children[2].childNodes[0].textContent
    ) {
      sortArray.sort((a, b) => {
        return a.children[2].childNodes[0].textContent.localeCompare(
          b.children[2].childNodes[0].textContent
        );
      });
    } else if (
      sortArray[0].children[2].childNodes[0].textContent <
      sortArray[1].children[2].childNodes[0].textContent
    ) {
      sortArray.sort((a, b) => {
        return b.children[2].childNodes[0].textContent.localeCompare(
          a.children[2].childNodes[0].textContent
        );
      });
    }
    tbody.innerHTML = "";
    for (let i = 0; i < sortArray.length; i++) {
      tbody.appendChild(sortArray[i]);
    }
  });
})();
