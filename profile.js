function openModal() {
  resetForm("editForm");
  document.getElementById("editmyModal").style.display = "block";
  document.getElementById("editoverlay").style.display = "block";
}

function closeModal() {
  document.getElementById("editmyModal").style.display = "none";
  document.getElementById("editoverlay").style.display = "none";
}
function getUserIdFromToken() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      console.error("User token is missing.");
      return null;
    }
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.sub; 
  }
function fetchUserProfile() {

    const userId = getUserIdFromToken();
  if (!userId) {
    console.error("User ID is missing.");
    return;
  }
  fetch(`http://localhost:3000/users/${UserId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  })
    .then((response) => response.json())
    .then((profile) => {
      document.getElementById("editname").value = profile.name;
      document.getElementById("editemail").value = profile.email;
      document.getElementById("editpass").value = profile.password;
      document.getElementById("editphonenumber").value = profile.phoneNumber;

      // Store UserId for further updates
      document.getElementById("editmyModal").dataset.userId = profile._id;
      openModal();
    })
    .catch((error) => {
      console.error("Error fetching user details:", error);
    });
}

function updateUser() {
    const userId = getUserIdFromToken();
  if (!userId) {
    console.error("User ID is missing.");
    return;
  }
  
  const editname = document.getElementById("editname").value.trim();
  const editemail = document.getElementById("editemail").value.trim();
  const editpass = document.getElementById("editpass").value.trim();
  const editphonenumber = document
    .getElementById("editphonenumber")
    .value.trim();

  if (!editname || !editemail || !editpass || !editphonenumber) {
    alert("Please fill in all fields.");
    return;
  }

  fetch(`http://localhost:3000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
    body: JSON.stringify({
      name: editname,
      email: editemail,
      password: editpass,
      phoneNumber: editphonenumber,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((updatedUser) => {
      alert("Profile updated successfully.");
      closeModal();
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the profile. Please try again.");
    });
}

function deleteUser(userId) {
  // Function to delete user account
}
