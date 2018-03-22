import userHandler
from models import user
import re

#reg ex for username, password
USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
PASSWORD_RE = re.compile(r"^.{3,20}$")


#login and signup function
def validUsername(user):
    return USER_RE.match(user)

def validPassword(password):
    return PASSWORD_RE.match(password)



class Signup(userHandler.UserHandler):
	def get(self):
		self.logout()
		self.render("signup.html")

	def post(self):
		#controlling flag: set false if signup fails
		welcome = True
		usernameErr = ""
		passwordErr = ""
		emailErr = ""


		#post-params
		username = self.request.get("username")
		password = self.request.get("password")
		verify = self.request.get("verify")
		email = self.request.get("email")

		#check validity of username and password
		if not validUsername(username):
			usernameErr = "That's not a valid username."
			welcome = False
		if not validPassword(password):
			passwordErr = "That's not a valid password"
			password = ""
			verify = ""
			welcome = False
		elif password != verify:
			passwordErr = "Passwords don't match."
			password = ""
			verify = ""
			welcome = False

		#check whether signup failed
		if welcome == False:
			if email:
				self.render("signup.html", username=username, password= "", verify= "", email= email, usernameErr= usernameErr, passwordErr= passwordErr, emailErr= emailErr)
			else:
				self.render("signup.html", username=username, password= "", verify= "", usernameErr= usernameErr, passwordErr= passwordErr, emailErr= emailErr)
		else:
			#check whether user already exists
			u = user.User.by_name(username)
			#if user exists: stop signup
			if u:
				usernameErr= "Username already exists."
				self.render("signup.html", usernameErr= usernameErr)
			#create new user
			else:
				u = user.User.register(username, password, email)
				#add user to database User
				u.put()
				#login user
				self.login(u)
				#redirect to main page
				self.redirect('/')
