from flask import Flask, render_template

DEVELOPMENT_ENV = True
app = Flask(__name__)

app_data = {
    "name": "Starter Template",
    "description": "A basic Flask app using bootstrap for layout",
    "author": "Jon",
    "html_title": "Jon template",
    "project_name": "Starter Template",
    "keywords": "flask, webapp, template, basic",
}


@app.route("/")
def index():
    return render_template("index.html", app_data=app_data)



if __name__ == "__main__":
    app.run(debug=DEVELOPMENT_ENV)