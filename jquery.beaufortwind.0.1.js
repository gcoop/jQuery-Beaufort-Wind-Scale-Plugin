(function ($) {
	$.fn.beaufortWind = function (opts) {
	
		var defaults = {
			'speed':		500
		}, o = $.extend(defaults, opts); // Override defaults with passed opts object.
		
		this.each(function () {
			$super = $(this).after('<div class="slider-bar"><a href="#"></a><span class="val"></span><div class="exp" style="display: none;"></div></div>')
							.hide();
							
			var $$ 	= $(this).parent().find('.slider-bar'); // Main slide ui.
			var p 	= null, // Container position.
				$a 	= $$.find('a'), // Is the slider thingy.
				$v	= $$.find('.val'), // Label for value, follows the slider thingy.
				$e	= $$.find('.exp'), // Example context.
				cW	= parseInt($$.css('width').replace('px', '')), // Container bar width.
				cH	= parseInt($$.css('height').replace('px', '')), // Container bar height.
				nO	= $super.find('option').length;
			var aW	= parseInt($a.css('width').replace('px', '')), // <a> width.
				eW	= parseInt($e.css('width').replace('px', '')), // Example context width.
				inc	= cW / nO,
				exp = '<h3><span class="bc${i} bc">Force ${i}</span> ${min} - ${max} mph - ${tag}</h3><p>${desc}</p>', // Explination HTML - Should really use jQuery Template Engine but we'll do a quick hack instead of the extra dep.
				curr = null;

			/**
			 * Beaufort Scale Wind Data.
			 * Ripped from Wikipedia for the time being.
			 *
			 * {@see http://en.wikipedia.org/wiki/Beaufort_scale}
			 */
			var beaufortScale = [
				{
					min:	0,
					max:	1,
					tag:	'Calm',
					desc:	'Flat.'
				},
				{
					min:	1,
					max:	3,
					tag:	'Light air',
					desc:	'Ripples without crests.'
				},
				{
					min:	4,
					max:	7,
					tag:	'Light breeze',
					desc:	'Small wavelets. Crests of glassy appearance, not breaking.'
				},
				{
					min:	8,
					max:	12,
					tag:	'Gentle breeze',
					desc:	'Large wavelets. Crests begin to break; scattered whitecaps.'
				},
				{
					min:	13,
					max:	17,
					tag:	'Moderate breeze',
					desc:	'Small waves with breaking crests. Fairly frequent white horses.'
				},
				{
					min:	18,
					max:	24,
					tag:	'Fresh breeze',
					desc:	'Moderate waves of some length. Many white horses. Small amounts of spray.'
				},
				{
					min:	25,
					max:	30,
					tag:	'Strong breeze',
					desc:	'Long waves begin to form. White foam crests are very frequent. Some airborne spray is present.'
				},
				{
					min:	31,
					max:	38,
					tag:	'Moderate gale',
					desc:	'Sea heaps up. Some foam from breaking waves is blown into streaks along wind direction. Moderate amounts of airborne spray.'
				},
				{
					min:	39,
					max:	46,
					tag:	'Gale',
					desc:	'Moderately high waves with breaking crests forming spindrift. Well-marked streaks of foam are blown along wind direction. Considerable airborne spray.'
				},
				{
					min:	47,
					max:	54,
					tag:	'Strong gale',
					desc:	'High waves whose crests sometimes roll over. Dense foam is blown along wind direction. Large amounts of airborne spray may begin to reduce visibility.'
				},
				{
					min:	55,
					max:	63,
					tag:	'Storm',
					desc:	'Very high waves with overhanging crests. Large patches of foam from wave crests give the sea a white appearance. Considerable tumbling of waves with heavy impact. Large amounts of airborne spray reduce visibility.'
				},
				{
					min:	64,
					max:	72,
					tag:	'Violent storm',
					desc:	'Exceptionally high waves. Very large patches of foam, driven before the wind, cover much of the sea surface. Very large amounts of airborne spray severely reduce visibility.'
				},
				{
					min:	73,
					max:	200,
					tag:	'Hurricane-force',
					desc:	'Huge waves. Sea is completely white with foam and spray. Air is filled with driving spray, greatly reducing visibility.'
				}
			];
			
			var reposition = function (e) {
				if (p == null) p = $$.offset();
				var l = e.pageX - p.left; // Calc new position.

				if (l < 0) l = 0; // Check not too far left.
				if (l > (cW - aW)) l = (cW - aW); // Check not too far right.
	
				var val = Math.round(l / inc);
				
				// Set val.
				$super.val(val);
				$v.html($super.find('option:selected').html());				
				
				switchExample(val);

				$a.css('left', l);
				$v.css('left', (l + aW + 5));
				$e.css('left', (l - (eW / 2)));
			}
			
			function startVal(v) {
				$v.html($super.find('option:selected').html());	
				var px = v * inc;
				
				$a.css('left', px);
				$v.css('left', (px + aW + 5));
				$e.css('left', (px - (eW / 2)));
				
				switchExample(v);
			}
			
			function switchExample(v) {
				for (var i = 0; i <= 12; i++) {
					if (v <= beaufortScale[i].max && v >= beaufortScale[i].min) {
						var obj = beaufortScale[i];
						obj.i = i;
						break;
					}
				}

				if (typeof curr != null & obj.i != curr) {
					if (typeof obj == 'object') {			
						var t = exp; // Don't overwrite the template!
						for (var k in obj) {
							t = t.split('${'+k+'}').join(obj[k]);
						}
						$e.html(t);
						$e.css("top", '-'+($e.outerHeight() + cH)+'px');
						
						var img = new Image();
						
						$(img).load(function () {
							if ($e.find('img').length <= 0) // Only write if not there, double up bug (caused by lazy load).
								$e.find('h3').after(this);
								
							$e.css("top", '-'+($e.outerHeight() + cH)+'px');	
						}).attr('title', 'Example sea state at force '+obj.i)
						  .attr('alt',	'Example sea state at force '+obj.i)
						  .attr('src', 'images/b'+obj.i+'.jpg');
						
						curr = obj.i;
					}
				}
			}
			
			startVal($super.val());
			
			$a.bind('mouseover', function (e) {
				$(this).toggleClass('ui-state-highlight');
			}).bind('mouseout', function (e) {
				$(this).toggleClass('ui-state-highlight');
				e.preventDefault();
			}).bind('mousedown', function(e) {
				$(this).toggleClass('ui-state-active');
				$e.fadeIn();
				$(document).bind('mousemove', reposition);
				e.preventDefault();
			});
			
			$('body').bind('mouseup', function(e) { // mouseup event might not be the a tag thus catch all on body ;)
				$a.toggleClass('ui-state-active');
				setTimeout(function () {
					$e.fadeOut();
				}, 500);
				$(document).unbind('mousemove', reposition);
				e.preventDefault();
			});
		}); // End each.
	}
})(jQuery);