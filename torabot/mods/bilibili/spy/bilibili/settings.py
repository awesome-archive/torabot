# Scrapy settings for bilibili project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'bilibili'

SPIDER_MODULES = ['bilibili.spiders']
NEWSPIDER_MODULE = 'bilibili.spiders'

ITEM_PIPELINES = {
    'torabot.spy.pipelines.Output': 42,
}

DOWNLOADER_MIDDLEWARES = {
    'scrapy.contrib.downloadermiddleware.useragent.UserAgentMiddleware': None,
    'scrapy.contrib.downloadermiddleware.retry.RetryMiddleware': None,
    'torabot.spy.middlewares.RotateUserAgentMiddleware': 400,
}

# To make RotateUserAgentMiddleware enable.
USER_AGENT = ''
HTTPCACHE_ENABLED = False
DNSCACHE_ENABLED = True
DOWNLOAD_DELAY = 0.1
AUTOTHROTTLE_ENABLED = False
COOKIES_ENABLED = False
