Beaufort Wind Scale Plugin for [jQuery](http://jquery.com/)
================================

What This Plugin Does
---------------------------------------
The beaufort wind scale plugin converts a HTML select drop down into a [jQuery UI](http://jqueryui.com/) style slider. As the user interacts with the slider (i.e. changes it) the value is show next to the slider and a popup overlayed showing the Beaufort wind value, description and image of the predicted sea state for that Beaufort wind force.

How To Use
---------------------------------------
Just create a HTML select box with a range of wind speeds.

	`<select name="windSpeed">
		<option value="1">1mph</option>
		<option value="2">2mph</option>
		...
		<option value="70">70mph</option>
		<option value="71">71mph</option>
	</select>`
	
Then include jQuery and `jquery.beaufortwind.js` plugin file (don't forget the css `jquery.beaufortwind.css`) and add the plugin.

	`$(function() {
		$("select[name='windSpeed']").beaufortwind();
	});`
	
Where Did We Get The Information From?
---------------------------------------
All the information about the Beaufort scale was from [Wikipedia](http://en.wikipedia.org/wiki/Beaufort_scale)

Supports
---------------------------------------
Currentely only tested in Firefox 3.0+