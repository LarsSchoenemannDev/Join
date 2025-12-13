const storageUrl = "https://joinproject-51c1f-default-rtdb.europe-west1.firebasedatabase.app/contacts";
let fetchedData = {};

/**
 * defines async function to fetch Contact Data throw Firebase realtime Database:
 * fetch storageUrl using GET method and return the fetched data as JSON object.
 * doing a for loop to add the id to each contact object and extract the data from object entries to a new object.
 * @returns fetchedData object containing contacts with their IDs or {} in case of error.
 */
async function loadDataBase() {
    try {
        const response = await fetch(storageUrl + ".json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseToJson = await response.json();

        // Firebase returns object with IDs as keys: { "-NxAbc": {name, email, phone}, ... }
        // Convert to object where each contact has its id: { "-NxAbc": {id: "-NxAbc", name, email, phone}, ... }
        if (responseToJson && typeof responseToJson === 'object') {
            fetchedData = {};
            for (const [id, contactData] of Object.entries(responseToJson)) {
                fetchedData[id] = { id, ...contactData };
            }
        } else {
            fetchedData = {};
        }

        console.log('Loaded contacts from Firebase:', fetchedData);
        return fetchedData;
    } catch (error) {
        console.error('Error loading database:', error);
        fetchedData = {};
        return {};
    }
}


// Save new contact to Firebase realtime Database:
async function saveContact(contact) {
    try {
        const response = await fetch(storageUrl + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Contact saved:', result);
        return result

    } catch (error) {
        console.error('Error saving contact:', error);
        throw error;
    }
}

/**
 * defines an async function to delete contact from Firebase realtime Database:
 * fetch storageUrl/contactId using DELETE method and return the result.
 * @param {String} contactId 
 * @returns an object containing the result of the delete operation or throws an error in case of failure.
 */
async function deleteContact(contactId) {
    try {
        const response = await fetch(`${storageUrl}/${contactId}.json`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Contact deleted:', contactId);
        return result;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
}

// Update existing contact in Firebase realtime Database:
async function updateContactInFirebase(contactId, updatedContact) {
    try {
        const response = await fetch(`${storageUrl}/${contactId}.json`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedContact)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Contact updated:', contactId);
        return result;

    } catch (error) {
        console.error('Error updating contact:', error);
        throw error;
    }
}