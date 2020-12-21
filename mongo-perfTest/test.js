const autocannon = require('autocannon')
const instance = autocannon({
url: 'http://18.166.208.48:9090',
connections: 2,
connectionRate: 5,
duration: 30,
amount: 300,

requests: [
 {
   path: '/insert'
 }
] 
}, console.log)

instance.on('done', ()=>{
    console.log('Test has completed.');
})