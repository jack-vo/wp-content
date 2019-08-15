const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const csvtojson = require('csvtojson');
const _ = require('lodash');
const Fakerator = require('fakerator');
const args = (argv => {
    const result = {};

    argv.forEach((arg, index) => {
        if (index > 1) {
            const arr = arg.split('=');

            result[arr[0]] = arr[1];
        }
    });

    return result;
})(process.argv);
let dbConnection;


// =================================
// Input validation
// =================================
function validateConfig() {
    return new Promise((resolve, reject) => {
        if (!args.env) {
            return reject('"env" is missing');
        }

        if (!args.target) {
            return reject('"target" is missing. Declare "all" to process all or the product ID you want to inject');
        }

        resolve();
    })
}

// =================================
// Methods
// =================================
const config = args.env && JSON.parse(fs.readFileSync(`./config/${args.env}.json`));
const prepareDataProvider = () => {
    return new Promise((resolve, reject) => {
        const file = path.resolve(__dirname, `data/${args.env}/${args.target}.csv`);

        csvtojson()
            .fromFile(file)
            .then(data => {
                config.data = {
                    name: args.target,
                    list: _.map(data, 'review')
                };

                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
};
// Utils methods
const utils = {
    table(tableName) {
        return `${config.db.table_prefix}_${tableName}`;
    },
    generateFakeData(productId, content) {
        const fakerator = new Fakerator();
        const name = fakerator.names.name();
        const names = name.split(' ');
        const email = fakerator.internet.email(names[0], names[1]);
        const ip = fakerator.internet.ip();
        const date = dbConnection
            .escape(fakerator.date.recent(150)) // get random date in the last number of days
            .replace(/'/g, '')
            ;

        return {
            comment_post_ID: productId,
            comment_content: content,

            comment_author: name,
            comment_author_email: email,
            comment_author_IP: ip,
            comment_date: date,
            comment_date_gmt: date,

            // Prefix comment data
            user_id: 0,
            comment_type: 'review',
            comment_parent: 0,
            comment_karma: 0,
            comment_approved: 1,
            comment_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
        };
    }
};
const db = {
    connect() {
        dbConnection = mysql.createConnection(config.db);

        return new Promise((resolve, reject) => {
            dbConnection.connect(error => {
                if (error) {
                    return reject(error);
                }

                console.log('===========================');
                console.log('DB connected !!!');
                console.log('===========================');
                resolve(dbConnection);
            });
        });
    },
    end() {
        if (dbConnection) {
            dbConnection.end();
            dbConnection = null;
        }
    },
    getAllReviews() {
        return new Promise((resolve, reject) => {
            const query =
                `
                SELECT \`ID\` as product_id, \`post_title\` AS product, \`guid\` AS product_url, \`comment_author\` AS customer_name, \`comment_author_email\` AS email, \`comment_date\` , \`comment_content\` AS comment
FROM \`${utils.table('comments')}\`
INNER JOIN \`${utils.table('posts')}\` ON \`comment_post_ID\`=\`ID\`
WHERE \`comment_author\` != 'WooCommerce'
AND \`comment_author\` != 'ActionScheduler'
AND \`post_title\` != 'wc_admin_unsnooze_admin_notes'
ORDER BY \`${utils.table('comments')}\`.\`comment_date\` DESC
                `;
            
            dbConnection.query(query, (error, results, fields) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    fields,
                    data: results
                });
            });
        });
    },
    getProductId() {
        const query = `SELECT \`ID\` FROM \`${utils.table('posts')}\` WHERE \`post_name\` = '${config.data.name}'`;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error, results, fields) => {
                if (error) {
                    return reject({
                        error,
                        method: 'getProductId'
                    });
                }

                config.data.id = results[0].ID;

                resolve();
            });
        });
    },
    updatePostReviewsCount() {
        const { id, list } = config.data;
        const count = list.length;
        const query = `UPDATE \`${utils.table('posts')}\` SET comment_count = ${count} WHERE \`ID\` = ${id}`;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error) => {
                if (error) {
                    return reject({
                        error,
                        method: 'updatePostReviewsCount'
                    });
                }

                resolve();
            });
        });
    },
    insertComments() {
        return new Promise((resolve, reject) => {
            const { id, list } = config.data;
            const comments = _.map(list, content => {
                return utils.generateFakeData(id, content);
            });
            const fields = Object.keys(comments[0]);
            const commentValues = [comments.map(comment => {
                return fields.map(key => comment[key]);
            })];
            const query = `INSERT IGNORE INTO \`${utils.table('comments')}\` (${fields.toString()}) VALUES ?`;

            dbConnection.query(query, commentValues, (error, results) => {
                if (error) {
                    return reject({
                        error,
                        method: 'insertComments'
                    });
                }

                resolve({
                    startId: results.insertId,
                    length: comments.length
                });
            });
        });
    },
    insertRatings(data) {
        const values =  [_.times(data.length, index => [
            data.startId + index, //id
            'rating', // rating type
            _.random(4, 5, false) // rating
        ])];
        const ratings = _.map(values[0], _.last);
        const averageRating = _.mean(ratings);
        const query = `INSERT IGNORE INTO \`${utils.table('commentmeta')}\` (comment_id, meta_key, meta_value) VALUES ?`;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, values, (error) => {
                if (error) {
                    return reject({
                        error,
                        method: 'insertRatings'
                    });
                }

                const ratingData = {};

                _.each(ratings, value => {
                    if (!ratingData[value]) {
                        ratingData[value] = 0;
                    }

                    ratingData[value] += 1;
                });

                config.data.averageRating = averageRating;
                config.data.ratings = ratingData;

                resolve();
            });
        });
    },
    updateProductAverageRatingAndCount() {
        const { id, list, averageRating } = config.data;
        const count = list.length;
        const query = `
        UPDATE \`${utils.table('wc_product_meta_lookup')}\`
        SET rating_count = ${count}, average_rating = ${averageRating}
        WHERE \`product_id\` = ${id}`;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error) => {
                if (error) {
                    return reject({
                        error,
                        method: 'updateProductAverageRatingAndCount'
                    });
                }

                resolve();
            });
        });
    },
    updatePostMetaRatingData() {
        //a:3:{i:1;i:6;i:3;i:2;i:5;i:1;} --- a: total variety of ratings, i:1 (rating star), i:6 (number of 1 star rating)
        const { id, ratings } = config.data;
        const ratingData = (() => {
            const ratingTypes = _.sortedUniq(Object.keys(ratings));
            let result = `a:${ratingTypes.length}:{`; // a:1:{

            ratingTypes.forEach(type => {
                result += `i:${type};i:${ratings[type]};`; // i:2;i:7; (rating, count)
            });

            result += '}';

            return result;
        })();
        const query = `
        INSERT INTO \`${utils.table('postmeta')}\` (post_id, meta_key, meta_value)
        SELECT * FROM (SELECT ${id}, '_wc_rating_count', '${ratingData}') AS Tmp
        WHERE NOT EXISTS (
            SELECT * FROM \`${utils.table('postmeta')}\` WHERE post_id = ${id} AND meta_key = '_wc_rating_count'
        ) LIMIT 1
        `;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error) => {
                if (error) {
                    return reject({
                        error,
                        method: 'updatePostMetaRatingData'
                    });
                }

                resolve();
            });
        });
    },
    updatePostMetaReviewCount() {
        const { id, list } = config.data;
        const count = list.length;
        const query = `
        UPDATE  \`${utils.table('postmeta')}\`
        SET meta_value = ${count}
        WHERE \`post_id\` = ${id} AND \`meta_key\` = '_wc_review_count'`;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error) => {
                if (error) {
                    return reject({
                        error,
                        method: 'updatePostMetaReviewCount'
                    });
                }

                resolve();
            });
        });
    },
    updatePostMetaAverageRating() {
        const { id, averageRating } = config.data;
        const query = `
        UPDATE \`${utils.table('postmeta')}\`
        SET meta_value = ${averageRating}
        WHERE \`post_id\` = ${id} AND \`meta_key\` = '_wc_average_rating'`;

        return new Promise((resolve, reject) => {
            dbConnection.query(query, (error) => {
                if (error) {
                    return reject({
                        error,
                        method: 'updatePostMetaAverageRating'
                    });
                }

                resolve();
            });
        });
    }
};


// =================================
// EXECUTION
// =================================
validateConfig()
    .then(prepareDataProvider)
    .then(db.connect)
    .then(db.getProductId)
    .then(db.insertComments)
    .then(db.insertRatings)
    .then(db.updatePostReviewsCount)
    .then(db.updateProductAverageRatingAndCount)
    .then(db.updatePostMetaReviewCount)
    .then(db.updatePostMetaAverageRating)
    .then(db.updatePostMetaRatingData)
    .then(db.end)
    .catch(error => {
        console.log('ERROR=====================================');

        if (args.env === 'prod') {
            console.log('*** Your public IP may have change, follow https://www.siteground.com/tutorials/php-mysql/remote/ to update the Remote Access IP');
        }

        console.error(error);
        console.log('/ERROR====================================');
        db.end();
    })
;

