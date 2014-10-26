from nose.tools import assert_equal
from unittest.mock import patch
from ...ut.async_test_tools import with_event_loop
from ...db import db
from .. import core
from . import TestSuite, with_fake_tora_mod


class TestNotice(db.SandboxTestSuiteMixin, TestSuite):

    @with_event_loop
    @with_fake_tora_mod
    def test_notice_all(self):
        query_id = yield from db.add_query(
            db.connection,
            kind='tora',
            text='大嘘'
        )
        user = yield from core.add_user(
            name='foo',
            email='foo@bar.com',
            password='foo',
            conn=db.connection
        )
        yield from db.activate_email_bi_id(
            db.connection,
            user.emails[0].id,
        )
        yield from db.watch(
            db.connection,
            user_id=user.id,
            query_id=query_id,
            email_id=user.emails[0].id
        )
        yield from core.sync(
            kind='tora',
            text='大嘘',
            bind=db.bind
        )
        with patch('torabot.core.notice.send_notices_email') as send:
            yield from core.notice_all(bind=db.bind)
            assert send.called
            assert send.call_args[0]
            assert_equal(send.call_args[0][0], 'foo@bar.com')
