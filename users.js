
        function addToDashboard(opportunity) {
            const userToken = localStorage.getItem("userToken");
            if (!userToken) {
              console.error("User token is missing. Authenticate the user first.");
              return;
            }
            if (!initialized) {
              fetch("http://localhost:3000/volunteer-opportunities/my-bookings", {
                method: "GET",
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
                    const dashboardTable = document
              .getElementById("dashboard-table")
              .querySelector("tbody");
            const row = dashboardTable.insertRow();
            
            opportunities.forEach((opportunity) => {
                const row = dashboardTable.insertRow(); // Move inside the loop
                row.innerHTML = `
                    <td>${opportunity.title}</td>
                    <td>${opportunity.date}</td>
                    <td>${opportunity.location}</td>
                    <td><button class="unbook-button" onclick="unbookOpportunity('${opportunity._id}', this)">Unbook</button></td>
                `;
            });
            
                    initialized = true;
                  })
                  throw new Error(`HTTP error! Status: ${response.status}`);

              }
            }
          
            