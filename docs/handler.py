import webapp2, jinja2, os

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape = True)


class Handler(webapp2.RequestHandler):
	# supplies functions for creating the View, i.e. for writing output in HTML, using Jinja2 templates
	def write(self, *args, **kwargs):
		self.response.write(*args, **kwargs)

	def render_str(self, template, **params):
		t = jinja_env.get_template(template)
		return t.render(params)

	def render(self, template, **params):
		self.write(self.render_str(template, **params))