
Welcome to the Rentify !

LIVE DEMO - https://rentify-sooty.vercel.app/


## Getting Started:

1. Clone this repository to your local machine.
2. Type cd Backend then type npm i after nodemodules installation completed type nodemon index.js
3. Now Open a New Terminal type cd myapp then type npm i after nodemodules installation completed type npm start
4. please create .env file in root folder of Backend and myapp and write environment variables which is necessary  to start server
5. Please Veiw at dotenvExample.txt in both myapp and Backend folders as sample reference for .env file
6. Make sure you follow in order to run servers without any error


## Features:

### User Authentication:

- Mandate login for buyers to view seller details.
- Unauthorized access to seller information redirects users to the login screen.

### Seller Flow:

- Sellers can post their properties by providing essential details such as place, number of bedrooms, bathrooms, nearby hospitals & colleges, etc.
- Sellers can view the properties they have posted.
- Sellers can update or delete their properties.

### Buyer Flow:

- Buyers can view all posted rental properties.
- Buyers can apply filters based on property details.
- Pagination and proper form validation are handled.

### Property Interactions:

- Buyers can express interest in a property by clicking on the "I'm Interested" button on the property widget.
- Sellers' contact details are displayed when a buyer expresses interest in a property.
- Buyers receive the seller's contact details via email when expressing interest.
- Sellers receive details about interested buyers via email.

### Like Button:

- Each property has a "Like" button to track user interest. The like count is live. used web socket for like button




## Technologies Used:

- Frontend: React.js
- Backend: Node.js with Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)




