(function() {
    Flexical.views.transit = Flexical.Widget.extend({
        init: function() {
            // Tempaltes
            this.stop_template = Handlebars.compile(this.$('.template.flxl-transit-stop-template').html());
            this.time_template = Handlebars.compile(this.$('.template.flxl-transit-time-template').html());
        },

        update: function(stops_data) {

            // Templates
            var stop_template = this.stop_template;
            var time_template = this.time_template;

            // Parent Element
            var $stop_list = this.$el.find('.flxl-transit-stop-list');
            $stop_list.html('');

            // For each stop
            _(stops_data).each(function (stop_data) {
                var stop_id = '';
                var stop_name = '';
                var stop_direction = '';
                var stop_predictions = null;

                // The root element is either a list of predictions
                // or a direclty embedded prediction because
                // some people are bad at APIs
                if (stop_data.predictions instanceof Array) {
                    stop_predictions = stop_data.predictions;
                } else {
                    stop_predictions = [stop_data.predictions];
                }

                // The stop information is not contained in the root
                // element, but rather embedded in each of its children,
                // and furthermore, the schema varies so that information
                // may not be present so we loop over each child and
                // cross our fingers that the information about the stop
                // is in one of the children
                _(stop_predictions).each(function(stop_prediction) {
                    if (stop_prediction.direction) {
                        stop_id = stop_prediction.stopTag;
                        stop_name = stop_prediction.stopTitle.replace(/ At.*/g, '');
                        stop_direction = stop_prediction.direction.title.replace(/ - .*/g, '');
                    }
                });

                // Render the parent element of the stop
                $stop_list.append(stop_template({
                    stop_id: stop_id,
                    stop_name:  stop_name,
                    stop_direction: stop_direction,
                }));

                // Find the stop time list of the element we just rendered
                $stop_times = $stop_list.find('.flxl-transit-stop[data-stop-id=' + stop_id + ']').find('.flxl-transit-stop-direction-times');

                // Collect all stop predictions for each route
                var available_predictions = [];

                // For each stop prediction
                _(stop_predictions).each(function(stop_prediction) {


                    // If there are stop time predictions
                    if (stop_prediction.direction && stop_prediction.direction.prediction) {

                        // Collect all direction predictions
                        var direction_predictions = [];

                        // My god these people are bad at designing APIs.  If there's
                        // only one prediction, it becomes an object rather than an array
                        if (stop_prediction.direction.prediction instanceof Array) {
                            direction_predictions = stop_prediction.direction.prediction;
                        } else {
                            direction_predictions = [stop_prediction.direction.prediction];
                        }

                        // For each time prediction
                        _(direction_predictions).each(function (direction_prediction) {

                            var stop_time = parseInt(direction_prediction.minutes, 10);
                            var stop_time_message = '';

                            // Build a pretty message for the remaining time
                            if (stop_time === 0) {
                                stop_time_message = 'Now';
                            } else if (stop_time === 1) {
                                stop_time_message = '1 min';
                            } else {
                                stop_time_message = stop_time + ' min';
                            }

                            // The time remaining is green by default
                            var stop_time_colour = 'green';

                            // If it's approaching, change the colour accordingly
                            if (stop_time <= 1) {
                                stop_time_colour = 'red';
                            } else if (stop_time <= 5) {
                                stop_time_colour = 'yellow';
                            }

                            // Render the stop time prediction
                            available_predictions.push({
                                stop_time: stop_time,
                                stop_route: stop_prediction.routeTitle,
                                stop_time_message: stop_time_message,
                                stop_time_colour: stop_time_colour
                            });

                        });
                    }

                });

                // Sort the predictions across all routes
                var sorted_predictions = _(available_predictions).sortBy(function(available_prediction) {
                    return available_prediction.stop_time;
                });

                // Render the sorted predictions
                _(sorted_predictions.slice(0, 3)).each(function(sorted_prediction) {
                    $stop_times.append(time_template(sorted_prediction));
                });
            });
        }
    });
})();
