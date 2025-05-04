// resourceService.js

// Function to fetch resources (articles, videos, etc.)
export const fetchResources = async () => {
    try {
      const response = await fetch('https://api.safemind.com/resources');  // Replace with your actual API endpoint
      const resources = await response.json();
      return resources;
    } catch (error) {
      console.error("Error fetching resources:", error.message);
      throw new Error('Failed to fetch resources.');
    }
  };
  
  // Function to fetch a single resource by its ID
  export const fetchResourceById = async (resourceId) => {
    try {
      const response = await fetch(`https://api.safemind.com/resources/${resourceId}`);  // Replace with actual API endpoint
      const resource = await response.json();
      return resource;
    } catch (error) {
      console.error("Error fetching resource:", error.message);
      throw new Error('Failed to fetch the resource.');
    }
  };
  
  // Function to add a new resource
  export const addResource = async (resourceData) => {
    try {
      const response = await fetch('https://api.safemind.com/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });
      const newResource = await response.json();
      return newResource;
    } catch (error) {
      console.error("Error adding resource:", error.message);
      throw new Error('Failed to add the resource.');
    }
  };
  
  // Function to update an existing resource
  export const updateResource = async (resourceId, updatedData) => {
    try {
      const response = await fetch(`https://api.safemind.com/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      const updatedResource = await response.json();
      return updatedResource;
    } catch (error) {
      console.error("Error updating resource:", error.message);
      throw new Error('Failed to update the resource.');
    }
  };
  
  // Function to delete a resource
  export const deleteResource = async (resourceId) => {
    try {
      const response = await fetch(`https://api.safemind.com/resources/${resourceId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete resource.');
      }
      return 'Resource deleted successfully.';
    } catch (error) {
      console.error("Error deleting resource:", error.message);
      throw new Error('Failed to delete the resource.');
    }
  };
  