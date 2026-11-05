import json
from pathlib import Path
from flask import Flask, jsonify, redirect, send_from_directory

BASE = Path(__file__).parent
app = Flask(__name__)


@app.route("/")
def home():
    return "Kiosk server is running!"


# Shortcut: /kiosk -> the kiosk page
@app.route("/kiosk")
def kiosk():
    return redirect("/web/kiosk/kiosk.html")


# Serve everything in web/ (html, css, js) at /web/...
@app.route("/web/<path:filename>")
def web_files(filename):
    return send_from_directory(BASE / "web", filename)


# Serve everything in res/ (images, icons) at /res/...
@app.route("/res/<path:filename>")
def res_files(filename):
    return send_from_directory(BASE / "res", filename)


# Menu data for the kiosk (read fresh each time, so edits show on refresh)
@app.route("/api/menu")
def menu():
    with open(BASE / "data" / "menu.json", encoding="utf-8") as f:
        return jsonify(json.load(f))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
