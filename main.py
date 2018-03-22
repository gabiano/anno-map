# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


#import section
import webapp2
from docs import login, signup, searchResults, loadProject, annoProject, mainPage, logout, saveProject


#URL-mapping section
app = webapp2.WSGIApplication([
	webapp2.Route('/login', handler=login.Login),
	webapp2.Route('/signup', handler=signup.Signup),
	webapp2.Route('/s', handler=searchResults.SearchResults),
	webapp2.Route('/a', handler=annoProject.AnnoProject),
	webapp2.Route('/', handler=mainPage.MainPage),
	webapp2.Route('/l', handler=loadProject.LoadProject),
	webapp2.Route('/logout', handler=logout.Logout),
	webapp2.Route('/saveProject', handler=saveProject.SaveProject)], debug=True)