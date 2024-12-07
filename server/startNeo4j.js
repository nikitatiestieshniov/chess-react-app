const { exec } = require('child_process');

function startNeo4j() {
    console.log('������ Neo4j...');

    const command = 'neo4j start';

    const process = exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('������ ��� ������� Neo4j:', error.message);
            return;
        }
        if (stderr) {
            console.error('��� Neo4j (stderr):', stderr);
            return;
        }
        console.log('��� Neo4j (stdout):', stdout);
    });

    process.on('exit', (code) => {
        console.log(`Neo4j �������� ������� � ����� ${code}`);
    });
}

module.exports = startNeo4j;
