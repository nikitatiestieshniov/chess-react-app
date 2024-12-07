const { exec } = require('child_process');

function startNeo4j() {
    console.log('Запуск Neo4j...');

    const command = 'neo4j start';

    const process = exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Ошибка при запуске Neo4j:', error.message);
            return;
        }
        if (stderr) {
            console.error('Лог Neo4j (stderr):', stderr);
            return;
        }
        console.log('Лог Neo4j (stdout):', stdout);
    });

    process.on('exit', (code) => {
        console.log(`Neo4j завершил процесс с кодом ${code}`);
    });
}

module.exports = startNeo4j;
