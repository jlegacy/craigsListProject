(function () {

	var $createVisualTreeJSON = function () {};

	$createVisualTreeJSON.getJSON = function (data, title) {
		var nodeArray = [];
		var treeJSON = {};
		var nodeItem = {};
		var podItem = {};
		var index;
		var podObj;

		treeJSON.name = title;
		treeJSON.children = [];

		//capture pod names as parents//
		_.each(data.items, function (item) {
			podItem = {};
			podItem.name = item.metadata.name;
			podItem.type = 'pod';
			index = _.findIndex(treeJSON.children, function (podName) {
					return podName.name == item.metadata.name
				})
				if (index < 0) {
					treeJSON.children.push(podItem);
				};

			//Search the tree for pod name and return object
			podObj = _.find(treeJSON.children, function (podName) {
					return podName.name == item.metadata.name
				});

			if (!podObj.children) {
				podObj.children = [];
			};

			podObj.children.push({
				name : item.spec.nodeName,
				status : item.status.phase,
				type: 'node'
			});

		});

		return treeJSON;
	};
	
	function update(data) {

  // DATA JOIN
  // Join new data with old elements, if any.
  var text = svg.selectAll("g")
  	.data(data);

  // UPDATE
  // Update old elements as needed.
  text.attr("class", "update");

  // ENTER
  // Create new elements as needed.
  text.enter().append("g")
  .attr("class", "enter")
  .attr("x", function (d, i) {
  	return i * 32;
  })
  .attr("dy", ".35em");

  // ENTER + UPDATE
  // Appending to the enter selection expands the update selection to include
  // entering elements; so, operations on the update selection after appending to
  // the enter selection will apply to both entering and updating nodes.
  text.text(function (d) {
  	return d;
  });

  // EXIT
  // Remove old elements as needed.
  text.exit().remove();
  };

	$createVisualTreeJSON.render = function (orient, project) {
		var margin = {
			top : 20,
			right : 120,
			bottom : 20,
			left : 120
		},
		width = 960 - margin.right - margin.left,
		height = 800 - margin.top - margin.bottom;

		var i = 0,
		duration = 750,
		rerenderDuration = 10000, 
		touched = false,
		skipCount = 0,
		root;

		var tree = d3.layout.tree()
			.size([height, width]);

		var diagonal = d3.svg.diagonal()
			.projection(function (d) {

				if (orient === 'Vert') {
					return [d.x, d.y];
				} else {
					return [d.y, d.x];
				}

			});

		var svg = d3.select(".canvas").append("svg")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var flare;
		var title = project;
		
		rerender(margin);
		//loop every x number of seconds and refresh chart//
		setInterval(function () {rerender(margin);}, rerenderDuration);

		d3.select(self.frameElement).style("height", "800px");

		/*
		 * Attach a context menu to a D3 element
		 */

		contextMenuShowing = false;

		d3.select("body").on('contextmenu', function (d, i) {
			console.log('clicked on context');
			if (contextMenuShowing) {
				d3.event.preventDefault();
				d3.select(".popup").remove();
				contextMenuShowing = false;
			} else {
				d3_target = d3.select(d3.event.target);
				data = d3_target.datum();
				if (data.type === ("node") || data.type ==='pod') {
					d3.event.preventDefault();
					contextMenuShowing = true;
					d = d3_target.datum();
					
					canvas = d3.select(".canvas");
					mousePosition = d3.mouse(canvas.node());

					popup = canvas.append("div")
						.attr("class", "popup")
						.style("left", mousePosition[0] + "px")
						.style("top", mousePosition[1] + "px");
					popup.append("h2").text('Details');
					popup.append("p").text("Name: " + d.name);
					if (d.status)
					{
					popup.append("p").text("Status: " + d.status);
					}
					popup.append("p").text("Type: " + d.type);
					popup.append("p")
					.append("a")
					.attr("href", d.link)
					.text(d.link_text);

					canvasSize = [
						canvas.node().offsetWidth,
						canvas.node().offsetHeight
					];

					popupSize = [
						popup.node().offsetWidth,
						popup.node().offsetHeight
					];

					if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
						popup.style("left", "auto");
						popup.style("right", 0);
					}

					if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
						popup.style("top", "auto");
						popup.style("bottom", 0);
					}
				}
			}
		});
		
		function rerender(margin) {
			
		//Freeze updating of the chart if a user has clicked anywhere on chart 
		//Chart is set to rerender every 10 seconds
		//So if chart is touched, then hold off on update for about 50 seconds...10 secs * 5 touches
			if (touched) {
				skipCount += 1;
				if (skipCount = 5) {
					touched = false;
					skipCount = 0;
				}
				return;
			}
	
			duration = 0;
		
			var data = {};
			data.token = $App.GetUserSession();
			data.project = project;
			$.when($ChartModels.GetPodsByProject(data)).done(function (returnData) {
	
					flare = $createVisualTreeJSON.getJSON(JSON.parse(returnData), title);
			
					root = flare;
					root.x0 = height / 2;
					root.y0 = 0;

					function collapse(d) {
						if (d.children) {
							d._children = d.children;
							d._children.forEach(collapse);
							d.children = null;
						}
					}

					update(root);
			});

		};

		function update(source) {

			// Compute the new tree layout.
			var nodes = tree.nodes(root).reverse(),
			links = tree.links(nodes);

			// Normalize for fixed-depth.
			nodes.forEach(function (d) {
				d.y = d.depth * 180;
			});

			// Update the nodes…
			var node = svg.selectAll("g.node")
				.data(nodes, function (d) {
					return d.id || (d.id = ++i);
				});

			// Enter any new nodes at the parent's previous position.
			var nodeEnter = node.enter().append("g")
				.attr("class", "node")
				.attr("transform", function (d) {
					return "translate(" + source.y0 + "," + source.x0 + ")";
				})
				.on("click", click);

			
				
			nodeEnter.append("circle")
			.attr("r", 10)
			.style("fill", function (d) {
				return d._children ? "red" : "#fff";
			});
			
			nodeEnter.append("text")
			.attr("x", function (d) {
				return d.children || d._children ? -25 : 25;
			})
			.attr("dy", ".35em")
			.attr("text-anchor", function (d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function (d) {
				return d.name;
			})
			.style("fill-opacity", 1e-6);
			
			//Append Image//
			
			nodeEnter.append("image")
			.attr("x", function (d) {
				return -25;
			})
			.attr("y", function (d) {
				return -25;
			})
			.attr("height", function (d) {
				return 50;
			})
			.attr("width", function (d) {
				return 50;
			})
			.attr("width", function (d) {
				return 50;
			})
			.attr("xlink:href", function (d) {
				
				switch (d.type) {
						case 'pod':
							return '../../content/img/dockerImage.jpg';
							break;
						case 'node':
							if (d.status === 'Running')
							{
								return '../../content/img/serverRunning.jpg';
							}
							else
							{
								return '../../content/img/serverStopped.jpg';
							}
							break;
						default:
							return "";
							break;
						};
			})	
		
			
			// Transition nodes to their new position.
			var nodeUpdate = node.transition()
				.duration(duration)
				.attr("transform", function (d) {
					if (orient === 'Vert') { 
							return "translate(" + d.x + "," + d.y + ")";
						}
						else {
							return "translate(" + d.y + "," + d.x + ")";
						}

					});
				
					nodeUpdate.select("circle")
					.attr("r", 10)
					.style("fill", function (d) {
						return d._children ? "red" : "#fff";
					});

					nodeUpdate.select("text")
					.style("fill-opacity", 1)
				
					// Transition exiting nodes to the parent's new position.
					var nodeExit = node.exit().transition()
						.duration(duration)
						.attr("transform", function (d) {
							return "translate(" + source.y + "," + source.x + ")";
						})
						.remove();

					nodeExit.select("circle")
					.attr("r", 10);

					nodeExit.select("text")
					.style("fill-opacity", 10)
					

					// Update the links…
					var link = svg.selectAll("path.link")
						.data(links, function (d) {
							return d.target.id;
						});

					// Enter any new links at the parent's previous position.
					link.enter().insert("path", "g")
					.attr("class", "link")
					.attr("d", function (d) {
						var o = {
							x : source.x0,
							y : source.y0
						};
						return diagonal({
							source : o,
							target : o
						});
					});

					// Transition links to their new position.
					link.transition()
					.duration(duration)
					.attr("d", diagonal);

					// Transition exiting nodes to the parent's new position.
					link.exit().transition()
					.duration(duration)
					.attr("d", function (d) {
						var o = {
							x : source.x,
							y : source.y
						};
						return diagonal({
							source : o,
							target : o
						});
					})
					.remove();

					// Stash the old positions for transition.
					nodes.forEach(function (d) {
						d.x0 = d.x;
						d.y0 = d.y;
					});
					
				}

				  	// Toggle children on click.
				 	function click(d) {
						
						touched = true;
						duration = 750;
						skipCount = 0;
						
				 		 if (d.children) {
				 			d._children = d.children;
				 			d.children = null;
				 		} else {
				 			d.children = d._children;
				 			d._children = null;
				 		} 
				 		update(d);
				 	} 
		}

		window.$createVisualTreeJSON = $createVisualTreeJSON
			return (this);
	}
	());
