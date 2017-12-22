'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	indexAction() {
		var self = this;

		var http = require('http');
		var teamname = this.get("teamname");
		var rs = "";
		var options = {
			hostname: 'china.nba.com',
			path: '/static/data/team/schedule_'+teamname+'.json',
			method: 'GET'
		};
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				rs += chunk;
			});
			res.on('end', function(e) {
				self.json(rs);
			});
		});
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		req.end();
	}
}