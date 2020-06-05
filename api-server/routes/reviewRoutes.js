const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

const adapter = new FileSync('db.json');
const db = low(adapter);

module.exports = (app) => {

    app.get(`/api/users`, async (req, res) => {
        const users = db.get('users').value();
        return res.status(200).send(users);
    });

    // post, addition
    app.post(`/api/user`, async (req, res) => {
        const {name, lastName} = req.body;
        const id = shortid.generate();
        const users = db
            .get('users')
            .push({id, name, lastName})
            .write();

        const user = db.get('users')
            .find({id, name, lastName})
            .value();

        return res.status(201).send({
            error: false,
            user
        });
    })

    // update user.
    app.put(`/api/user`, async (req, res) => {
        const {name, lastName, id} = req.body;

        let users = db.get('users')
            .find({id})
            .assign({name, lastName})
            .write();

        const user = db.get('users')
            .find({id})
            .value();

        return res.status(202).send({
            error: false,
            user
        });
    });

    // delete user.
    app.delete(`/api/user/:id`, async (req, res) => {
        const {id} = req.params;
        console.log(id);

        db.get('users')
            .remove({id})
            .write()

        return res.status(202).send({
            error: false
        })

    })

}