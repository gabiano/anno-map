import string
from google.appengine.ext import db

class Project(db.Model):
	name = db.StringProperty(required=True)
	user_name = db.StringProperty(required=True)
	poem = db.TextProperty(required=True)
	comments = db.StringProperty()


	@classmethod
	def by_name(cls, name):
		project = Project.all().filter('name =', name).get()
		return project

	def save_comments(self, comments):
		self.comments = comments

