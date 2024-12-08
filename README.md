# Getting Started with Chess Application

This project is a chess application developed with [React](https://reactjs.org/) and [Electron](https://www.electronjs.org/). It provides features like puzzles, analysis, and gameplay for chess enthusiasts.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.  
You may also see lint errors in the console.

### `npm run electron-start`

Runs the Electron app for desktop use.  
Ensure the React app is running or built for this to function.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include hashes.  
Your app is ready to be deployed!

### `npm run electron-pack`

Packages the Electron app into a distributable format for Windows, macOS, or Linux.  
Distributable files will be saved in the `dist` folder.



---

## Neo4j Database Integration

The application integrates with **Neo4j** for advanced chess position analysis. The database files are not included due to size limitations.

To enable Neo4j-based features:

1. Download the database files from [this Google Drive link](#).
2. Extract the files into the `resources/neo4j` directory.  
   **Note**: Extraction may take time due to the file size.
3. Start Neo4j with the command `neo4j start` or using the Neo4j Desktop application.

If you are running the app in a resource-constrained environment, Neo4j functionality may be disabled to optimize performance.


### Start Neo4j along with SQLite by running the server:
node server.js


### Starting Neo4j

You can start Neo4j in one of the following ways:

1. Navigate to the `bin` directory of the extracted Neo4j files and run:
   ```bash
neo4j console---

## Deployment

### Web Deployment

1. Run `npm run build` to create a production-ready build of the React app.

### Desktop Deployment

1. Run `npm run electron-pack` to package the app into an executable format for your platform.
2. The packaged app will be available in the `dist` folder.

---

## Learn More

### Documentation

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- [Neo4j Documentation](https://neo4j.com/docs/)



Enjoy improving your chess skills with the Chess Application!
