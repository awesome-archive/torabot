define("torabot/yandere/0.1.0/yandere",["./create_tag_search_regex","./retrieve_tag_search","./reorder_search_results","./split_result","main/ut","main/completion"],function(a,b,c){var d={create_tag_search_regex:a("./create_tag_search_regex"),retrieve_tag_search:a("./retrieve_tag_search"),reorder_search_results:a("./reorder_search_results"),split_result:a("./split_result"),complete_tag:function(a){var b=d.create_tag_search_regex(a,{global:!0}),c=d.retrieve_tag_search(b,d.options.source,{max_results:100});c=d.reorder_search_results(a,c);var e=c;return d.bubble_rating_tags(e,a),e=e.slice(0,null!=d.options.max_results?d.options.max_results:10),d.split_result(e)},bubble_rating_tags:function(a,b){-1!="sqe".indexOf(b)&&a.unshift("0`"+b+"` ")},match:function(b,c){var e=b.split(" ").slice(-1)[0];if(e){var f=d.complete_tag(e);c($.map(a("main/ut").zip(f[0],f[1]),function(a){return{value:a[0],alias:a[1].map(function(a){return{value:a}})}}))}},default_options:{completion_cache_timeout:600,source:""},init:function(b){d.options=$.extend({},d.default_options,b),d.completion=a("main/completion").make({source:d.match})},activated:function(){return d.completion.activated()},activate:function(){if(!d.activated()){var a="yandere_completion_options_time",b="yandere_completion_options",c=$.localStorage(a),e=$.localStorage(b);e&&c&&d.now()-c<1e3*d.options.completion_cache_timeout?(d.options.source=e.result.data,d.activate_()):(e&&(d.options.source=e.result.data,d.activate_()),$.ajax({url:d.options.completion_options_uri,type:"get"}).done(function(c){d.options.source=c.result.data,d.activate_(),$.localStorage(b,c),$.localStorage(a,d.now())}))}},now:function(){return(new Date).getTime()},activate_:function(){return d.completion.activate()},deactivate:function(){return d.completion.deactivate()}};c.exports={init:d.init,activate:d.activate,deactivate:d.deactivate}}),define("torabot/yandere/0.1.0/create_tag_search_regex",[],function(a,b,c){c.exports=function(a,b){var c=a.split(""),d=[],e="(([^`]*_)?";if($.map(c,function(a){var b=RegExp.escape(a);e+=b}),e+=")",d.push(e),-1!=a.indexOf("_")){var f=a.split("_",1)[0],g=a.slice(f.length+1);f=RegExp.escape(f),g=RegExp.escape(g);var e="(";e+="("+f+"[^`]*_"+g+")",e+="|",e+="("+g+"[^`]*_"+f+")",e+=")",d.push(e)}if(!b.top_results_only){var e="(";$.map(c,function(a){var b=RegExp.escape(a);e+=b,e+="[^`]*"}),e+=")",d.push(e)}var h=d.join("|");return h="(\\d+)[^ ]*`("+h+")[^`]*`[^ ]* ",new RegExp(h,b.global?"g":"")}}),define("torabot/yandere/0.1.0/retrieve_tag_search",[],function(a,b,c){c.exports=function(a,b,c){var d=[],e=10;for(null!=c.max_results&&(e=c.max_results);d.length<e;){var f=a.exec(b);if(!f)break;var g=f[0];-1==g.indexOf(":deletethistag:")&&-1==d.indexOf(g)&&d.push(g)}return d}}),define("torabot/yandere/0.1.0/reorder_search_results",["torabot/yandere/0.1.0/create_tag_search_regex"],function(a,b,c){c.exports=function(b,c){var d=a("torabot/yandere/0.1.0/create_tag_search_regex")(b,{top_results_only:!0,global:!1}),e=[],f=[];return $.map(c,function(a){d.test(a)?e.push(a):f.push(a)}),e.concat(f)}}),define("torabot/yandere/0.1.0/split_result",[],function(a,b,c){c.exports=function(a){var b=[],c=[];return $.map(a,function(a){var d=a.match(/(\d+)`([^`]*)`(([^ ]*)`)? /);if(!d)throw ReportError("Unparsable cached tag: '"+a+"'",null,null,null,null),"Unparsable cached tag: '"+a+"'";var a=d[2],e=d[4];e=d[4]?e.split("`"):[],-1==b.indexOf(a)&&(b.push(a),c.push(e))}),[b,c]}});
