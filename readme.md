# Mongo DB with Replica Set

mongo-db: Follow the below guide to setup a 3 node mongo replica set. 
***

1. Create 3 EC2 instance in private zone.
2. For the inbound rules of EC2, open port 27017. This is the default port for mongo db.
3. Upload the docker-compose.yml file to each EC2 instance.
4. Mount a EFS and name it as /mongo-data in each of the EC2 instance. It would be used to store the mongo data.
5. Amend the extra_hosts in docker-compose.yml with the private ip of the EC2.
6. Run the below docker-compose command to bring up the mongo &nbsp;
   - docker-compose -f docker-compose.yml up -d
7. Run the below command in mongo1 to access the container. &nbsp;
   - docker exec -it {container-name} bash
8. Type "mongo" and you would be within the mongo cli interface.
9.  Type the below command to initialize the mongo replication set. You would need to initialize the replication set for one time only. 

```json
>rs.initiate(
  {
    _id : 'rs0',
    members: [
      { _id : 0, host : "mongo1:27017" },
      { _id : 1, host : "mongo2:27017" },
      { _id : 2, host : "mongo3:27017" }
    ]
  }
)

```

9.  Type rs.status() in each of the mongo client terminal.&nbsp;
    - Primary> would be shown for the mongo which is elected as primary node. 
    - Secondary> would be shown for the mongo which is elected as secondary node. 

10. Create DB, Collection and write document into the primary. 
```json
>use test
>db.createCollection("movies")
>db.movies.insert(
    {
        "titles" : "The matrix",
        "release" : 1999
    }
)
>db.movies.find().pretty()
```   
11. Connect to the secondary and see whether the DB content is sychronized.
```json
docker exec -it {container} bash
>mongo
>rs.secondaryOk()
>use test
>db.movies.find().pretty()
```

12. Kill the container which pick up the primary role. Use mongo client to access another mongo db server. Another mongo db shold pick up the primary role.

***
mongo-client: Follow the below guide to setup a nodejs web server handling http request. The http request handler would insert and query data using the 3 node mongo replica set.   
***

1. Create EC2 instance in the public zone. 
2. Edit docker-compose.yml for the extra_hosts mapping.Those mapping are for the mongo db servers.
3. Upload the code to the ECS instance and type the below command to bring it up. 
   - docker-compose -f docker-compose.yml up -d
4. Test the below two URL. 
   - Insert URL: http://{publc ip}:9090/insert
   - Query URL: http://{publc ip}:9090/find
5. Access mongo db and mongo client. Query the records as shown below. 
   - use test
   - db.kittens.find().pretty()
6. Kill the primary node mongo db container
7. Access the insert url and query url again. New record can be created. 

***
mongo-perfTest: Follow the below guide to perform stress test.   
Refer to https://www.npmjs.com/package/autocannon for the stress test tools.
***

1. Edit test.js for the below parameter. In the below configuration, autocannon would use 2 parallel threads to fire request at the rate of 5 request per second for 30 seconds to the insert url. The maximum number of request fired would be 300. 
   
```json
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
```

