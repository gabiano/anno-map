import string, json
import userHandler
from models import project
from google.appengine.api import memcache

class LoadProject(userHandler.UserHandler):
	def get(self):
		self.redirect('/login')

	def post(self):
		username = self.get_username_by_cookie()
		if not username:
			self.redirect('login')

		# get project:	projects from memcache
		# 				index as request param
		projects = memcache.get(username)
		proNr = int(self.request.get("ex-pro"))
		pro = projects[proNr]

		project_name = pro.name
		poemStr = pro.poem
		poem = json.loads(poemStr)

		# comments = poem['comments']
		comments = pro.comments

		self.response.set_cookie('project_name', project_name, path='/')

		self.render("annoPro.html", username=username, project_name=project_name, poem=poem, poemStr=poemStr, comments=comments)