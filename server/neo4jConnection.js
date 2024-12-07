//neo4jConnection.js

const neo4j = require('neo4j-driver');


const driver = neo4j.driver(
    'bolt://127.0.0.1:7687', 
    neo4j.auth.basic('neo4j', 'ghvcjgvcgF5hvdhk'), 
    { encrypted: 'ENCRYPTION_OFF' } 
);


(async () => {
    try {
        const session = driver.session();
        await session.run('RETURN 1'); 
        console.log('Успешное подключение к Neo4j');
        await session.close();
    } catch (error) {
        console.error('Ошибка подключения к Neo4j:', error);
    }
})();


module.exports = driver;
