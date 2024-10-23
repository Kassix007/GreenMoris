import requests
from bs4 import BeautifulSoup

url = "https://defimedia.info/recherche-articles?combine=climate"

response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    articles = soup.find_all('article')

    for article in articles:
        headline = article.find('h2').text
        print(headline)
else:
    print(f"Failed to retrieve the website. Status code: {response.status_code}")
