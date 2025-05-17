from flask import Flask, render_template, request, redirect, url_for, session
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
load_dotenv()
app.secret_key = os.getenv("SECRET_KEY")
db.init_app(app)

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
        return redirect(url_for("login"))
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
@app.route("/")
def home():
    username = session.get("username")
    return render_template("index.html", username=username)
@app.route("/logout")
def logout():
    session.pop("username", None)
    return redirect(url_for("home"))
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)