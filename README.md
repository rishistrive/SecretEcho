# SecretEcho 

---
A Fullstack chat application with real time communication built using ReactJS, NextJS, MongoDB and Socket.IO.

> Portfolio project, Open to contributions

You can view the project here:


## Technologies used

<h4 align="left">Frontend:</h4>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"        alt="javascript" width="40" height="40" />
</a>
&nbsp;&nbsp;
<a href="https://reactjs.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg"
        alt="react" width="40" height="40" />
</a>
&nbsp;&nbsp;
<a href="https://redux.js.org" target="_blank" rel="noreferrer"> 
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/> 
</a>

<h4 align="left">Backend:</h4>
<a href="https://nodejs.org" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg"
        alt="nodejs" width="40" height="40" />
</a>
&nbsp;&nbsp;
<a href="https://expressjs.com" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg"
        alt="express" width="40" height="40" />
</a>
&nbsp;&nbsp;
<a href="https://nextjs.org/" target="_blank" rel="noreferrer">
    <img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" alt="nextjs" width="40" height="40" />
</a>
&nbsp;&nbsp;
<a href="https://www.mongodb.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg"
        alt="mongodb" width="40" height="40" />
</a>

## Requirements

If you want to run the app locally, you need:

1. [NodeJS](https://nodejs.org/en) installed.
2. [MongoDB](https://www.mongodb.com/try/download/community) database installed.
   > You can either install a local [MongoDB database](https://www.mongodb.com/try/download/community) or you can create a cluster in the cloud using [MongoDB Atlas](https://www.mongodb.com/atlas).
3. Familiriaty with NodeJS and MongoDB. This includes how to create clusters, databases and collections in MongoDB.

## Install and use

1. Clone the project to a local repository.
2. Run `npm install` to install the required packages.

```bash
npm install
```





3. Create a `.env` file in the root folder and add the following:
JWT_SECRET_KEY=AnySecretKeyForJWT
MONGODB_URL=MongodbUrlConnectionString
NODE_ENV=development
PORT=4000
NEXT_PUBLIC_API=http://localhost:3000
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=cloudinaryCloudName
CLOUDINARY_API_KEY=cloudinaryApiKey
CLOUDINARY_API_SECRET=cloudinaryApiSecret
```

> For the JWT_SECRET_KEY, you can put any string that you want.

> For the MONGODB_URL, you have to put the connection string that is used to connect to your database, whether it's local or in the cloud.

> For the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, you need to get these credentials from [Cloudinary](https://cloudinary.com), which is a cloud-based media management platform that provides a comprehensive solution for storing, optimizing, manipulating, and delivering digital media assets such as images, videos, and audio files. 
5. Run `npm start` to run the app.
```bash
npm start
```
