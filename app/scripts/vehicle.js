/*
 * Draw buses on map
 */

var vehicle = {
	className: 'vehicle',
	updateLocation: function( routeTag ){
		var vehicles = webservice.vehicleLocationsAjax( routeTag ),
			vehiclesSelector = '.' + this.className;
		if( routeTag )
			vehiclesSelector += '[data-route-tag="' + routeTag + '"]';
		svg.selectAll( vehiclesSelector ).drawVehicle( vehicles );
	}
};

/*
 * Display details information
 */

function popoverTemplate( data ){
	var html = '';
	if( data.routeTag && webservice.routeConfigStorage[data.routeTag] ){
		html += '' +
			'<div class="route-section">' +
				'<b>' +
					'Route:' +
				'</b>' +
				'<span class="badge" style="background-color: #' + webservice.routeConfigStorage[data.routeTag].$.color + '">' +
					webservice.routeConfigStorage[data.routeTag].$.title +
				'</span>' +
			'</div>';
	}
	if( data.speedKmHr ){
		html += '' +
			'<div class="route-section">' +
				'<b>' +
					'Speed:' +
				'</b>' +
				data.speedKmHr + ' Km/h' +
			'</div>';
	}
	if( data.leadingVehicleId ){
		html += '' +
			'<div class="route-section">' +
				'<b>' +
					'Bus Identifier:' +
				'</b>' +
				data.leadingVehicleId +
			'</div>';
	}
	return html;
}

d3.selection.prototype.drawVehicle = function( json ) {
	var draw = this
		.data(json);

	draw.enter()
		.append( 'circle' )
		.attr("r", "4px")
		.attr("fill", "black");

	draw.exit()
		.remove();

	draw.attr("class", vehicle.className )
		.attr("data-route-tag", function (d) { return d.$.routeTag; } )
		.attr("data-dir-tag", function (d) { return d.$.dirTag; } )
		.attr("data-heading", function (d) { return d.$.heading; } )
		.attr("data-id", function (d) { return d.$.id; } )
		.each(function(d,i){
			var dirTag = d.$.dirTag,
				dirTitle = false,
				route = webservice.routeConfigStorage[d.$.routeTag];
			if(route ){
				if(route.direction ){
					if( route.direction.$){
						if(route.direction.$.tag == dirTag){
							dirTitle = route.direction.$.title;
						} else {
							dirTitle = route.$.title;
						}
					} else {
						$.each(route.direction,function(k,v){
							if(v.$.tag == dirTag){
								dirTitle = v.$.title;
							} else {
								dirTitle = route.$.title;
							}
						})
					}
				}

				$(this).popover({
					'title': dirTitle ? dirTitle : ( route.$.title ? route.$.title : d.$.routeTag ),
					'content': popoverTemplate( d.$ ),
					'placement': 'top'
				});
			}
		})
		.on('mouseenter', function(d){
			route.select(d.$.routeTag)
		})
		.on('mouseleave', route.deselect )
		.transition()
		.attr("cx", function (d) { return projection([d.$.lon,d.$.lat])[0]; })
		.attr("cy", function (d) { return projection([d.$.lon,d.$.lat])[1]; })

	return draw;
};
