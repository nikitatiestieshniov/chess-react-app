const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

app.on('ready', () => {
    
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true, 
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

    startServers();

    mainWindow.on('closed', () => {
        mainWindow = null;
        stopServers();
    });
});


function startServers() {
    console.log('Запуск серверов...');
    
    
    const javaPath = path.join(__dirname, 'jre', 'bin', 'java');
    const neo4jPath = path.join(__dirname, 'resources', 'neo4j', 'bin', 'neo4j');

    const neo4jProcess = spawn(neo4jPath, ['console'], {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, PATH: `${javaPath};${process.env.PATH}` },
    });

    neo4jProcess.unref();
    console.log('Neo4j запущен.');

    
    const serverProcess = spawn('node', [path.join(__dirname, 'server', 'server.js')], {
        detached: true,
        stdio: 'ignore',
    });
    serverProcess.unref();
    console.log('Express сервер запущен.');
}


function stopServers() {
    console.log('Завершаем работу серверов...');
    const neo4jPath = path.join(__dirname, 'resources', 'neo4j', 'bin', 'neo4j');
    const stopProcess = spawn(neo4jPath, ['stop'], {
        detached: true,
        stdio: 'ignore',
    });
    stopProcess.unref();
    console.log('Neo4j остановлен.');
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow = new BrowserWindow({
            width: 1024,
            height: 768,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
    }
});
