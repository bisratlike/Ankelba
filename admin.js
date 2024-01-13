let initialized = false;

function fetchMusics() {
  const userToken = localStorage.getItem('userToken');
  if (!userToken) {
    console.error('User token is missing. Authenticate the user first.');
    return;
  }

  fetch('http://localhost:3000/volunteer-opportunities', {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(opportunities => {
    let container = document.getElementById('containerid');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    opportunities.forEach(opportunity => {
      createMusic(opportunity);
    });

    initialized = true;
  })
  .catch(error => {
    console.error('Error fetching volunteer opportunities:', error);
  });
}

function addMusic(event) {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const photoInput = document.getElementById('photo');
  const date = document.getElementById('date').value.trim();
  const location = document.getElementById('location').value.trim();
  const description = document.getElementById('description').value.trim();
  const userToken = localStorage.getItem('userToken');

  if (!title || !photoInput.files.length) {
    alert('Please fill in all fields, including selecting a photo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const photoBase64 = e.target.result;

    fetch('http://localhost:3000/volunteer-opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: title,
        photo: photoBase64,
        date: date,
        location: location,
        description: description,
      }),
    })
    .then(response => response.json())
    .then(newOpportunity => {
      console.log('New volunteer opportunity added successfully:', newOpportunity);
      createMusic(newOpportunity)
      closeModal();
      fetchMusics(); // Refetch opportunities to include new one
    })
    .catch(error => {
      console.error('Error adding volunteer opportunity:', error);
      alert('An error occurred while adding the opportunity. Please try again.');
    });
  };

  reader.onerror = function (error) {
    console.error('Error reading file:', error);
  };

  reader.readAsDataURL(photoInput.files[0]);
}

function createmusic(opportunity) {
    const title = opportunity.title;
    const description = opportunity.description;
    
    const url = opportunity.photo;
    const location =opportunity.location;
    const date =opportunity.date;

    let mycontainerid = document.getElementById('containerid');
    const newcontainer = document.createElement('div');
    newcontainer.className = 'leasetcontainer card ';
    newcontainer.innerHTML = '<img src="' + url + '" alt="Image" class="images card-image " style="width:fit-content" >';
    newcontainer.innerHTML +=
        '<h3 id="title" class="title">' + title + '</h3>';
        newcontainer.innerHTML +=
        '<hp id="description" class="title">' + description + '</p>';
        newcontainer.innerHTML +=
        '<h3 id="date" class="title ">' + date + '</h3>';
        newcontainer.innerHTML +=
        '<h3 id="location" class="title ">' + location + '</h3>';


    newcontainer.dataset._id = opportunity._id;
    newcontainer.innerHTML += '<button class="button is-danger bg-red-500 hover:bg-red-700 col mr-2 ml-2 text-white font-bold px-1  rounded" onclick="deleteOpportunity(' + opportunity._id + ')">Delete</button>';

    newcontainer.innerHTML += '<button class="button is-success  bg-green-500 hover:bg-green-700 ml-2 text-white font-bold px-1 rounded" onclick="editOpportunity(' + opportunity._id + ')">Edit</button>';
    mycontainerid.insertBefore(newcontainer, mycontainerid.firstChild);
}

    function openModal() {
        resetForm('editForm'); // Reset the form when opening
        document.getElementById('myModal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }
    
    // Function to close the create new album modal
    function closeModal() {
        document.getElementById('myModal').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
    }xs

    function editOpportunity(opportunityId) {
        // Fetch the opportunity details by ID
        fetch(`http://localhost:3000/volunteer-opportunities/${opportunityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((opportunity) => {
            // Populate the modal form with the opportunity details
            document.getElementById('editTitle').value = opportunity.title;
            document.getElementById('editPhoto').value = opportunity.photo;
            document.getElementById('editDate').value = opportunity.date;
            document.getElementById('editLocation').value = opportunity.location;
            document.getElementById('editDescription').value = opportunity.description;
      
            // Set up the "Save Changes" button to update the opportunity
            const saveChangesButton = document.getElementById('saveChangesButton');
            saveChangesButton.onclick = function () {
              updateOpportunity(opportunityId);
            };
      
            // Open the modal for editing
            openModal();
          })
          .catch((error) => {
            console.error('Error fetching opportunity details:', error);
          });
      }
      
      function updateOpportunity(opportunityId) {
        // Extract updated form values
        const editTitle = document.getElementById('editTitle').value.trim();
        const editPhoto = document.getElementById('editPhoto').value.trim();
        const editDate = document.getElementById('editDate').value.trim();
        const editLocation = document.getElementById('editLocation').value.trim();
        const editDescription = document.getElementById('editDescription').value.trim();
      
        // Validate input
        if (!editTitle || !editPhoto) {
          alert('Please fill in all fields.');
          return;
        }
      
        // Send a request to update the opportunity
        fetch(`http://localhost:3000/volunteer-opportunities/${opportunityId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
          body: JSON.stringify({
            title: editTitle,
            photo: editPhoto,
            date: editDate,
            location: editLocation,
            description: editDescription,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((updatedOpportunity) => {
            // Update the UI with the edited opportunity
            updateOpportunityUI(opportunityId, updatedOpportunity);
      
            // Close the modal
            closeModal();
          })
          .catch((error) => {
            console.error('Error updating opportunity:', error);
            alert('An error occurred while updating the opportunity. Please try again.');
          });
      }
      
      function deleteOpportunity(opportunityId) {
        // Confirm deletion
        const confirmDelete = confirm('Are you sure you want to delete this opportunity?');
      
        if (!confirmDelete) {
          return;
        }
      
        // Send a request to delete the opportunity
        fetch(`http://localhost:3000/volunteer-opportunities/${opportunityId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(() => {
            // Remove the deleted opportunity from the UI
            deleteOpportunityUI(opportunityId);
          })
          .catch((error) => {
            console.error('Error deleting opportunity:', error);
            alert('An error occurred while deleting the opportunity. Please try again.');
          });
      }
      
      function updateOpportunityUI(opportunityId, updatedOpportunity) {
        // Update the UI with the edited opportunity
        const opportunityCard = document.querySelector(`[data-id="${opportunityId}"]`);
        opportunityCard.querySelector('#title').textContent = updatedOpportunity.title;
        opportunityCard.querySelector('#description').textContent = updatedOpportunity.description;
        opportunityCard.querySelector('#date').textContent = updatedOpportunity.date;
        opportunityCard.querySelector('#location').textContent = updatedOpportunity.location;
      }
      
      function deleteOpportunityUI(opportunityId) {
        // Remove the deleted opportunity from the UI
        const opportunityCard = document.querySelector(`[data-id="${opportunityId}"]`);
        if (opportunityCard) {
          opportunityCard.remove();
        }
      }
      


