from __future__ import absolute_import

from celery import shared_task
from celery.utils.log import get_task_logger
from django.apps import apps

import time

logger = get_task_logger(__name__)


@shared_task
def execute(session_id):
    logger.info('BMD exeuction -> {}'.format(session_id))
    session = apps.get_model('bmd', 'BMDSession').objects.get(id=session_id)
    time.sleep(5)
    session.execute()
