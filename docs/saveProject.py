import userHandler
import json
from models import project, user
from google.appengine.api import memcache


class SaveProject(userHandler.UserHandler):
	def get(self):
		self.redirect('/')
		
	# speichert das Projekt, an dem der User gerade arbeitet
	def post (self):
		# get the project
		username = self.get_username_by_cookie()
		project_name = self.request.cookies.get("project_name")
		key_name = username+"|"+project_name
		pro = project.Project.get_by_key_name(key_name)

		# get comments
		comments = self.request.get("comments")

		# save project
		pro.save_comments(comments)
		pro.put()



		"""
		user_id = self.request.cookies.get("user_id")
		u = user.User.by_id(int(user_id))
		user_name = u.name
		poem_key = self.request.cookies.get("poem_key")
		# poem = memcache.get(poem_key)
		# poemStr = json.dumps(poem)


		# store project in datastore
		# pro = project.Project.get_or_insert(key_name=name, name=name, user_name=user_name, comments=comments)
		"""

		




"""
		pro = self.get_project_by_name_and_user(name, user_name)
		if pro:
			pro.put(comments=comments)
			self.write("pro already existed")
		else:
			pro = project.Project.create(name, user_name, poemStr, comments)
			pro.put()
			self.write("pro was created")

"""
"""
		# pro = project.Project.all().filter('name=',name).filter('user_name=', user_name).get()
		# pro = project.Project.byNameAndUser(name, user_name)
		projects = project.Project.byNameAndUser(name, user_name)
		if projects:
			for pro in projects:
				pro.put(comments=comments)
			self.write("pro already existed")
		else:
			pro = project.Project.create(name, user_name, poemStr, comments)
			pro.put()
			self.write("pro was created")
"""
"""
		# update only comments if project already exists
		if pro:
			pro.put(comments=comments)
			self.write("pro already existed")
		else:
			pro = project.Project.create(name, user_name, poemStr, comments)
			pro.put()
			self.write("pro was created")
"""