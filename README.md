# webScraper - All the News That's Fit to Scrape



### Overview

webScraper is a web app that lets users view and leave comments on the latest news. Using Mongoose and Cheerio to scrape news from another site.

Whenever a user visits the site, the app scrapes stories from a news outlet from reddit and display it for the user. Each scraped article is saved to the application database. The app scrapes the following:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Feel free to add more content to your database (photos, bylines, and so on).

Users are also be able to leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles.


### Dependencies Used

3. express

4. express-handlebars

5. mongoose

6. body-parser

7. cheerio

8. request


    * `heroku addons:create mongolab` This command will add the frees mLab provision to the project.

    * `The URI string that connects Mongoose to mLab.* `heroku config | grep MONGODB_URI`


### Helpful Links

* [MongoDB Documentation](https://docs.mongodb.com/manual/)
* [Mongoose Documentation](http://mongoosejs.com/docs/api.html)
* [Cheerio Documentation](https://github.com/cheeriojs/cheerio)


- - -

### Hosting on Heroku


https://frozen-dawn-34007.herokuapp.com/

- - -
