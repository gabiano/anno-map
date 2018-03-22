import urllib2, json
import userHandler
from models import user, project
from google.appengine.api import memcache



class MainPage(userHandler.UserHandler):
	def get(self):
		# check whether user is logged in
		username = self.get_username_by_cookie()
		if not username:
			self.redirect("/login")
		# search for existing projects of the user in datastore
		# if projects exist:	store them in memcache (key is user_id)
		#						render mainPage-ex
		# else:					render mainPage								
		projects = project.Project.all().filter('user_name =', username)
		projectsLength = projects.count()
		if projectsLength > 0:
			memcache.set(username, projects)
			self.render("mainPage_existingProjects.html", username=username, projects=projects, projectsLength=projectsLength)
		else:
			self.render("mainPage.html", username=username)
		
