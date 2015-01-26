'use strict';
/*jshint expr: true*/

var path = require('path');
var root = require(path.join(process.env.PWD, 'app', 'controllers', 'root'));

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chai = require('chai');
chai.should();
chai.use(sinonChai);

describe('#index', function () {
	var spy;
	var req; 
	var res;

	beforeEach(function () {
		spy = sinon.spy();

        req = {};
		res = {
            render: spy
		};
	});

	it('should render `index` view', function () {
		// Arrange

		// Act
		root.index(req, res);

		// Assert
		spy.should.have.been.calledWithExactly('layout');
	});
});

describe('#wildcard', function () {
	var spy;
	var req; 
	var res;

	beforeEach(function () {
		spy = sinon.spy();

        req = {
        	path: '/wildcard'
        };
		res = {
            render: spy
		};
	});

	it('should render `wildcard` view', function () {
		// Arrange

		// Act
		root.wildcard(req, res);

		// Assert
		spy.should.have.been.calledWithExactly('wildcard');
	});
});