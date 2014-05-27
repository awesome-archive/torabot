define(function(require, exports, module){
    var self = {
        create_tag_search_regex: require('./create_tag_search_regex'),
        retrieve_tag_search: require('./retrieve_tag_search'),
        reorder_search_results: require('./reorder_search_results'),
        split_result: require('./split_result'),
        complete_tag: function(tag){
            var re = self.create_tag_search_regex(tag, {global: true});
            var main_results = self.retrieve_tag_search(re, self.options.source, {max_results: 100});
            main_results = self.reorder_search_results(tag, main_results);
            var results = main_results;
            self.bubble_rating_tags(results, tag);
            results = results.slice(0, self.options.max_results != null? self.options.max_results:10);
            return self.split_result(results);
        },
        bubble_rating_tags: function(results, tag){
            /* Hack: if the search is one of the ratings shortcuts, put that at the top, even though
             * it's not a real tag. */
            if ("sqe".indexOf(tag) != -1) results.unshift("0`" + tag + "` ");
        },
        match: function(q, cb){
            var tag = q.split(' ').slice(-1)[0];
            if (tag) {
                var ret = self.complete_tag(tag);
                cb($.map(require('main/ut').zip(ret[0], ret[1]), function(args){
                    return {
                        value: args[0],
                        alias: args[1].map(function(x){
                            return {value: x};
                        })
                    };
                }));
            }
        },
        default_options: {
            completion_cache_timeout: 600,
            source: ''
        },
        init: function(options){
            self.options = $.extend({}, self.default_options, options);
        },
        activated: false,
        activate: function(){
            if (self.activated) return;
            var timekey = 'yandere_completion_options_time';
            var datakey = 'yandere_completion_options';
            var last_time = $.localStorage(timekey);
            var last_data = $.localStorage(datakey);
            if (last_data && last_time && self.now() - last_time < 1000 * self.options.completion_cache_timeout) {
                self.options.source = last_data.result.data;
                self.activate_();
            } else {
                $.ajax({
                    url: self.options.completion_options_uri,
                    type: 'get'
                }).done(function(data){
                    self.options.source = data.result.data;
                    self.activate_();
                    $.localStorage(datakey, data);
                    $.localStorage(timekey, self.now());
                });
            }
        },
        now: function(){
            return (new Date()).getTime();
        },
        activate_: function(){
            var last_query = null;
            var update_query = function(suggestion, options){
                options = $.extend({
                    query: null,
                    set: function(value){ return require('main/search').$q.val(value); }
                }, options);
                var query = options.query;
                if (!query) {
                    last_query = query = require('main/search').$q.typeahead('val');
                }
                var tags = query.split(' ').slice(0, -1);
                tags.push(suggestion.value);
                return options.set(tags.join(' '));
            };
            require('main/search').$q.typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                name: 'yandere',
                displayKey: 'value',
                source: self.match,
                templates: {
                    suggestion: require('handlebars').compile([
                        "<p class=completion-item>",
                        "<strong class=ellipsis>{{value}}</strong>",
                        "{{#if alias}}<br>{{#each alias}}<span class='ellipsis label label-default'>{{value}}</span> {{/each}}{{/if}}",
                        "</p>"
                    ].join(''))
                }
            }).on('typeahead:cursorchanged', function(e, suggestion, dataset){
                update_query(suggestion);
                e.preventDefault();
            }).on('typeahead:selected', function(e, suggestion, dataset){
                var $this = $(this);
                update_query(suggestion, {
                    query: last_query,
                    set: function(value) { return $this.typeahead('val', value); }
                });
                e.preventDefault();
            });
            self.activated = true;
        },
        deactivate: function(){
            if (!self.activated) return;
            require('main/search').$q.typeahead('destroy');
            self.activated = false;
        }
    };
    module.exports = {
        init: self.init,
        activate: self.activate,
        deactivate: self.deactivate
    };
});
