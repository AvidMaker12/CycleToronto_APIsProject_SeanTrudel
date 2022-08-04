# CycleToronto_APIsProject_SeanTrudel

"Cycle Toronto" activity web app using City of Toronto's bicycle-related APIs. Purpose: Provide outdoor activity ideas for people who feel the need to get out and cycle. Description: The cyclist can use this app to plan their nest trip by being informed on Toronto's upcoming public holidays, where to park their bikes, and suggested city bikeways.

Modules have been added as dependencies so you just need to do **npm i**.

APIs Documentation:

- Leaflet Map API: https://leafletjs.com/
- Bicycle Parking Racks API, from Open Toronto: https://open.toronto.ca/dataset/bicycle-parking-racks/

IMPORTANT (development notice):

- Leaflet Map API markers use Latitude-Longitude to display, whereas the City of Toronto's Bicycle Parking Racks API stores their data as Longitude-Latitude (opposite) within the 'geometry' array. To make the map API work, the Bicycle Rack coordinates retreival has been adjusted (see index.pug script for details).
