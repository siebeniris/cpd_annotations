// import other routes
const reviewRoutes = require('./reviews');


const appRouter = (app, fs) =>{
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    reviewRoutes(app, fs);
};

module.exports = appRouter;