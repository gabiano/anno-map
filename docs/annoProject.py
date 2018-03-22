# coding=utf-8

import userHandler
from models import project
import json, string
from google.appengine.api import memcache


# Handler wird aufgerufen, nachdem ein Gedicht aus den Suchergebnissen ausgesucht wurde,
# und die Projektseite geladen werden soll.
# Aufgaben:
# 1. Laden aller Gedichte aus dem memcache
# 2. Speichern des Gedichts im memcache.

class AnnoProject(userHandler.UserHandler):
	def get(self):
		self.redirect('/login')

	def post(self):
		# check security
		username = self.get_username_by_cookie()
		if not username:
			self.redirect("/login")

		project_name = self.request.get("project_name")
		key_name = username+"|"+project_name


		# check whether project already exists
		pro = project.Project.get_by_key_name(key_name)
		if not pro:
			# self.response.headers.add_header('Set-Cookie', 'poem_name=%s; Path=/' % (project_name))
			self.response.set_cookie('project_name', str(project_name), path='/')

			# find out number of poem
			poemNrS = self.request.get("poemNr")
			if not poemNrS.isdigit():
				self.redirect('/login')
			poemNr = int(poemNrS)
			# load poems from memcache; get chosen poem
			key = self.request.cookies.get("poems_key")
			searchResults = memcache.get(key)
			poem = searchResults[poemNr]
			#convert to string
			poemStr = json.dumps(poem)



			# create project
			pro = project.Project(key_name=key_name, name=project_name, user_name=username, poem=poemStr)
			pro.put()
			self.render("annoPro.html", project_name=project_name, username=username, poem=poem, poemStr=poemStr)

		else:
			poemStr = pro.poem
			poem = json.loads(poemStr)
			comments = pro.comments
			if comments:
				self.render("annoPro.html", project_name=project_name, username=username, poem=poem, poemStr=poemStr, comments=comments)
			else:
				self.render("annoPro.html", project_name=project_name, username=username, poem=poem, poemStr=poemStr)
		

		"""
		OLD!

		# create poem-key out of author and title
		# store poem in memcache, access by poem-key
		# store poem-key as Cookie
		author = poem['author']
		title = poem['title']
		poem_key = str(author+'|'+title)
		memcache.set(poem_key, poem)
		self.response.headers.add_header(
			'Set-Cookie',
			'poem_key=%s; Path=/' % (poem_key))

		# finally: show some html
		self.render("annoPro.html", project_name=project_name, username=username, poem=poem)

		"""
		"""
		self.response.headers.add_header(
			'Set-Cookie',
			'project_name=%s; Path=/' % (str(project_name)))
		"""