#!/usr/bin/env python
# -*- coding: utf-8 -*-

import unittest
import cubesui

class CubesUITestCase(unittest.TestCase):

  def setUp(self):
    cubesui.app.config['TESTING'] = True
    self.c = cubesui.app.test_client()

  def test_index(self):
    resp = self.c.get('/')
    assert 'xxx' in resp.data

if __name__ == '__main__':
    unittest.main()

