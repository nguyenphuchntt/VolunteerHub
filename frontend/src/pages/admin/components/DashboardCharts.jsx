
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Box, Card, CardContent, Typography } from '@mui/material';

const DashboardCharts = ({ newUsersData, newEventsData }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Thống kê 7 ngày qua
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
        {/* New Users Chart */}
        <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Người dùng mới
            </Typography>
            <div style={{ width: '100%', height: 300, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={newUsersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [value, "Người dùng"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: "#10b981" }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* New Events Chart */}
        <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid", borderColor: "grey.200" }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Sự kiện mới
            </Typography>
            <div style={{ width: '100%', height: 300, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newEventsData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [value, "Sự kiện"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardCharts;
