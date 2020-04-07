
import React, { Component } from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import get from 'lodash.get';

export default class LBStats extends Component {
    render() {
        const { list } = this.props;
        const data = list.map(item => {
            return {
                name: item.name,
                pending: get(item, 'json.totalRequestSize', 0) - get(item, 'json.totalServicedSize', 0),
                completed: get(item, 'json.totalServicedSize', 0)
            }
        });
        return <div className="w3-center" style={{ height: "240px", marginBottom: "40px" }}>
            <b>Activity Status</b>
            <ResponsiveContainer className="w3-section" width="100%" >
                <BarChart data={data} >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="pending" stackId="a" fill="#F0E68C" />
                    <Bar dataKey="completed" stackId="a" fill="#82ca9d" />
                    <Tooltip cursor={{ stroke: 'rgba(0,0,0,0.1)', fill: 'rgba(0,0,0,0.2)', strokeWidth: 2 }} />
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </div>
    }
}
