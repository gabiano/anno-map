import userHandler

class Logout(userHandler.UserHandler):
	def get(self):
		self.redirect('/login')
