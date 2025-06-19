from flask import Flask, render_template, request, redirect, url_for
from models import db, User, FavouriteCity
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
from dotenv import load_dotenv
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
load_dotenv()
app.secret_key = os.getenv("SECRET_KEY")

db.init_app(app)


@app.route("/")
def home():
    username = session.get("username")
    return render_template("index.html", username=username)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        hashed_pw = generate_password_hash(password)

        user = User.query.filter_by(username=username).first()
        if user:
            return render_template("register.html", error="User already exists")

        new_user = User(username=username, password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()
        session["username"] = new_user.username
        return redirect(url_for("add_favourites"))
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return render_template("login.html", error="Wrong username or password")
        session["username"] = user.username
        return redirect(url_for("home"))
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("home"))


@app.route("/add_favourites", methods=["GET", "POST"])
def add_favourites():
    if "username" not in session:
        return redirect(url_for("login"))

    user = User.query.filter_by(username=session["username"]).first()

    if request.method == "POST":
        city = request.form.get("city")
        if city and user:
            city = city.strip().title()
            existing = FavouriteCity.query.filter_by(user_id=user.id, city_name=city).first()
            if not existing:
                favourite = FavouriteCity(city_name=city, user_id=user.id)
                db.session.add(favourite)
                db.session.commit()
        return redirect(url_for("add_favourites"))

    favourites = FavouriteCity.query.filter_by(user_id=user.id).all()
    return render_template("add_favourites.html", favourites=favourites)


@app.route("/remove_favourite", methods=["POST"])
def remove_favourite():
    if "username" not in session:
        return redirect(url_for("login"))

    city_id = request.form.get("city_id")
    city = FavouriteCity.query.get(city_id)
    if city:
        db.session.delete(city)
        db.session.commit()

    return redirect(url_for("add_favourites"))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
