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
    assert 'Cubes Bootstrap UI' in resp.data

  def test_simple_chart_1(self):
    resp = self.c.get('/simple/chart')
    assert 'function displayChart() {}' in resp.data

  def test_simple_chart_2(self):
    resp = self.c.get('/simple/chart?function_name=foo')
    assert 'function foo() {}' in resp.data

if __name__ == '__main__':
    unittest.main()

