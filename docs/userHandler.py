import webapp2, hmac
import handler
from models import user, project



class UserHandler(handler.Handler):

	def initialize(self, *a, **kw):
		webapp2.RequestHandler.initialize(self, *a, **kw)
		uid = self.read_secure_cookie('secure_val')
		self.user = uid and user.User.by_id(int(uid))


	def login(self, user):
		user_id = str(user.key().id())
		self.set_secure_cookie('secure_val', user_id)
		self.response.headers.add_header(
			'Set-Cookie',
			'user_id=%s; Path=/' % (user_id))


	# löscht alle Cookies und loggt User damit aus 
	def logout(self):
		self.response.headers.add_header('Set-Cookie', 'user_id=; Path=/')
		self.response.headers.add_header('Set-Cookie', 'key=; Path=/')
		self.response.headers.add_header('Set-Cookie', 'secure_val=; Path=/')
		self.response.headers.add_header('Set-Cookie', 'poem_key=; Path=/')
		self.response.headers.add_header('Set-Cookie', 'project_name=; Path=/')
		self.response.headers.add_header('Set-Cookie', 'poems_key=; Path=/')


	#platziert Sicherheits-Cookie im Header
	def set_secure_cookie(self, name, val):

		cookie_val = make_secure_val(val)
		self.response.headers.add_header(
			'Set-Cookie',
			'%s=%s; Path=/' % (name, cookie_val))


	def read_secure_cookie(self, name):
		cookie_val = self.request.cookies.get(name)
		return cookie_val and check_secure_val(cookie_val)


	def get_username_by_cookie(self):
		secure_val = self.request.cookies.get("secure_val")

		if secure_val:
			user_id = check_secure_val(secure_val)
			if user_id:
				u = user.User.by_id(int(user_id))
				if u:
					return u.name


	def get_user_by_cookie(self):
		secure_val = self.request.cookies.get("secure_val")

		if secure_val:
			user_id = check_secure_val(secure_val)
			if user_id:
				u = user.User.by_id(int(user_id))
				return u


	def get_projects_by_user_name(cls, user_name):
		projects = project.Project.all().filter('user_name =', user_name).run(batch_size=1000)
		return projects

	def get_project_by_name_and_user(cls, name, user_name):
		pro = project.Project.all().filter('name=',name).filter('user_name =', user_name).get()
		return pro



# creates a secure_val, by hmac-ing our static SECRET-string plus the individual val
def make_secure_val(val):
	#secret string, used for hashing pws.
	SECRET = "Rd6RPe3uPqsOULS"
	return '%s|%s' % (val, hmac.new(SECRET, val).hexdigest())

# checks whether secure_val, stored in a Cookie, is real.
def check_secure_val(secure_val):
	# returns name of secured val, otherwise None
	val = secure_val.split('|')[0]
	if secure_val == make_secure_val(val):
		return val

