
const reviewRoutes = (app,fs) => {
    // variables
    const dataPath = './data_prepared/atmosphere_11#ac0ae909-e5f7-445e-b5be-d082418e03a7.json';

    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // read
    app.get('/reviews', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if(err){
                throw err;
            }
            res.send(JSON.parse(data));
        })
    });


    //create
    app.post('/reviews', (req, res) => {

        readFile(data => {
                const newUserId = Object.keys(data).length + 1;

                // add the new user
                data[newUserId] = JSON.parse(req.body.data);

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('new user added');
                });
            },
            true);
    });

    app.put('/users/:id', (req, res) => {

        readFile(data => {

                // add the new user
                const userId = req.params["id"];
                data[userId] = JSON.parse(req.body.data);

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`users id:${userId} updated`);
                });
            },
            true);
    });

};

module.exports = reviewRoutes;