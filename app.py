from flask import Flask, render_template, request, jsonify
import random
import re


app = Flask(__name__)


# ==========================================
# CLEAN KEYWORD
# ==========================================

def clean_keyword(keyword):

    keyword = keyword.lower().strip()

    keyword = re.sub(
        r"[^a-zA-Z0-9]",
        "",
        keyword
    )

    return keyword


# ==========================================
# GENERATE USERNAMES
# ==========================================

def generate_usernames(
    keyword,
    style,
    amount
):

    keyword = clean_keyword(
        keyword
    )


    if not keyword:

        return []


    names = set()


    cool = [
        "{}x",
        "real{}",
        "its{}",
        "hey{}",
        "{}vibes",
        "{}zone",
        "{}world",
        "{}official",
        "{}_x",
        "the{}",
        "{}daily",
        "{}hub"
    ]


    gaming = [
        "{}gaming",
        "{}plays",
        "{}gamer",
        "{}_gg",
        "{}fps",
        "{}pro",
        "x{}x",
        "{}_yt",
        "{}gamingx",
        "real{}gaming",
        "{}clutch",
        "{}legend"
    ]


    aesthetic = [
        "{}vibes",
        "{}aesthetic",
        "{}dreams",
        "{}cloud",
        "{}moon",
        "{}sky",
        "{}waves",
        "{}era",
        "{}core",
        "{}glow",
        "{}archive",
        "{}diary"
    ]


    minimal = [
        "{}x",
        "{}_",
        "{}01",
        "{}07",
        "{}10",
        "{}11",
        "{}21",
        "{}22",
        "{}24",
        "{}99"
    ]


    professional = [
        "{}official",
        "real{}",
        "{}_official",
        "{}studio",
        "{}media",
        "{}digital",
        "{}creative",
        "{}pro",
        "{}team",
        "{}business"
    ]


    dark = [
        "{}dark",
        "{}shadow",
        "{}void",
        "{}night",
        "{}ghost",
        "{}venom",
        "{}black",
        "{}lost",
        "{}silent",
        "{}unknown"
    ]


    football = [
        "{}football",
        "{}_fc",
        "{}plays",
        "{}skills",
        "{}ball",
        "{}goal",
        "{}striker",
        "{}midfield",
        "{}10",
        "{}_10",
        "{}fc",
        "{}academy"
    ]


    styles = {

        "cool": cool,

        "gaming": gaming,

        "aesthetic": aesthetic,

        "minimal": minimal,

        "professional": professional,

        "dark": dark,

        "football": football

    }


    selected_style = styles.get(
        style,
        cool
    )


    # Generate template names

    for template in selected_style:

        names.add(
            template.format(keyword)
        )


    # Add random combinations

    numbers = [
        "01",
        "07",
        "10",
        "11",
        "21",
        "22",
        "24",
        "77",
        "99",
        "123"
    ]


    prefixes = [
        "real",
        "its",
        "the",
        "mr",
        "hey",
        "iam",
        "official"
    ]


    suffixes = [
        "x",
        "xx",
        "yt",
        "tv",
        "pro",
        "hq",
        "hub",
        "zone"
    ]


    while len(names) < amount:

        choice = random.randint(
            1,
            4
        )


        if choice == 1:

            names.add(
                keyword +
                random.choice(numbers)
            )


        elif choice == 2:

            names.add(
                random.choice(prefixes)
                + keyword
            )


        elif choice == 3:

            names.add(
                keyword
                + random.choice(suffixes)
            )


        else:

            names.add(
                keyword
                + random.choice(numbers)
                + random.choice(suffixes)
            )


    # Make sure amount is respected

    result = list(names)

    random.shuffle(result)


    return result[:amount]


# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# ==========================================
# GENERATE API
# ==========================================

@app.route(
    "/generate",
    methods=["POST"]
)
def generate():

    data = request.get_json()


    keyword = data.get(
        "keyword",
        ""
    )


    style = data.get(
        "style",
        "cool"
    )


    amount = data.get(
        "amount",
        10
    )


    try:

        amount = int(amount)

    except:

        amount = 10


    # Security limit

    amount = max(
        1,
        min(amount, 20)
    )


    usernames = generate_usernames(
        keyword,
        style,
        amount
    )


    return jsonify({

        "usernames":
            usernames

    })


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )