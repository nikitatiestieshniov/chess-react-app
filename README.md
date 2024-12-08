
Chess Application Readme
Project Description
This project is a chess application developed using React and Electron, which includes features like puzzle solving, analysis, and game recording. The application is designed to be versatile and extensible for both casual players and enthusiasts interested in improving their chess skills.

Features
Interactive Chessboard: Play chess and analyze games interactively.
Puzzle Solving: Solve chess puzzles with adjustable difficulty.
Game Analysis: Analyze positions with move suggestions from databases.
Neo4j Integration: Utilizes Neo4j for advanced position and move analysis.
Installation and Setup
Prerequisites
Node.js (v16 or later)
npm or yarn
Steps to Run the Application
Clone the repository:

bash
Копировать код
git clone <repository-url>
cd chess
Install dependencies:

bash
Копировать код
npm install
Start the development server:

bash
Копировать код
npm run start
To run the Electron app:

bash
Копировать код
npm run electron-start
Neo4j Database Setup
The Neo4j database files are not included in this repository due to storage limitations. To fully test the application:

Download the database files from this Google Drive link.
Extract the files to the resources/neo4j directory.
Note: The extraction process might take a significant amount of time due to the file size.
Ensure Neo4j is installed and running on your machine, or use the provided neo4j start command if configured in the application.
Known Limitations
Neo4j Integration
The live demo site does not utilize Neo4j due to resource constraints on the server.
On local setups, the Neo4j database is required for the full functionality of the analysis feature.
Performance
The application may experience delays when loading large datasets or performing complex analyses.
Development
Scripts
npm start: Starts the React development server.
npm run electron-start: Starts the Electron application.
npm run build: Builds the React app for production.
npm run electron-pack: Packages the Electron app into a distributable format.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

Contact
For questions or support, please contact Your Name.

Enjoy playing and improving your chess skills!
