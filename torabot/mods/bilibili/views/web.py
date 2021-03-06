from urllib.parse import quote
from flask import render_template
from logbook import Logger
from copy import deepcopy
from ..query import get_bangumi, parse
from .. import name, bp


log = Logger(__name__)


@bp.route('/bilibili_<hash>.html')
def bilibili_site_verification(hash):
    return bp.send_static_file('bilibili_%s.html' % hash)


def format_query_result(query):
    query = deepcopy(query)
    query.result.query = parse(query.text)
    return render_template('bilibili/result/%s.html' % query.result.query.method, query=query)


def format_notice_body(notice):
    return {
        'update': format_sp_notice_body,
        'sp_update': format_sp_notice_body,
        'sp_new': format_sp_notice_body,
        'user_new_post': format_post_notice_body,
        'query_new_post': format_post_notice_body,
    }[notice.change.kind](notice)


def format_post_notice_body(notice):
    return "bilibili: 新投稿 <a href='%(uri)s'>%(title)s</a>" % dict(
        title=notice.change.post.get('title', ''),
        uri=notice.change.post.uri,
    )


def format_sp_notice_body(notice):
    return "bilibili: <a href='%(uri)s'>%(title)s</a> 更新至第%(n)d话" % dict(
        uri='http://www.bilibili.tv/sp/' + quote(notice.change.sp.title),
        title=notice.change.sp.title,
        n=int(notice.change.sp.bgmcount),
    )


def format_bangumi_search():
    return render_template(
        'bilibili/search/bangumi.html',
        bangumi=get_bangumi(),
        kind=name,
    )


def format_user_search():
    return render_template('bilibili/search/user.html', kind=name)


def format_username_search():
    return render_template('bilibili/search/username.html', kind=name)


def format_query_search():
    return render_template('bilibili/search/query.html', kind=name)


def format_advanced_search(**kargs):
    return {
        'sp': format_bangumi_search,
        'user': format_user_search,
        'username': format_username_search,
        'query': format_query_search,
    }[kargs.get('method', 'sp')]()


def format_help_page():
    return render_template('bilibili/help.html')
