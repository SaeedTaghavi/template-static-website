define(["js/widgets/dropdown-menu/widget"],function(e){var r=[{section:"Visualizations"},{description:"Citation Metrics",navEvent:"show-metrics"},{description:"Author Network",navEvent:"show-author-network"},{description:"Paper Network",navEvent:"show-paper-network"},{description:"Concept Cloud",navEvent:"show-concept-cloud"},{description:"Results Graph",navEvent:"show-bubble-chart"},{divider:!0},{section:"Operations",icon:{class:"icon-help",href:"//adsabs.github.io/help/search/second-order",description:"Discover more about second-order operators"}},{description:"Co-reads",pubsubEvent:"second-order-search/trending"},{description:"Reviews",pubsubEvent:"second-order-search/reviews"},{description:"Useful",pubsubEvent:"second-order-search/useful"},{description:"Similar",pubsubEvent:"second-order-search/similar"}];return function(){return new e({links:r,btnType:"btn-primary-faded",dropdownTitle:"Explore",iconClass:"icon-explore",rightAlign:!0,selectedOption:!0})}});