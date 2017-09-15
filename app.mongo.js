const express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    path = require('path'),
    ObjectID = require('mongodb').ObjectID,
    MongoClient = require('mongodb').MongoClient,
    _ = require('lodash'),
    cors = require('cors');

const db = {
    user: 'admin',
    password: 'admin',
    host: 'ds127864.mlab.com',
    port: 27864,
    db: 'invoiceapp'
};

let url = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.db}`;

MongoClient.connect(url).then(db => {
    let customersCollection = db.collection('customers');
    let productsCollection = db.collection('products');
    let invoicesCollection = db.collection('invoices');
    let invoiceItemsCollection = db.collection('invoice_items');

    customersCollection.insertMany(require('./seeds/customers'));
    productsCollection.insertMany(require('./seeds/products'));

    const app = module.exports = express();
    app.set('port', process.env.PORT || 8000);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cors());

    function transformObject(object) {
        if (typeof object === 'string') {
            object = JSON.parse(object)
        }
        object.id = object._id;
        delete object._id;
        return object;
    }

    function restoreDb() {
        customersCollection.insertMany(require('./seeds/customers'));
        productsCollection.insertMany(require('./seeds/products'));
    }

    app.route('/api/restoredb')
        .get(function (req, res) {
            Promise.all(
                customersCollection.removeMany(),
                productsCollection.removeMany(),
                invoicesCollection.removeMany(),
                invoiceItemsCollection.removeMany()
            ).then(() => {
                restoreDb();
                res.send('Default DB restores')
            }).catch(e => {
                console.log(e);
                restoreDb();
                res.send('Default DB restores')
            });
        });

    // CUSTOMERS API

    app.route('/api/customers')
        .get(function (req, res) {
            customersCollection.find()
                .toArray()
                .then(customers => {
                    res.json(customers.map(transformObject));
                })
        })
        .post(function (req, res) {
            let customer = _.pick(req.body, ['name', 'address', 'phone']);
            customersCollection.insertOne(customer)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.ops[0])));
                });
        });

    app.route('/api/customers/:customer_id')
        .get(function (req, res) {
            let filter = {_id: new ObjectID(req.params.customer_id)};
            customersCollection.findOne(filter)
                .then(customer => {
                    res.send(transformObject(JSON.stringify(customer)));
                });
        })
        .put(function (req, res) {
            let filter = {_id: new ObjectID(req.params.customer_id)};
            let customer = _.pick(req.body, ['name', 'address', 'phone']);
            customersCollection.findOneAndUpdate(filter, {$set: customer}, {returnNewDocument: true})
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        })
        .delete(function (req, res) {
            let filter = {_id: new ObjectID(req.params.customer_id)};
            customersCollection.findOneAndDelete(filter)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        });

    // PRODUCTS API

    app.route('/api/products')
        .get(function (req, res) {
            productsCollection.find()
                .toArray()
                .then(products => {
                    res.json(products.map(transformObject));
                })
        })
        .post(function (req, res) {
            let product = _.pick(req.body, ['name', 'price']);
            productsCollection.insertOne(product)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.ops[0])));
                });
        });

    app.route('/api/products/:product_id')
        .get(function (req, res) {
            let filter = {_id: new ObjectID(req.params.product_id)};
            productsCollection.findOne(filter)
                .then(product => {
                    res.send(transformObject(JSON.stringify(product)));
                });
        })
        .put(function (req, res) {
            let filter = {_id: new ObjectID(req.params.product_id)};
            let product = _.pick(req.body, ['name', 'price']);
            productsCollection.findOneAndUpdate(filter, {$set: product}, {returnNewDocument: true})
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        })
        .delete(function (req, res) {
            let filter = {_id: new ObjectID(req.params.product_id)};
            productsCollection.findOneAndDelete(filter)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        });


    // INVOICES API

    app.route('/api/invoices')
        .get(function (req, res) {
            invoicesCollection.find()
                .toArray()
                .then(invoices => {
                    res.json(invoices.map(transformObject));
                })
        })
        .post(function (req, res) {
            let invoice = _.pick(req.body, ['customer_id', 'discount', 'total']);
            invoicesCollection.insertOne(invoice)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.ops[0])));
                });
        });

    app.route('/api/invoices/:invoice_id')
        .get(function (req, res) {
            let filter = {_id: new ObjectID(req.params.invoice_id)};
            invoicesCollection.findOne(filter)
                .then(invoice => {
                    res.send(transformObject(JSON.stringify(invoice)));
                });
        })
        .put(function (req, res) {
            let filter = {_id: new ObjectID(req.params.invoice_id)};
            let invoice = _.pick(req.body, ['customer_id', 'discount', 'total']);
            invoicesCollection.findOneAndUpdate(filter, {$set: invoice}, {returnNewDocument: true})
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        })
        .delete(function (req, res) {
            let filter = {_id: new ObjectID(req.params.invoice_id)};
            invoicesCollection.findOneAndDelete(filter)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        });


    // INVOICE ITEMS API

    app.route('/api/invoices/:invoice_id/items')
        .get(function (req, res) {
            let filter = {invoice_id: req.params.invoice_id};
            invoiceItemsCollection.find(filter)
                .toArray()
                .then(invoiceItems => {
                    res.json(invoiceItems.map(transformObject));
                });
        })
        .post(function (req, res) {
            let invoiceItem = _.pick(req.body, ['product_id', 'quantity']);
            invoiceItem.invoice_id = req.params.invoice_id;
            invoiceItemsCollection.insertOne(invoiceItem)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.ops[0])));
                });
        });

    app.route('/api/invoices/:invoice_id/items/:id')
        .get(function (req, res) {
            let filter = {_id: new ObjectID(req.params.id)};
            invoiceItemsCollection.findOne(filter)
                .then(invoiceItem => {
                    res.send(transformObject(JSON.stringify(invoiceItem)));
                });
        })
        .put(function (req, res) {
            let filter = {_id: new ObjectID(req.params.id)};
            let invoiceItem = _.pick(req.body, ['product_id', 'quantity']);
            invoiceItemsCollection.findOneAndUpdate(filter, {$set: invoiceItem}, {returnNewDocument: true})
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        })
        .delete(function (req, res) {
            let filter = {_id: new ObjectID(req.params.id)};
            invoiceItemsCollection.findOneAndDelete(filter)
                .then(result => {
                    res.send(transformObject(JSON.stringify(result.value)));
                });
        });

    // Redirect all non api requests to the index
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Starting express server
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
})
    .catch(e => {
        console.log('ERROR SYNCING WITH DB', e);
    });