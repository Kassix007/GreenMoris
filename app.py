from flask import Flask, render_template, jsonify, request, send_from_directory
import requests
from bs4 import BeautifulSoup
import logging

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/offline.html')
def offline():
    return send_from_directory('static', 'offline.html')

@app.route('/sw.js')
def service_worker():
    return send_from_directory('static', 'sw.js')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/shorline')
def shorline():
    return render_template('shorline.html')

@app.route('/eco')
def ecofriendly():
    return render_template('eco.html')

@app.route('/greenmobility')
def greenmobility():
    return render_template('greenmobility.html')

@app.route('/greenmob')
def greenmob():
    return render_template('greenmob.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/trashsortinggame')
def trashsortinggame():
    return render_template('shoreline/trashsortinggame/index.html')

@app.route('/hangman')
def hangman():
    return render_template('hangman.html')

@app.route('/oceanform')
def oceanform():
    return render_template('oceanform.html')

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/addproduct')
def addproduct():
    return render_template('addProduct.html')

@app.route('/addevent')
def addevent():
    return render_template('addevents.html')

@app.route('/getlocation')
def addgetlocation():
    return render_template('getlocations.html')
@app.route('/greenform')
def greenform():
    return render_template('greenform.html')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')


@app.route('/sw.js')
def serve_sw():
    return send_file('sw.js', mimetype='application/javascript')


logging.basicConfig(level=logging.DEBUG)

def get_article_content(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            article_soup = BeautifulSoup(response.content, 'html.parser')
            first_article = article_soup.find('article', class_='news is-promoted full news-full clearfix')
            if first_article:
                div_content = first_article.find('div', class_='field field--name-body field--type-text-with-summary field--label-hidden field--item')
                if div_content:
                    paragraphs = div_content.find_all('p')
                    for paragraph in paragraphs:
                        if len(paragraph.text) > 20:
                            print(paragraph.text)
                            return paragraph.text
                    return "No <p> tag with more than 20 characters found."
                else:
                    return "No target <div> found."
            else:
                return "No article found."
        else:
            return "Content could not be retrieved."
    except Exception as e:
        return f"Content could not be retrieved: {str(e)}"


def fetch_articles():
    url = "https://defimedia.info/recherche-articles?combine=climate"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            articles = soup.find_all('article')
            news_data = []
            for article in articles:
                headline = article.find('h2').text
                link = article.find('a')['href']
                full_link = "https://defimedia.info" + link
                news_data.append({'headline': headline, 'link': full_link})
            return news_data
        else:
            logging.error(f"Failed to retrieve articles: Status code {response.status_code}")
            return []
    except Exception as e:
        logging.error(f"Exception occurred while fetching articles: {str(e)}")
        return []

@app.route('/news')
def news():
    return render_template('webscraping/news.html')

@app.route('/load_articles', methods=['GET'])
def load_articles():
    page = request.args.get('page', 1, type=int)
    news_data = fetch_articles()
    return jsonify(news_data)


if __name__ == '__main__':
    app.run(debug=True)
