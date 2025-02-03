# Portal for Country Polygon Management

This portal allows administrators to manage countries and their border polygons. It interacts with a backend server to store, update, and delete data in the database, ensuring secure authentication via tokens.

## Authentication and Token Management

- **Login & Registration**: Users can log in or register by providing their email and password. Upon successful login, a **JWT token** is stored in the browser's local storage and is used for authenticated requests to the backend server.
- **Token Management**: The portal uses the token to authenticate each action, ensuring that only authorized users can perform certain operations.
- **JWT Authentication**: The token is decoded to retrieve the user's information, and the server verifies the token for each request to protect against unauthorized access.

### Key Functions

1. **Login**: 
   - Users log in using their email and password. If successful, a JWT token is issued and stored.
   - The token is used to authenticate subsequent requests.
  
   ![Alt text]( https://github.com/almitoo/Polygon-management-portal/blob/e172bcbe98da5e8b7de7e1b5a47ad339620a778b/Screenshot%202025-02-03%20163406.png)
   
2. **Register**: 
   - New users can register by providing their email and password.
   - After successful registration, the user is logged in and a JWT token is issued.

3. **Add New Country**:
   - Admins can add new countries by providing country name, code, and polygons.
   - Polygons should be provided in a valid JSON array format (e.g., `[[[longitude, latitude], ...]]`).
   - The backend server validates the data and stores the country in the database.

4. **Edit Country Polygons**:
   - Admins can edit the polygons of an existing country.
   - The new polygon data is validated and sent to the server for updating in the database.
   - 
![Alt text](https://github.com/almitoo/Polygon-management-portal/blob/e172bcbe98da5e8b7de7e1b5a47ad339620a778b/Screenshot%202025-02-03%20163517.png)

5. **Delete Country**:
   - Admins can delete a country by specifying its code.
   - The backend server deletes the country and its associated polygons from the database.

6. **View Countries**:
   - The portal displays a list of all countries with their associated codes and polygons.
   - Admins can view and edit the polygons for each country.

7. **API Usage Statistics**:
   - The portal fetches statistics from the backend server, such as the total number of requests, the number of times a location was inside the country borders, and the number of false responses.

![Alt text](https://github.com/almitoo/Polygon-management-portal/blob/e172bcbe98da5e8b7de7e1b5a47ad339620a778b/Screenshot%202025-02-03%20163748.png)

### Data Storage

- The portal connects to a backend server to interact with a database (e.g., MongoDB).
- When a user adds, updates, or deletes a country, the portal sends a request to the backend server, which performs the operation and updates the database.
- The server ensures that only users with a valid token can modify data.
  
### Backend Communication

- All interactions with the backend server are protected using **Bearer Tokens** (JWT).
- The server receives the token in the request headers and validates it before allowing access to any protected routes.
- For actions like adding or deleting countries, the portal communicates with the backend via HTTP requests (GET, POST, PUT, DELETE), ensuring the correct data is stored in the database.

## How It Works

1. The user logs in or registers, receiving a JWT token in return.
2. The token is stored in the local storage of the browser.
3. For each operation (add/edit/delete country, view countries, etc.), the portal sends a request to the backend server, passing the token in the `Authorization` header.
4. The backend server verifies the token, processes the request, and updates the database accordingly.

## Security

- The use of JWT ensures that only authenticated users can perform sensitive operations, like adding or deleting countries.
- The token is stored in **local storage** and sent with every request to verify the user's identity.
- The backend server ensures secure communication by validating the token and checking user permissions.

## Getting Started

1. Clone this repository and set up the backend server.
2. Install the required dependencies for the frontend using `npm install`.
3. Make sure the backend server is running and connected to the database.
4. Open the portal in your browser and log in with the credentials provided by the admin.

## Example of API Usage

- To add a new country:
    ```js
    axios.post('/api/countries', {
      name: 'Country Name',
      code: 'CN',
      polygons: [[[-140.0, 60.0], [-120.0, 60.0], [-120.0, 50.0], [-140.0, 50.0], [-140.0, 60.0]]],
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    ```

## Conclusion

This portal provides a secure and easy-to-use interface for admins to manage country polygons and related data. By using JWT for authentication and authorization, the system ensures that only authorized users can make modifications to the data, keeping the process secure and efficient.

