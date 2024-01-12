function deleteOpportunityFromDashboard(opportunityId) {
    fetch(`http://localhost:3000/volunteer-opportunities/${opportunityId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Additional logic after successful deletion
      })
      .catch(error => {
        console.error('Error deleting opportunity from dashboard:', error);
      });
  }