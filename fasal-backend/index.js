import cors from 'cors'
import bodyParser from 'body-parser'
import axios from 'axios'
import express from 'express'

const app = express();
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' , extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb' , extended: true }));

import sqlite3 from 'sqlite3'
import md5 from 'md5'
import jwt from 'jsonwebtoken'
import { query, response } from 'express'

const token_secret = '96d45a6cf603a83caac06f4f127a6e7b078f38457b163bd20bab47e85a7d49b75763af3857d6cd88f7f2b1836c1a577a9561a12f24f238726f22ed7fc8d8aa64';

const DBSOURCE = "webapp_db.sqlite3";



function generateAccessToken(id) {
    return jwt.sign({ id: id }, token_secret, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, token_secret, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}



let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')

    }
});




app.post("/sign-up", (req, res, next) => {


    /*
        {name, email, password, age}
    */
    console.log(req.query);
    const { name, email, password, age } = req.query;
    if (name == undefined || email == undefined || password == undefined || age == undefined) {
        res.json({
            "message": "All fields not filled",
            "status_code": "400",
        });
        return;
    }
    db.all("select * from user where email = ? ", [email], (err, rows) => {
        if (rows.length > 0) {
            return(res.json({
                status: 459,
                message: "User already exists, try logging in"
            }))
        }
        else {
            var insert = "INSERT INTO USER (name, email, password, age) values (?,?,?,?)";
            db.run(insert, [name, email, password, age]); //Check for errors later
            return(res.json(
                {
                    status: 200,
                    message: "User account created successfully"
                }
            ))
        }
    })



});





app.post("/sign-in", (req, resp, next) => {
    console.log(req.query)

    const { email, password } = req.query;
    if (email == undefined || password == undefined) {
        resp.json({
            error: 400,
            message: "Fill all the params"
        })
        return;
    }
    var query = "select * from user where email = ? ";
    db.all(query, [email], (err, rows) => {
        console.log("sss");
        console.log(rows);
        if (rows.length < 1) {
            resp.json(
                {
                    status: 400,
                    message: "User does not exist"
                }
            )
        }
        else {
            const user = rows[0];
            if (user.password == password) {
                //Generate auth token and login
                var token = generateAccessToken(user.user_id);
                resp.json({
                    status: 200,
                    message: "Successfully logged in ",
                    auth_token: token
                });

            }
            else {
                resp.json({
                    status: 500,
                    message: "Wrong password"
                });
            }
        }
    })
})





app.get("/", (req, res, next) => {
    console.log(req.query);
    res.json({ "message": "Ok" })

});

app.post("/addList", (req, res, next) => {
    //check if the named list previously exists
    //const user_id = 1;
    const { user_id, list_name, privacy } = req.query;
    const auth = req['authorization'];
    db.all("select count(*) as cnt from user_lists where list_name = ? and user_id = ? ", [list_name, user_id], (err, rows) => {
        const count = rows[0].cnt;
        if (count > 0) {
            res.json({
                status: "506",
                message: "List with the name exists already"
            })
        }
        else {
            db.run("insert into user_lists (list_name, user_id, privacy) values (?, ? , ?)", [list_name, user_id, privacy], (err, rows) => {
                console.log(err, rows);
                res.json({
                    status: 200,
                    message: "Inserted into the list successfully"
                })
            })
        }
    })

});


app.post("/addMovieToList", (req, res, next) => {

    const { movie_imdb_id, list_id } = req.query;
    axios.get("http://www.omdbapi.com/?apikey=9882f1fd&i=" + movie_imdb_id).then((response) => {
        const data = response.data;
        console.log(response.data);
        const movie_name = data.Title;
        const movie_genre = data.Genre;
        const movie_actors = data.Actors;
        const movie_directors = data.Director;
        const movie_plot = data.Plot;
        const movie_ratings = data.imdbRating;
        const movie_poster = data.Poster;
        var insert_movie = "insert into movies(movie_imdb_id, movie_name, movie_genre, movie_actors, movie_directors, movie_plot, movie_ratings, movie_poster) values (?,?,?,?,?,?,?,?)";
        db.run(insert_movie, [movie_imdb_id, movie_name, movie_genre, movie_actors, movie_directors, movie_plot, movie_ratings, movie_poster], (err, rows) => {
            console.log(err);
        });

        //const { movie_imdb_id, list_id} = req.query;

        var sql = "insert into list_movies(list_id, movie_imdb_id) values ( ?, ? )";
        db.run(sql, [list_id, movie_imdb_id], (err, rows) => {
            res.json({
                status: 200,
                message: "added movie to the list"
            });
        });
        console.log(movie_imdb_id, list_id)
    });
});

app.get("/getAllUserLists", async (req, res, next) => {
    const { user_id } = req.query;
    //The current user is the one requesting the list //Check once later
    const result = [];
    var ab = [];

    var sql = "select * from user_lists left join list_movies on user_lists.list_id = list_movies.list_id left join movies on list_movies.movie_imdb_id = movies.movie_imdb_id where user_id = ? order by list_id"

    db.all(sql, [user_id], (err, rows) => {
        var prev_list_id = -1;

        rows.forEach((value, index, arr) => {
            if (prev_list_id != value.list_id) {
                prev_list_id = value.list_id;
                //create new group after inserting the previous group
                if (ab.length > 0) {
                    result.push(ab);
                }
                ab = [];
            }
            ab.push(value);
        });
        result.push(ab);
        console.log(result);
        return res.json({ "message": "Ok", result: result })
    });
});

app.get("/getListById", (req, res, next) => {

    //Check if either public or auth token for the requested user
    const { user_id , list_id } = req.query;
    var sql = "select privacy from user_lists where list_id = ?";
    db.all(sql, [list_id], (err, rows) => {
        if (rows.length > 0) {
            const row = rows[0];
            if (row.privacy == 1) {

                sql1 = "select * from list_movies inner join movies on movies.movie_imdb_id = list_movies.movie_imdb_id where list_movies.list_id = ?"
                db.all(sql1, [list_id], (err, rows) => {
                    res.json({
                        list_movies: rows
                    })
                });
            }
            else {
                res.json({
                    status: 420,
                    message: "list is private"
                })
            }
        }
    })

})


//Later
app.post("/removeMovieFromList", (req, res, next) => {

});






const PORT = 8000;
app.listen(PORT, () => {
    console.log("App started on " + PORT);
});