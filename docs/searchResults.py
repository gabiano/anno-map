import urllib2, json, string
import userHandler
from models import user, project
from google.appengine.api import memcache


class SearchResults(userHandler.UserHandler):
	def get(self):
		self.redirect('/login')

	def post(self):
		# check security
		username = self.get_username_by_cookie()
		if not username:
			self.redirect('login')


		# get author or title that shall be searched for
		author = self.request.get('author')
		title = self.request.get('title')
		# get poems from poemdb
		searchResults = searchPoems(author=author, title=title)
		# if search successful: store searchResults in memcache,
		#						store key for searchResults as a Cookie,
		#						render searchResults.html
		# else render mainPage again
		if searchResults:
			key = str('%s|%s' % (author, title))
			memcache.set(key, searchResults)
			self.response.headers.add_header('Set-Cookie', 'poems_key='+key)
			resultsLength = len(searchResults)
			self.render("search_results.html", username=username, searchResults=searchResults, resultsLength=resultsLength)
		
		else:
			searchErr = "Sorry, no poems found."
			self.render("mainPage.html", searchErr=searchErr)



def searchPoems(author=None, title=None):
	searchResults = []
	author = author.replace(" ", "+")
	title = title.replace(" ", "+")
	poetrydbURL = buildSearchURL(author=author, title=title)
	poetryDataRaw = urllib2.urlopen(poetrydbURL)
	poems = json.load(poetryDataRaw)
	try:
		for p in poems:
			searchResults.append({"lines": p['lines'], "author": p['author'], "title": p['title']})
			#searchResults.append({"author": p['author'], "title": p['title']})
	except:
		pass
	return searchResults

# creates a URL which can be used to search for poems
def buildSearchURL(author=None, title=None):
	poetrydbURL =  "http://poetrydb.org/"
	if author and not title:
		poetrydbURL += "author/"+author+"/author,title,lines"
	elif not author and title:
		poetrydbURL += "title/"+title+"/author,title,lines"
	else:
		poetrydbURL += "title,author/"+title+";"+author+"/author,title,lines"
	return poetrydbURL
