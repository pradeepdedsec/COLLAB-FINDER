# **COLLAB-FINDER**  
### Social Networking Platform for Project Collaboration  

Collab-Finder is a platform designed to connect individuals for collaborative learning projects.  

## **Tech Stack**  
- **Frontend**: HTML, CSS, JavaScript, React.js  
- **Backend**: Express.js  
- **Database**: MySQL  

---

## **Features**  
- Personalized project recommendations.  
- A dedicated project showcase section.  
- Real-time chatbox for seamless communication.  
- Administrative tools for managing user data, messages, and feedback.  

---

## **Setup Instructions**  

### 1. Install XAMPP Server  
   - Start MySQL from XAMPP.

### 2. Configure the Database  
   - Open **phpMyAdmin**.  
   - Go to the **Import** section.  
   - Upload the `queries.sql` file.  
   - Click **Import** to create the database (`cbfinder`) and required tables.  

### 3. Install and Set Up Node.js  
   - Download and install Node.js from the [official website](https://nodejs.org).  

### 4. Set Up the Project  
   - Open **VS Code** and drag-and-drop the project folder.  
   - Update the `.env` file:  
     ```env
     SERVER_EMAIL=your-email@example.com
     SERVER_PASSWORD=your-app-password
     ```
     Replace `your-email@example.com` with your email and `your-app-password` with the temporary password (App Password) from your email provider.  

### 5. Install Dependencies 
   Run the following commands in the project root directory:  
   ```bash
   npm install
   cd FRONTEND
   npm run build
   cd ..

### 6. Start the Application
    Run the project using the command:
    ```bash
    npm run dev

### 7. Access the Application
    Open your browser and go to:
    http://localhost:5000



