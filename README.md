## Blood Donation Application - Server

Welcome to the backend repository of our Blood Donation Application, an online platform dedicated to fostering blood donation by linking donors with those in need.

## Live URL

[Blood Donation Application](https://blood-donation-server-phi.vercel.app/)

## Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **Object Relational Mapping (ORM)**: Prisma for PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

- **Other Libraries**:
  - [bcrypt](https://www.npmjs.com/package/bcrypt): Library for hashing passwords.
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Library for generating and verifying JSON Web Tokens (JWT).
  - [Zod](https://github.com/colinhacks/zod): TypeScript-first schema declaration and validation library.

## Key Features:

1. **User Registration**
2. **User Login**
3. **Find Donors**
4. **Request Blood**
5. **View Donation Requests**
6. **Update Donation Status**
7. **View Profile**
8. **Update Profile**

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine. You can download it [here](https://nodejs.org/).
- PostgreSQL database setup.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/koushik-ahmad/blood-donation-server.git
   cd blood-donation-server
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```env
   DATABASE_URL = < database_url >
   JWT_SECRET = < jwt_secret >
   ```

4. Run the Prisma migrations to set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

- **Register as a Donor**: Sign up and complete your profile with necessary details.
- **Find Donors**: Use the search functionality to locate donors by blood type and location.
- **Send Donation Requests**: Request blood donations from suitable donors.
- **Manage Profile**: Update your information as needed through your profile page.
- **Admin Management**: Admins can manage users and their roles.

## Credentials

### Admin Credentials

- Email: admin@ph.com
- Password: 123456

### Donor Credentials

- Email: user@ph.com
- Password: 123456

## Contact

If you have any questions or feedback, please reach out at:

- **Email**: [koushikahmad123@gmail.com](mailto:koushikahmad123@gmail.com)
