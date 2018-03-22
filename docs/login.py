import userHandler
from models import user

class Login(userHandler.UserHandler):
	def get(self):
		self.logout()
		self.render("login.html")

	def post(self):
		# post-params
		username = self.request.get('username')
		password = self.request.get('password')

		# 
		u = user.User.login(username, password)
		if u:
			self.login(u)
			self.redirect('/')
		else:
			passwordErr = True
			self.render('login.html', passwordErr= passwordErr)