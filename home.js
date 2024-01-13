let initialized = false;

function fetchOpportunities() {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    console.error("User token is missing. Authenticate the user first.");
    return;
  }
  if (!initialized) {
    fetch("http://localhost:3000/volunteer-opportunities", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(HTTP`error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((opportunities) => {
        let container = document.getElementById("containerid");
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        opportunities.forEach((opportunity) => {
          createOpportunity(opportunity);
        });

        initialized = true;
      })
      .catch((error) => {
        console.error("Error fetching volunteer opportunities:", error);
      });
  }
}
function createOpportunity(opportunity) {
  const title = opportunity.title;
  const description = opportunity.description;

  const url = opportunity.photo;
  const location = opportunity.location;
  const date = opportunity.date;

  let mycontainerid = document.getElementById("containerid");
  const newcontainer = document.createElement("div");
  newcontainer.className = "leasetcontainer card ";
  newcontainer.innerHTML =
    '<img src="' +
    url +
    '" alt="Image" class="images card-image " style="width:fit-content" >';
  newcontainer.innerHTML += '<h3 id="title" class="title">' + title + "</h3>";
  newcontainer.innerHTML +=
    '<hp id="description" class="title">' + description + "</p>";
  newcontainer.innerHTML += '<h3 id="date" class="title ">' + date + "</h3>";
  newcontainer.innerHTML +=
    '<h3 id="location" class="title ">' + location + "</h3>";

  newcontainer.setAttribute("data-id", opportunity._id);
  const bookButton = document.createElement("button");
  bookButton.className =
    "button is-danger bg-green-500 hover:bg-green-700 col mr-2 ml-2 text-white font-bold px-1 rounded";
  bookButton.textContent = "Book Now";
  bookButton.onclick = () => BookOpportunity(opportunity._id); // Pass the opportunity ID to the function

  newcontainer.appendChild(bookButton);

  mycontainerid.insertBefore(newcontainer, mycontainerid.firstChild);
}
function BookOpportunity(opportunityId) {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    console.error("User token is missing. Authenticate the user first.");
    return;
  }

  // Assuming you have a backend endpoint to handle booking
  fetch(
    `http://localhost:3000/volunteer-opportunities/${opportunityId}/book`,
    {
      method: "POST", // or 'PUT', depending on your backend implementation
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ booked: true }), // or any other payload your backend expects
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Booking successful:", data);
      // Update the UI to reflect the booking
      // For example, disable the button and change its text
      addToDashboard(data.opportunity);
      document.querySelector(
        `[data-id="${opportunityId}"] .button`
      ).textContent = "Booked";
      document.querySelector(
        `[data-id="${opportunityId}"] .button`
      ).disabled = true;
    })
    .catch((error) => {
      console.error("Error booking opportunity:", error);
    });
}
function addToDashboard(opportunity) {
    
  const dashboardTable = document
    .getElementById("dashboard-table")
    .querySelector("tbody");
  const row = dashboardTable.insertRow();

  row.innerHTML = `
      <td>${opportunity.title}</td>
      <td>${opportunity.date}</td>
      <td>${opportunity.location}</td>
      <td><button class="unbook-button" onclick="unbookOpportunity('${opportunity._id}', this)">Unbook</button></td>
    `;
}
function unbookOpportunity(opportunityId, buttonElement) {
  // Call the backend to unbook the opportunity
  // Assuming you have an endpoint to handle unbooking

  fetch(
    `http://localhost:3000/volunteer-opportunities/unbook/${opportunityId}`,
    {
      method: "POST", // or 'PUT' or 'DELETE', as appropriate
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Remove the row from the dashboard
      buttonElement.closest("tr").remove();

      // Update the original "Book Now" button, if necessary
      const originalButton = document.querySelector(
        `[data-id="${opportunityId}"] .button`
      );
      if (originalButton) {
        originalButton.textContent = "Book Now";
      }
    })
    .catch((error) => {
      console.error("Error unbooking opportunity:", error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  // Check if we are on the home page
  if (document.getElementById("containerid")) {
    fetchOpportunities();
  }

  // Check if we are on the dashboard page
  if (document.getElementById("dashboard-table")) {
    // Code to initialize or update the dashboard
    // For example, you might want to fetch booked opportunities and display them
    fetchBookedOpportunities(); // This is a hypothetical function
  }
});
