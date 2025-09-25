
//
// controls for resume timeline
//

var tl;

function onLoad()
{
	var tl_el;
	var eventSource1;
	var theme;
	var bandInfos;
	var band1, band2, band3;

	// current date to initialize the position
	var d = Timeline.DateTime.parseGregorianDateTime("2020")

	// event sources
	eventJobs = new Timeline.DefaultEventSource();
	eventTech = new Timeline.DefaultEventSource();
	eventProjects = new Timeline.DefaultEventSource();

	// set up the theme
	theme = Timeline.ClassicTheme.create();
	theme.timeline_start = new Date(Date.UTC(1975,0,1,0,0,0,0));
	theme.timeline_stop  = new Date(Date.UTC(2026,0,1,0,0,0,0));

	theme.event.bubble.width = 450;
	theme.event.bubble.height = 300;

	theme.event.tape.height = 6;
//	theme.event.tape.gap = 2;
//	theme.event.tape.offset = 2;
	theme.event.track.offset = 15;
	theme.event.track.height = 20;
	theme.ether.interval.marker.hAlign = "Top";

	// 3 bands for jobs, tech expertise, and achievements
	band1 = {
				width:          "35%", 
				intervalUnit:   Timeline.DateTime.YEAR, 
				intervalPixels: 50,
				theme:          theme,
				eventSource:    eventProjects,
				layout:         'original' 
			};
	band2 = {
				width:          "45%", // set to a minimum, autoWidth will then adjust
				intervalUnit:   Timeline.DateTime.DECADE, 
				intervalPixels: 250,
				eventSource:    eventTech,
				theme:          theme,
				layout:         'original' 
			};
	band3 = {
				width:          "20%", // set to a minimum, autoWidth will then adjust
				intervalUnit:   Timeline.DateTime.DECADE, 
				intervalPixels: 250,
				eventSource:    eventJobs,
				date:           d,
				theme:          theme,
				layout:         'original' 
			};


	bandInfos = [
					Timeline.createBandInfo(band1),
					Timeline.createBandInfo(band2),
					Timeline.createBandInfo(band3)
			];
	bandInfos[1].syncWith = 0;
	bandInfos[1].highlight = true;
	bandInfos[2].syncWith = 0;
	bandInfos[2].highlight = true;

	for (var i = 0; i < bandInfos.length; i++) {
		bandInfos[i].decorators = [
			new Timeline.PointHighlightDecorator(
				{
					date:       "Sun Dec 15 2024 01:01:01 GMT-0500",
					color:      "#000",
					opacity:    70,
					cssClass:   'p-highlight1'
				}
			)
		];
	}


	// create the Timeline
	tl = Timeline.create(document.getElementById("tl"), bandInfos, Timeline.HORIZONTAL);
	tl.loadXML(
				"resource/event_tech.xml", 
				function(xml, url)
				{
					eventTech.loadXML(xml, url);
				}
			);
	tl.loadXML(
				"resource/event_projects.xml", 
				function(xml, url)
				{
					eventProjects.loadXML(xml, url);
				}
			);
	tl.loadXML(
				"resource/event_jobs.xml", 
				function(xml, url)
				{
					eventJobs.loadXML(xml, url);
				}
			);

	reLayout();
}


// page layout on resize
var resizeTimerID = null;

function reLayout()
{
	var h;

	resizeTimerID = null;
//	h = $( window ).height() - 180;
//	$("#tl").height(h);
	tl.layout();
}

function onResize()
{
	if (resizeTimerID == null) {
		resizeTimerID = window.setTimeout( reLayout, 500 );
	}
}



//
// custom loader for the info bubble
//
var oldFillInfoBubble = Timeline.DefaultEventSource.Event.prototype.fillInfoBubble;

function bubbleDetail(elmt, theme, labeller)
{
	oldFillInfoBubble.call(this, elmt, theme, labeller);

	var eventObject = this;
	var bubbleBody = $( elmt ).children(".timeline-event-bubble-body");
	var link;

	// skip this if not HTML page
	if ( $( bubbleBody ).text().length > 20 ) {
		return;
	}
	link = "resource/" + $( bubbleBody ).text();
	$( bubbleBody ).load( link );
}

Timeline.DefaultEventSource.Event.prototype.fillInfoBubble = bubbleDetail;



